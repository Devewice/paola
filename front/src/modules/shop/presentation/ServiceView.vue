<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  SHOP_COPY,
  SHOP_EMPTY_SERVICE_FICHA,
} from '@modules/shop/constants/copy.ts'
import type { ShopModule } from '@modules/shop/index.ts'
import { formatProductPrice } from '@modules/shop/presentation/formatPrice.ts'
import { APP_PATHS } from '@shared/http/constants.ts'
import { usePageReveal } from '@shared/motion/usePageReveal.ts'
import { MASCOT } from '@shared/ui/mascot.ts'
import Alert from '@ui/Alert.vue'
import Button from '@ui/Button.vue'
import Field from '@ui/Field.vue'
import Input from '@ui/Input.vue'
import PrivacyCheck from '@ui/PrivacyCheck.vue'
import Select from '@ui/Select.vue'
import Empty from '@ui/Empty.vue'
import VoiceBadge from '@ui/VoiceBadge.vue'
import ZoneBadge from '@ui/ZoneBadge.vue'

import { LEGAL_COPY } from '@app/constants/legal.ts'
import type { ServiceOrderDeliveryZone } from '@modules/shop/domain/entities/ServiceOrder.ts'
import { ORDERS_MESSAGES } from '@modules/shop/constants/orders.constants.ts'

const props = defineProps<{
  module: ShopModule
  serviceId: string
}>()

const service = computed(() => props.module.getService(props.serviceId))
const board = computed(() => props.module.getServices())
const bindReveal = usePageReveal()
const copy = SHOP_COPY
const legal = LEGAL_COPY
const mascot = MASCOT
const shopPath = APP_PATHS.TIENDA
const privacyPath = APP_PATHS.PRIVACIDAD

const customerName = ref('')
const customerWhatsapp = ref('')
const size = ref('')
const deliveryZone = ref<ServiceOrderDeliveryZone>('bogota')

const busy = ref(false)
const error = ref('')
const whatsappHref = ref('')
const privacyAccepted = ref(false)

const zoneOptions = [
  { value: 'bogota', label: 'Bogotá' },
  { value: 'soacha', label: 'Soacha' },
  { value: 'fuera', label: 'Fuera' },
]

async function submitOrder(): Promise<void> {
  if (!service.value) return
  if (!privacyAccepted.value) {
    error.value = ORDERS_MESSAGES.PRIVACY_REQUIRED
    return
  }

  busy.value = true
  error.value = ''
  whatsappHref.value = ''

  const result = await props.module.createServiceOrder({
    serviceId: service.value.id,
    size: size.value.trim() || undefined,
    deliveryZone: deliveryZone.value,
    customerName: customerName.value.trim(),
    customerWhatsapp: customerWhatsapp.value.trim(),
    privacyAccepted: privacyAccepted.value,
  })

  busy.value = false
  if (!result.ok) {
    error.value = result.error.message
    return
  }

  whatsappHref.value = result.value.notice.whatsappHref
}
</script>

<template>
  <article :ref="bindReveal" class="paola-page">
    <template v-if="service">
      <VoiceBadge voice="loigca" />
      <p class="paola-empty__kicker">{{ copy.serviceKind }}</p>
      <h1 class="paola-afiche__title type-display">{{ service.title }}</h1>
      <p class="paola-product__price">{{ formatProductPrice(service.priceCop) }}</p>

      <section class="paola-page__block">
        <h2 class="paola-page__heading type-display">{{ copy.serviceIncludes }}</h2>
        <p class="paola-page__copy">{{ service.includesText }}</p>
      </section>

      <section class="paola-page__block">
        <h2 class="paola-page__heading type-display">{{ copy.serviceHandover }}</h2>
        <p class="paola-page__copy">{{ service.handoverText }}</p>
      </section>

      <section class="paola-page__block">
        <h2 class="paola-page__heading type-display">{{ copy.serviceTurnaround }}</h2>
        <p class="paola-page__copy">{{ service.turnaroundText }}</p>
      </section>

      <section class="paola-page__block" :aria-label="copy.deliveryAria">
        <div class="shop-page__zones">
          <ZoneBadge zone="bogota" />
          <ZoneBadge zone="soacha" />
          <ZoneBadge zone="fuera" />
        </div>
        <Alert tone="info">{{ board.zoneCopy }}</Alert>
        <Alert tone="warn">{{ board.warrantyCopy }}</Alert>
      </section>

      <section class="shop-ficha__order">
        <h2 class="paola-page__heading type-display">Pedir el lavado</h2>
        <p class="paola-page__copy paola-page__copy--muted">
          Deja tu pedido. Paola responde con reglas de entrega/garantía y WhatsApp.
        </p>

        <form class="shop-ficha__order-form" @submit.prevent="submitOrder">
          <PrivacyCheck
            v-model="privacyAccepted"
            :label="legal.checkboxLabel"
            :to="privacyPath"
            :link-label="legal.checkboxLink"
          />

          <Field label="Nombre">
            <Input v-model="customerName" placeholder="Tu nombre" />
          </Field>

          <Field label="WhatsApp">
            <Input v-model="customerWhatsapp" placeholder="Número de WhatsApp" />
          </Field>

          <Field label="Talla (opcional)">
            <Input v-model="size" placeholder="Si aplica" />
          </Field>

          <Field label="Zona de entrega">
            <Select v-model="deliveryZone" :options="zoneOptions" />
          </Field>

          <Alert v-if="deliveryZone === 'fuera'" tone="warn">
            Fuera de Bogotá/Soacha: aún no hay entrega.
          </Alert>

          <Alert v-if="error" tone="bad">{{ error }}</Alert>

          <Button type="submit" variant="hero" :disabled="busy || !privacyAccepted">
            {{ copy.serviceAskCta }}
          </Button>
        </form>

        <div v-if="whatsappHref" class="shop-ficha__order-success">
          <Alert tone="ok">Pedido registrado. Ahora sí: escribirle a Paola.</Alert>
          <Button variant="hero" :href="whatsappHref" target="_blank">
            Abrir WhatsApp de Paola
          </Button>
          <Button variant="ghost" :to="shopPath">{{ copy.backCta }}</Button>
        </div>
      </section>
    </template>

    <Empty
      v-else
      compact
      hide-cta
      :title="copy.serviceFichaEmptyTitle"
      :copy="SHOP_EMPTY_SERVICE_FICHA"
      :mascot-src="mascot.TUMBADA"
    />
    <p v-if="!service" class="shop-ficha__cta">
      <Button variant="ghost" :to="shopPath">{{ copy.backCta }}</Button>
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

.shop-ficha__cta {
  display: grid;
  gap: 12px;
  margin-top: 16px;
}

.shop-ficha__order {
  margin-top: 16px;
  display: grid;
  gap: 12px;
}

.shop-ficha__order-form {
  display: grid;
  gap: 12px;
}

.shop-ficha__order-success {
  display: grid;
  gap: 12px;
  margin-top: 12px;
}
</style>
