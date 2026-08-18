<script setup lang="ts">
import { computed } from 'vue'
import type { ShopModule } from '@modules/shop/index.ts'
import { SHOP_EMPTY_FICHA } from '@modules/shop/index.ts'
import { formatProductPrice } from '@modules/shop/presentation/formatPrice.ts'
import { usePageReveal } from '@shared/motion/usePageReveal.ts'
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
const collab = computed(() => product.value?.kind === 'colaboracion')
</script>

<template>
  <article :ref="bindReveal" class="paola-page">
    <template v-if="product">
      <PaolaVoiceBadge :voice="collab ? 'incauta' : 'loigca'" />
      <p class="paola-empty__kicker">{{ collab ? 'Colaboración' : 'Marca propia' }}</p>
      <h1 class="paola-afiche__title type-display">{{ product.title }}</h1>
      <p class="paola-product__price">{{ formatProductPrice(product.priceCop) }}</p>
      <p v-if="product.stock !== null" class="paola-page__copy paola-page__copy--muted">
        {{ product.stock }} en stock
      </p>

      <PaolaCard v-if="product.photoSrc" class="shop-ficha__media">
        <img class="shop-ficha__photo" :src="product.photoSrc" :alt="product.title" />
      </PaolaCard>

      <p class="paola-page__copy">{{ product.description }}</p>

      <section class="paola-page__block" aria-label="Entrega y garantía">
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
          Escribirle a Paola
        </PaolaButton>
        <PaolaButton variant="ghost" :href="`mailto:${contact.email}`">Correo</PaolaButton>
        <PaolaButton variant="ghost" to="/tienda">Volver a Tienda</PaolaButton>
      </div>
    </template>

    <PaolaEmpty
      v-else
      compact
      hide-cta
      title="Sin ficha"
      :copy="SHOP_EMPTY_FICHA"
      mascot-src="/mascota/tumbada.png"
    />
    <p v-if="!product" class="shop-ficha__cta">
      <PaolaButton variant="ghost" to="/tienda">Volver a Tienda</PaolaButton>
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
