<script setup lang="ts">
import { ref } from 'vue'
import { LEGAL_COPY } from '@app/constants/legal.ts'
import type { AppError } from '@core/errors/AppError.ts'
import type { Result } from '@core/result.ts'
import { RIDES_MESSAGES } from '@modules/rides/constants/copy.ts'
import type { ClaimedSpot, OutingNotice, TicketDraft } from '@modules/rides/index.ts'
import { APP_PATHS } from '@shared/http/constants.ts'
import PaolaAlert from '@ui/PaolaAlert.vue'
import PaolaButton from '@ui/PaolaButton.vue'
import PaolaField from '@ui/PaolaField.vue'
import PaolaInput from '@ui/PaolaInput.vue'
import PaolaPrivacyCheck from '@ui/PaolaPrivacyCheck.vue'
import PaolaTicketCard from '@ui/PaolaTicketCard.vue'

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
  <PaolaTicketCard v-if="done" title="Cupo a tu nombre" :meta="done.outing.title">
    <PaolaAlert tone="ok">El cupo quedó a tu nombre. Avísale a Paola por WhatsApp o correo para que lo vea.</PaolaAlert>
    <div class="outing-claim__actions">
      <PaolaButton :href="done.notice.whatsappHref" target="_blank">Avisar por WhatsApp</PaolaButton>
      <PaolaButton variant="ghost" :href="done.notice.mailtoHref">Avisar por correo</PaolaButton>
    </div>
  </PaolaTicketCard>

  <form v-else class="outing-claim" @submit.prevent="submit">
    <p class="paola-empty__kicker">Apúntese pa rodar</p>
    <PaolaAlert v-if="paid" tone="info">
      Es de pago. El cupo queda anotado; el cobro se habla con Paola por WhatsApp.
    </PaolaAlert>
    <PaolaPrivacyCheck
      v-model="privacyAccepted"
      :label="copy.checkboxLabel"
      :to="privacyPath"
      :link-label="copy.checkboxLink"
    />
    <PaolaField label="Nombre" :error="error && !name.trim() ? error : undefined">
      <PaolaInput v-model="name" placeholder="Tu nombre" :invalid="Boolean(error)" />
    </PaolaField>
    <PaolaField label="WhatsApp">
      <PaolaInput v-model="whatsapp" placeholder="312 000 0000" type="tel" :invalid="Boolean(error)" />
    </PaolaField>
    <PaolaField label="Moto (opcional)">
      <PaolaInput v-model="moto" placeholder="Si vas en moto" />
    </PaolaField>
    <PaolaAlert v-if="error" tone="bad">{{ error }}</PaolaAlert>
    <PaolaButton type="submit" :disabled="sending || !privacyAccepted">Apúntese pa rodar</PaolaButton>
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
