<script setup lang="ts">
import { computed } from 'vue'
import type { ShopModule } from '@modules/shop/index.ts'
import {
  SHOP_COPY,
  SHOP_EMPTY_SERVICE_FICHA,
  SHOP_FIGURES,
  SHOP_SERVICE_PROMISES,
} from '@modules/shop/constants/copy.ts'
import { formatProductPrice } from '@modules/shop/presentation/formatPrice.ts'
import ShopItemTools from '@modules/shop/presentation/ShopItemTools.vue'
import ShopCheckout from '@modules/shop/presentation/ShopCheckout.vue'
import { usePageReveal } from '@shared/motion/usePageReveal.ts'
import { APP_PATHS } from '@shared/http/constants.ts'
import { MASCOT } from '@shared/ui/mascot.ts'
import Button from '@ui/Button.vue'
import Crumbs from '@ui/Crumbs.vue'
import Empty from '@ui/Empty.vue'
import ServiceFicha from '@ui/ServiceFicha.vue'
import SpecTable from '@ui/SpecTable.vue'
import StatBand from '@ui/StatBand.vue'

const props = defineProps<{
  module: ShopModule
  serviceId: string
  /** Sesión de quien opera la tienda en modo edición; vacía oculta las herramientas. */
  editClave?: string
}>()

const emit = defineEmits<{ changed: [] }>()

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
    <div v-if="!service" class="shop-item__missing">
      <Empty
        compact
        hide-cta
        :title="copy.serviceFichaEmptyTitle"
        :copy="SHOP_EMPTY_SERVICE_FICHA"
        :mascot-src="MASCOT.LENTE"
      />
      <div class="shop-item__missing-actions">
        <Button :to="APP_PATHS.TIENDA">{{ copy.backCta }}</Button>
        <Button variant="ghost" :href="contact.whatsappHref" target="_blank">{{ copy.writeCta }}</Button>
      </div>
    </div>
    <template v-else>
      <Crumbs :items="crumbs" data-reveal />
      <div v-if="editClave" class="admin-spot__tools">
        <ShopItemTools :module="module" :clave="editClave" :service="service" @changed="emit('changed')" />
      </div>
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
      <StatBand
        tone="blue"
        :kicker="copy.promiseKicker"
        :title="copy.promiseWashTitle"
        :items="SHOP_SERVICE_PROMISES"
        :mascot-src="SHOP_FIGURES.SERVICE_BAND"
        data-reveal
      />
    </template>
  </article>
</template>
