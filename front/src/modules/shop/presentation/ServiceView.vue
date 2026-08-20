<script setup lang="ts">
import { computed } from 'vue'
import type { ShopModule } from '@modules/shop/index.ts'
import { SHOP_COPY, SHOP_EMPTY_SERVICE_FICHA } from '@modules/shop/constants/copy.ts'
import { formatProductPrice } from '@modules/shop/presentation/formatPrice.ts'
import ShopCheckout from '@modules/shop/presentation/ShopCheckout.vue'
import { usePageReveal } from '@shared/motion/usePageReveal.ts'
import { APP_PATHS } from '@shared/http/constants.ts'
import { MASCOT } from '@shared/ui/mascot.ts'
import Button from '@ui/Button.vue'
import Crumbs from '@ui/Crumbs.vue'
import Empty from '@ui/Empty.vue'
import ServiceFicha from '@ui/ServiceFicha.vue'
import SpecTable from '@ui/SpecTable.vue'

const props = defineProps<{
  module: ShopModule
  serviceId: string
}>()

const bindReveal = usePageReveal()
const copy = SHOP_COPY
const contact = computed(() => props.module.getContact())
const service = computed(() => props.module.getService(props.serviceId))
const board = computed(() => props.module.getServices())

const crumbs = computed(() => [
  { label: copy.crumbsHome, href: APP_PATHS.TIENDA },
  { label: service.value?.title ?? copy.serviceFichaEmptyTitle },
])

const steps = computed(() => {
  const item = service.value
  if (!item) return []
  return [item.includesText, item.handoverText, item.turnaroundText]
})

const specRows = computed(() => {
  const item = service.value
  if (!item) return []
  return [
    { label: copy.specKind, value: copy.serviceKind },
    { label: copy.specPrice, value: formatProductPrice(item.priceCop) },
    { label: copy.serviceTurnaround, value: item.turnaroundText },
  ]
})
</script>

<template>
  <article :ref="bindReveal" class="wrap shop-item">
    <Empty
      v-if="!service"
      :title="copy.serviceFichaEmptyTitle"
      :copy="SHOP_EMPTY_SERVICE_FICHA"
      :mascot-src="MASCOT.LENTE"
      :cta-href="contact.whatsappHref"
      :cta-label="copy.writeCta"
    />
    <template v-else>
      <Crumbs :items="crumbs" data-reveal />
      <div class="shop-item__stage" data-reveal>
        <ServiceFicha
          :title="service.title"
          :copy="formatProductPrice(service.priceCop)"
          :steps="steps"
          :note="board.warrantyCopy"
        />
        <div class="shop-item__buy">
          <SpecTable :rows="specRows" />
          <Button variant="ghost" size="sm" :to="APP_PATHS.TIENDA">{{ copy.backCta }}</Button>
          <ShopCheckout
            :module="props.module"
            :reference="service.title"
            :amount-cop="service.priceCop"
            :warranty-copy="board.warrantyCopy"
            :zone-copy="board.zoneCopy"
          />
        </div>
      </div>
    </template>
  </article>
</template>
