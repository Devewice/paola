<script setup lang="ts">
import { ref } from 'vue'
import { LEGAL_COPY } from '@app/constants/legal.ts'
import type { AppError } from '@core/errors/AppError.ts'
import type { Result } from '@core/result.ts'
import { RIDES_MESSAGES } from '@modules/rides/constants/copy.ts'
import type { ClaimedSpot, OutingNotice, TicketDraft } from '@modules/rides/index.ts'
import { APP_PATHS } from '@shared/http/constants.ts'
import Alert from '@ui/Alert.vue'
import Button from '@ui/Button.vue'
import Field from '@ui/Field.vue'
import Input from '@ui/Input.vue'
import PrivacyCheck from '@ui/PrivacyCheck.vue'
import TicketCard from '@ui/TicketCard.vue'

const props = defineProps<{
  paid: boolean
  claim: (draft: TicketDraft) => Promise<Result<ClaimedSpot & { notice: OutingNotice }, AppError>>
}>()

const emit = defineEmits<{
  claimed: [spot: ClaimedSpot]
}>()

const name = ref('')
const whatsapp = ref('')
const moto = ref('')
const privacyAccepted = ref(false)
const sending = ref(false)
const error = ref('')
const done = ref<(ClaimedSpot & { notice: OutingNotice }) | null>(null)
const copy = LEGAL_COPY
const privacyPath = APP_PATHS.PRIVACIDAD

async function submit(): Promise<void> {
  if (sending.value) return
  if (!privacyAccepted.value) {
    error.value = RIDES_MESSAGES.PRIVACY_REQUIRED
    return
  }
  sending.value = true
  error.value = ''
  const result = await props.claim({
    name: name.value,
    whatsapp: whatsapp.value,
    moto: moto.value,
    privacyAccepted: privacyAccepted.value,
  })
  sending.value = false
  if (!result.ok) {
    error.value = result.error.message
    return
  }
  done.value = result.value
  emit('claimed', result.value)
}
</script>

<template>
  <TicketCard v-if="done" title="Cupo a tu nombre" :meta="done.outing.title">
    <Alert tone="ok">El cupo quedó a tu nombre. Escríbeme por WhatsApp o correo para confirmarlo.</Alert>
    <div class="outing-claim__actions">
      <Button :href="done.notice.whatsappHref" target="_blank">Avisar por WhatsApp</Button>
      <Button variant="ghost" :href="done.notice.mailtoHref">Avisar por correo</Button>
    </div>
  </TicketCard>

  <form v-else class="outing-claim" @submit.prevent="submit">
    <p class="paola-empty__kicker">Anotarse a la rodada</p>
    <Alert v-if="paid" tone="info">
      Es de pago. El cupo queda anotado; el cobro se habla por WhatsApp.
    </Alert>
    <PrivacyCheck
      v-model="privacyAccepted"
      :label="copy.checkboxLabel"
      :to="privacyPath"
      :link-label="copy.checkboxLink"
    />
    <Field label="Nombre" :error="error && !name.trim() ? error : undefined">
      <Input v-model="name" placeholder="Tu nombre" :invalid="Boolean(error)" />
    </Field>
    <Field label="WhatsApp">
      <Input v-model="whatsapp" placeholder="312 000 0000" type="tel" :invalid="Boolean(error)" />
    </Field>
    <Field label="Moto (opcional)">
      <Input v-model="moto" placeholder="Si vas en moto" />
    </Field>
    <Alert v-if="error" tone="bad">{{ error }}</Alert>
    <Button type="submit" :disabled="sending || !privacyAccepted">Anotarse a la rodada</Button>
  </form>
</template>

<style scoped>
.outing-claim,
.outing-claim__actions {
  display: grid;
  gap: 12px;
  margin-top: 12px;
}

.outing-claim__actions {
  margin-top: 12px;
}
</style>
