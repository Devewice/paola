<script setup lang="ts">
import { computed } from 'vue'
import type { ShopModule } from '@modules/shop/index.ts'
import { SHOP_COPY, SHOP_EMPTY_FICHA, SHOP_KIND, shopStockCopy } from '@modules/shop/constants/copy.ts'
import { formatProductPrice } from '@modules/shop/presentation/formatPrice.ts'
import ShopCheckout from '@modules/shop/presentation/ShopCheckout.vue'
import { usePageReveal } from '@shared/motion/usePageReveal.ts'
import { APP_PATHS } from '@shared/http/constants.ts'
import { MASCOT } from '@shared/ui/mascot.ts'
import Button from '@ui/Button.vue'
import Crumbs from '@ui/Crumbs.vue'
import Empty from '@ui/Empty.vue'
import MediaPlaceholder from '@ui/MediaPlaceholder.vue'
import ShopFicha from '@ui/ShopFicha.vue'
import SpecTable from '@ui/SpecTable.vue'

const props = defineProps<{
  module: ShopModule
  productId: string
}>()

const bindReveal = usePageReveal()
const copy = SHOP_COPY
const contact = computed(() => props.module.getContact())
const product = computed(() => props.module.getProduct(props.productId))
const shelves = computed(() => props.module.getShelves())

const crumbs = computed(() => [
  { label: copy.crumbsHome, href: APP_PATHS.TIENDA },
  { label: product.value?.title ?? copy.fichaEmptyTitle },
])

const specRows = computed(() => {
  const item = product.value
  if (!item) return []
  return [
    {
      label: copy.specKind,
      value: item.kind === SHOP_KIND.COLLAB ? copy.kindCollab : copy.kindOwn,
    },
    { label: copy.specPrice, value: formatProductPrice(item.priceCop) },
    {
      label: copy.specStock,
      value: item.stock === null ? copy.writeCta : shopStockCopy(item.stock),
    },
  ]
})
</script>

<template>
  <article :ref="bindReveal" class="wrap shop-item">
    <Empty
      v-if="!product"
      :title="copy.fichaEmptyTitle"
      :copy="SHOP_EMPTY_FICHA"
      :mascot-src="MASCOT.LENTE"
      :cta-href="contact.whatsappHref"
      :cta-label="copy.writeCta"
    />
    <template v-else>
      <Crumbs :items="crumbs" data-reveal />
      <div class="shop-item__stage" data-reveal>
        <div class="shop-item__media">
          <img v-if="product.photoSrc" :src="product.photoSrc" :alt="product.title" />
          <MediaPlaceholder v-else :label="copy.mediaLabel" aspect="1 / 1" />
        </div>
        <div class="shop-item__buy">
          <ShopFicha
            :shelf="product.kind === SHOP_KIND.COLLAB ? copy.kindCollabTag : copy.kindOwnTag"
            :title="product.title"
            :price="formatProductPrice(product.priceCop)"
            :price-note="product.stock === null ? undefined : shopStockCopy(product.stock)"
            :description="product.description"
          >
            <SpecTable :rows="specRows" />
            <Button variant="ghost" size="sm" :to="APP_PATHS.TIENDA">{{ copy.backCta }}</Button>
          </ShopFicha>
          <ShopCheckout
            :module="props.module"
            :reference="product.title"
            :amount-cop="product.priceCop"
            :warranty-copy="shelves.warrantyCopy"
          />
        </div>
      </div>
    </template>
  </article>
</template>
