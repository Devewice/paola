<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { OPERAR_COPY } from '@app/constants/operar.ts'
import type { ShopModule } from '@modules/shop/index.ts'
import type { MysteryOperatorCardDraft } from '@modules/shop/domain/entities/MysteryDeck.ts'
import Alert from '@ui/Alert.vue'
import Button from '@ui/Button.vue'
import Choice from '@ui/Choice.vue'
import Field from '@ui/Field.vue'
import Input from '@ui/Input.vue'
import Select from '@ui/Select.vue'

const props = defineProps<{
  module: ShopModule
  clave: string
}>()

const copy = OPERAR_COPY

type DraftRow = {
  productId: string
  couponCode: string
  active: boolean
}

const enabled = ref(false)
const deckSize = ref('3')
const rows = ref<DraftRow[]>([])
const error = ref('')
const notice = ref('')
const busy = ref(false)

const products = computed(() => {
  const shelves = props.module.getShelves()
  return [...shelves.own, ...shelves.collab]
})

const productOptions = computed(() => [
  { value: '', label: '—' },
  ...products.value.map((item) => ({ value: item.id, label: item.title })),
])

const sizeOptions = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({
  value: String(n),
  label: String(n),
}))

function randomCoupon(): string {
  const chunk = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `PAOLA-${chunk}`
}

function addRow() {
  const first = products.value[0]
  rows.value = [
    ...rows.value,
    {
      productId: first?.id ?? '',
      couponCode: randomCoupon(),
      active: true,
    },
  ]
}

function removeRow(index: number) {
  rows.value = rows.value.filter((_, i) => i !== index)
}

async function load() {
  error.value = ''
  const result = await props.module.loadOperatorMystery(props.clave)
  if (!result.ok) {
    error.value = result.error.message || copy.mysteryLoadFail
    return
  }
  enabled.value = result.value.settings.enabled
  deckSize.value = String(result.value.settings.deckSize)
  rows.value = result.value.cards.map((card) => ({
    productId: card.productId,
    couponCode: card.couponCode,
    active: card.active,
  }))
  if (!rows.value.length && products.value.length) addRow()
}

async function save() {
  busy.value = true
  error.value = ''
  notice.value = ''
  const cards: MysteryOperatorCardDraft[] = rows.value.map((row) => ({
    productId: row.productId,
    couponCode: row.couponCode.trim().toUpperCase(),
    active: row.active,
  }))
  const result = await props.module.saveOperatorMystery(props.clave, {
    enabled: enabled.value,
    deckSize: Number(deckSize.value) || 3,
    cards,
  })
  busy.value = false
  if (!result.ok) {
    error.value = result.error.message || copy.mysteryFail
    return
  }
  notice.value = copy.mysterySaved
  enabled.value = result.value.settings.enabled
  deckSize.value = String(result.value.settings.deckSize)
  rows.value = result.value.cards.map((card) => ({
    productId: card.productId,
    couponCode: card.couponCode,
    active: card.active,
  }))
}

onMounted(() => {
  void load()
})
</script>

<template>
  <section class="stack mystery-admin">
    <header class="stack" style="gap: 8px">
      <h2 class="kit" style="margin: 0">{{ copy.mysteryTitle }}</h2>
      <p class="meta" style="margin: 0">{{ copy.mysteryLead }}</p>
    </header>

    <Alert v-if="!products.length" tone="warn">{{ copy.mysteryEmptyProducts }}</Alert>
    <Alert v-if="error" tone="bad">{{ error }}</Alert>
    <Alert v-if="notice" tone="ok">{{ notice }}</Alert>

    <Choice v-model="enabled" :label="copy.mysteryEnabled" />
    <Select v-model="deckSize" :label="copy.mysteryDeckSize" :options="sizeOptions" />

    <div v-for="(row, index) in rows" :key="index" class="mystery-admin__row">
      <Select
        v-model="row.productId"
        :label="copy.mysteryProduct"
        :options="productOptions"
      />
      <Field :label="copy.mysteryCoupon">
        <Input v-model="row.couponCode" />
      </Field>
      <Choice v-model="row.active" :label="copy.mysteryActive" />
      <Button size="sm" variant="ghost" @click="removeRow(index)">{{ copy.mysteryRemove }}</Button>
    </div>

    <div class="row" style="gap: 8px">
      <Button size="sm" variant="ghost" :disabled="!products.length" @click="addRow">{{ copy.mysteryAdd }}</Button>
      <Button size="sm" :disabled="busy || !products.length" @click="save">{{ copy.mysterySave }}</Button>
    </div>
  </section>
</template>
