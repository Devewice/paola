<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import type { MysteryDeckCard } from '@modules/shop/domain/entities/MysteryDeck.ts'
import { SHOP_COPY } from '@modules/shop/constants/copy.ts'
import { formatProductPrice } from '@modules/shop/presentation/formatPrice.ts'
import { appTiendaFicha } from '@shared/http/constants.ts'
import Button from '@ui/Button.vue'
import Modal from '@ui/Modal.vue'

const props = defineProps<{
  cards: readonly MysteryDeckCard[]
  registered: boolean
}>()

const emit = defineEmits<{
  pick: [cardId: string]
  needAuth: []
}>()

const copy = SHOP_COPY
const shuffled = ref(false)
const focusId = ref<string | null>(null)

const focusCard = computed(() => props.cards.find((card) => card.id === focusId.value) ?? null)

onMounted(() => {
  window.setTimeout(() => {
    shuffled.value = true
  }, 40)
})

watch(
  () => props.cards.map((card) => `${card.id}:${card.face}`).join('|'),
  () => {
    shuffled.value = false
    window.setTimeout(() => {
      shuffled.value = true
    }, 40)
  },
)

function fanStyle(index: number, total: number): Record<string, string> {
  const mid = (total - 1) / 2
  const offset = index - mid
  const rot = offset * 7
  const x = offset * 18
  const y = Math.abs(offset) * 4
  return {
    '--deal-rot': `${rot}deg`,
    '--deal-x': `${x}px`,
    '--deal-y': `${y}px`,
    '--deal-z': String(10 + index),
  }
}

function onCardClick(card: MysteryDeckCard) {
  if (card.face === 'open') {
    focusId.value = card.id
    return
  }
  if (!props.registered) {
    emit('needAuth')
    return
  }
  emit('pick', card.id)
}

function closeFocus() {
  focusId.value = null
}

watch(
  () => props.cards,
  (next) => {
    if (focusId.value) {
      const still = next.find((card) => card.id === focusId.value)
      if (still?.face === 'open') focusId.value = still.id
    }
  },
)
</script>

<template>
  <aside class="deal-deck" :class="{ 'is-shuffled': shuffled }" :aria-label="copy.deckKicker">
    <p class="deal-deck__kicker">{{ copy.deckKicker }}</p>
    <p class="meta deal-deck__lead">{{ copy.deckLead }}</p>
    <div class="deal-deck__stage">
      <button
        v-for="(card, index) in cards"
        :key="card.id"
        type="button"
        class="deal-card"
        :class="{
          'deal-card--open': card.face === 'open',
          'deal-card--mystery': card.face === 'mystery',
          'is-flipping': card.face === 'open',
        }"
        :style="fanStyle(index, cards.length)"
        @click="onCardClick(card)"
      >
        <span class="deal-card__inner">
          <span class="deal-card__face deal-card__face--back" aria-hidden="true">
            <span class="deal-card__silhouette" />
            <span class="deal-card__mark">?</span>
          </span>
          <span class="deal-card__face deal-card__face--front">
            <template v-if="card.face === 'open'">
              <img
                v-if="card.product.photoSrc"
                :src="card.product.photoSrc"
                :alt="card.product.title"
              />
              <span v-else class="deal-card__blank">{{ copy.dealMediaLabel }}</span>
            </template>
          </span>
        </span>
      </button>
    </div>
  </aside>

  <Modal
    :model-value="Boolean(focusCard && focusCard.face === 'open')"
    :title="focusCard && focusCard.face === 'open' ? focusCard.product.title : copy.deckKicker"
    @update:model-value="closeFocus"
  >
    <template v-if="focusCard && focusCard.face === 'open'">
      <p class="price" style="margin: 0 0 12px">{{ formatProductPrice(focusCard.product.priceCop) }}</p>
      <p class="meta" style="margin: 0 0 8px">{{ copy.deckCouponLabel }}</p>
      <p class="deal-deck__coupon">{{ focusCard.couponCode }}</p>
      <div class="row" style="margin-top: 16px; gap: 8px">
        <Button size="sm" :to="appTiendaFicha(focusCard.product.id)">{{ copy.deckRedeemCta }}</Button>
        <Button size="sm" variant="ghost" @click="closeFocus">{{ copy.backCta }}</Button>
      </div>
    </template>
  </Modal>
</template>
