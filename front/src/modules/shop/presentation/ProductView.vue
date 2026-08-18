<script setup lang="ts">
import { computed } from 'vue'
import { SHOP_COPY, SHOP_EMPTY_FICHA, SHOP_KIND, shopStockCopy } from '@modules/shop/constants/copy.ts'
import type { ShopModule } from '@modules/shop/index.ts'
import { formatProductPrice } from '@modules/shop/presentation/formatPrice.ts'
import { APP_PATHS } from '@shared/http/constants.ts'
import { usePageReveal } from '@shared/motion/usePageReveal.ts'
import { MASCOT } from '@shared/ui/mascot.ts'
import PaolaAlert from '@ui/PaolaAlert.vue'
import PaolaButton from '@ui/PaolaButton.vue'
import PaolaCard from '@ui/PaolaCard.vue'
import PaolaEmpty from '@ui/PaolaEmpty.vue'
import PaolaVoiceBadge from '@ui/PaolaVoiceBadge.vue'
import PaolaZoneBadge from '@ui/PaolaZoneBadge.vue'

const props = defineProps<{
  module: ShopModule
  productId: string
}>()

const product = computed(() => props.module.getProduct(props.productId))
const shelves = computed(() => props.module.getShelves())
const contact = computed(() => props.module.getContact())
const bindReveal = usePageReveal()
const collab = computed(() => product.value?.kind === SHOP_KIND.COLLAB)
const copy = SHOP_COPY
const mascot = MASCOT
const shopPath = APP_PATHS.TIENDA
</script>

<template>
  <article :ref="bindReveal" class="paola-page">
    <template v-if="product">
      <PaolaVoiceBadge :voice="collab ? 'incauta' : 'loigca'" />
      <p class="paola-empty__kicker">{{ collab ? copy.kindCollab : copy.kindOwn }}</p>
      <h1 class="paola-afiche__title type-display">{{ product.title }}</h1>
      <p class="paola-product__price">{{ formatProductPrice(product.priceCop) }}</p>
      <p v-if="product.stock !== null" class="paola-page__copy paola-page__copy--muted">
        {{ shopStockCopy(product.stock) }}
      </p>

      <PaolaCard v-if="product.photoSrc" class="shop-ficha__media">
        <img class="shop-ficha__photo" :src="product.photoSrc" :alt="product.title" />
      </PaolaCard>

      <p class="paola-page__copy">{{ product.description }}</p>

      <section class="paola-page__block" :aria-label="copy.deliveryAria">
        <div class="shop-page__zones">
          <PaolaZoneBadge zone="bogota" />
          <PaolaZoneBadge zone="soacha" />
          <PaolaZoneBadge zone="fuera" />
        </div>
        <PaolaAlert tone="info">{{ shelves.deliveryCopy }}</PaolaAlert>
        <PaolaAlert tone="warn">{{ shelves.warrantyCopy }}</PaolaAlert>
      </section>

      <div class="shop-ficha__cta">
        <PaolaButton variant="hero" :href="contact.whatsappHref" target="_blank">
          {{ copy.writeCta }}
        </PaolaButton>
        <PaolaButton variant="ghost" :href="`mailto:${contact.email}`">{{ copy.mailCta }}</PaolaButton>
        <PaolaButton variant="ghost" :to="shopPath">{{ copy.backCta }}</PaolaButton>
      </div>
    </template>

    <PaolaEmpty
      v-else
      compact
      hide-cta
      :title="copy.fichaEmptyTitle"
      :copy="SHOP_EMPTY_FICHA"
      :mascot-src="mascot.TUMBADA"
    />
    <p v-if="!product" class="shop-ficha__cta">
      <PaolaButton variant="ghost" :to="shopPath">{{ copy.backCta }}</PaolaButton>
    </p>
  </article>
</template>

<style scoped>
.shop-page__zones {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.shop-ficha__media {
  margin: 16px 0;
}

.shop-ficha__photo {
  width: 100%;
  max-height: 280px;
  object-fit: cover;
  border-radius: 10px;
}

.shop-ficha__cta {
  display: grid;
  gap: 12px;
  margin-top: 16px;
}
</style>
