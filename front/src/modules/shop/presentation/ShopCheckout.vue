<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { ShopModule } from '@modules/shop/index.ts'
import type { PaymentMethod } from '@modules/shop/domain/entities/Payment.ts'
import {
  SHOP_CITY,
  SHOP_CITY_OPTIONS,
  SHOP_COPY,
  SHOP_PAY,
  SHOP_PAY_OPTIONS,
} from '@modules/shop/constants/copy.ts'
import { PAYMENT_COPY, PAYMENT_HUMAN, type PaymentMethodId } from '@modules/shop/constants/payments.ts'
import Alert from '@ui/Alert.vue'
import Button from '@ui/Button.vue'
import Callout from '@ui/Callout.vue'
import CheckoutSteps from '@ui/CheckoutSteps.vue'
import CityGate from '@ui/CityGate.vue'
import PayPicker from '@ui/PayPicker.vue'

const CHECKOUT_STEP = {
  PAY: 0,
  ZONE: 1,
  CLOSE: 2,
} as const

const props = defineProps<{
  module: ShopModule
  reference: string
  amountCop: number | null
  warrantyCopy: string
  zoneCopy?: string
}>()

const copy = SHOP_COPY
const step = ref<number>(CHECKOUT_STEP.PAY)
const pay = ref<string>(SHOP_PAY.WA)
const city = ref<string>(SHOP_CITY.BOGOTA)
const methods = ref<readonly PaymentMethod[]>([])
const notice = ref('')
const contact = computed(() => props.module.getContact())
const mailHref = computed(() => `mailto:${contact.value.email}`)
const selectedPay = computed(() => methods.value.find((item) => item.id === pay.value))
const payOptions = computed(() => {
  if (!methods.value.length) return SHOP_PAY_OPTIONS
  return methods.value.map((item) => ({
    id: item.id,
    icon: item.icon,
    title: item.title,
    copy: item.copy,
  }))
})
const paySecure = computed(() =>
  selectedPay.value?.channel === 'gateway' ? PAYMENT_COPY.paySecureGateway : copy.paySecure,
)
const isHumanPay = computed(() => !selectedPay.value || selectedPay.value.channel === 'human')
const askHref = computed(() => (pay.value === PAYMENT_HUMAN.MAIL ? mailHref.value : contact.value.whatsappHref))
const cityOk = computed(() => city.value !== SHOP_CITY.FUERA)

const stepItems = computed(() => [
  {
    label: copy.checkoutPay,
    meta: copy.checkoutPayMeta,
    state: stepMark(CHECKOUT_STEP.PAY),
  },
  {
    label: copy.checkoutZone,
    meta: copy.checkoutZoneMeta,
    state: stepMark(CHECKOUT_STEP.ZONE),
  },
  {
    label: copy.checkoutClose,
    meta: copy.checkoutCloseMeta,
    state: stepMark(CHECKOUT_STEP.CLOSE),
  },
])

function stepMark(index: number): 'done' | 'active' | 'idle' {
  if (step.value > index) return 'done'
  if (step.value === index) return 'active'
  return 'idle'
}

onMounted(async () => {
  const result = await props.module.listPaymentMethods()
  if (result.ok && result.value.length) methods.value = result.value
})

async function askPay() {
  notice.value = ''
  const result = await props.module.createCheckout({
    method: pay.value as PaymentMethodId,
    amountCop: props.amountCop,
    reference: props.reference,
  })
  if (!result.ok) {
    notice.value = result.error.message
    return
  }
  const session = result.value
  if (session.checkoutUrl) {
    window.location.href = session.checkoutUrl
    return
  }
  notice.value = session.detail
  if (session.href) window.open(session.href, '_blank', 'noopener,noreferrer')
}
</script>

<template>
  <section class="shop-checkout" :aria-label="copy.pedidoHeading">
    <CheckoutSteps :steps="stepItems" />

    <template v-if="step === CHECKOUT_STEP.PAY">
      <PayPicker v-model="pay" :options="payOptions" :secure-note="paySecure" />
      <div class="shop-checkout__nav">
        <Button @click="step = CHECKOUT_STEP.ZONE">{{ copy.checkoutNext }}</Button>
      </div>
    </template>

    <template v-else-if="step === CHECKOUT_STEP.ZONE">
      <CityGate v-model="city" :options="SHOP_CITY_OPTIONS" />
      <Callout
        :tone="cityOk ? 'info' : 'warn'"
        :title="copy.deliveryTitle"
        :copy="cityOk ? copy.cityOk : copy.cityNo"
      />
      <p v-if="zoneCopy" class="meta" style="margin: 0">{{ zoneCopy }}</p>
      <div class="shop-checkout__nav">
        <Button variant="ghost" @click="step = CHECKOUT_STEP.PAY">{{ copy.checkoutBack }}</Button>
        <Button @click="step = CHECKOUT_STEP.CLOSE">{{ copy.checkoutNext }}</Button>
      </div>
    </template>

    <template v-else>
      <Callout :title="copy.warrantyTitle" :copy="warrantyCopy" />
      <Alert v-if="notice" tone="info">{{ notice }}</Alert>
      <div class="shop-checkout__nav">
        <Button variant="ghost" @click="step = CHECKOUT_STEP.ZONE">{{ copy.checkoutBack }}</Button>
        <Button
          v-if="isHumanPay"
          :href="askHref"
          :target="pay === PAYMENT_HUMAN.WHATSAPP ? '_blank' : undefined"
        >
          {{ pay === PAYMENT_HUMAN.MAIL ? copy.mailCta : copy.writeCta }}
        </Button>
        <Button v-else @click="askPay">{{ selectedPay?.title ?? copy.writeCta }}</Button>
      </div>
    </template>
  </section>
</template>
