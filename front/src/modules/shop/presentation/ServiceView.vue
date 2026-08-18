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
import PaolaAlert from '@ui/PaolaAlert.vue'
import PaolaButton from '@ui/PaolaButton.vue'
import PaolaField from '@ui/PaolaField.vue'
import PaolaInput from '@ui/PaolaInput.vue'
import PaolaPrivacyCheck from '@ui/PaolaPrivacyCheck.vue'
import PaolaSelect from '@ui/PaolaSelect.vue'
import PaolaEmpty from '@ui/PaolaEmpty.vue'
import PaolaVoiceBadge from '@ui/PaolaVoiceBadge.vue'
import PaolaZoneBadge from '@ui/PaolaZoneBadge.vue'

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
      <PaolaVoiceBadge voice="loigca" />
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
          <PaolaZoneBadge zone="bogota" />
          <PaolaZoneBadge zone="soacha" />
          <PaolaZoneBadge zone="fuera" />
        </div>
        <PaolaAlert tone="info">{{ board.zoneCopy }}</PaolaAlert>
        <PaolaAlert tone="warn">{{ board.warrantyCopy }}</PaolaAlert>
      </section>

      <section class="shop-ficha__order">
        <h2 class="paola-page__heading type-display">Pedir el lavado</h2>
        <p class="paola-page__copy paola-page__copy--muted">
          Deja tu pedido. Paola responde con reglas de entrega/garantía y WhatsApp.
        </p>

        <form class="shop-ficha__order-form" @submit.prevent="submitOrder">
          <PaolaPrivacyCheck
            v-model="privacyAccepted"
            :label="legal.checkboxLabel"
            :to="privacyPath"
            :link-label="legal.checkboxLink"
          />

          <PaolaField label="Nombre">
            <PaolaInput v-model="customerName" placeholder="Tu nombre" />
          </PaolaField>

          <PaolaField label="WhatsApp">
            <PaolaInput v-model="customerWhatsapp" placeholder="Número de WhatsApp" />
          </PaolaField>

          <PaolaField label="Talla (opcional)">
            <PaolaInput v-model="size" placeholder="Si aplica" />
          </PaolaField>

          <PaolaField label="Zona de entrega">
            <PaolaSelect v-model="deliveryZone" :options="zoneOptions" />
          </PaolaField>

          <PaolaAlert v-if="deliveryZone === 'fuera'" tone="warn">
            Fuera de Bogotá/Soacha: aún no hay entrega.
          </PaolaAlert>

          <PaolaAlert v-if="error" tone="bad">{{ error }}</PaolaAlert>

          <PaolaButton type="submit" variant="hero" :disabled="busy || !privacyAccepted">
            {{ copy.serviceAskCta }}
          </PaolaButton>
        </form>

        <div v-if="whatsappHref" class="shop-ficha__order-success">
          <PaolaAlert tone="ok">Pedido registrado. Ahora sí: escribirle a Paola.</PaolaAlert>
          <PaolaButton variant="hero" :href="whatsappHref" target="_blank">
            Abrir WhatsApp de Paola
          </PaolaButton>
          <PaolaButton variant="ghost" :to="shopPath">{{ copy.backCta }}</PaolaButton>
        </div>
      </section>
    </template>

    <PaolaEmpty
      v-else
      compact
      hide-cta
      :title="copy.serviceFichaEmptyTitle"
      :copy="SHOP_EMPTY_SERVICE_FICHA"
      :mascot-src="mascot.TUMBADA"
    />
    <p v-if="!service" class="shop-ficha__cta">
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
