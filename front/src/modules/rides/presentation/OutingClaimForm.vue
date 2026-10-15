<script setup lang="ts">
import { ref } from 'vue'
import { LEGAL_COPY } from '@app/constants/legal.ts'
import type { AppError } from '@core/errors/AppError.ts'
import type { Result } from '@core/result.ts'
import { RIDES_CLAIM_COPY, RIDES_MESSAGES } from '@modules/rides/constants/copy.ts'
import type { ClaimedSpot, OutingNotice, TicketDraft } from '@modules/rides/index.ts'
import { APP_PATHS } from '@shared/http/constants.ts'
import Alert from '@ui/Alert.vue'
import Button from '@ui/Button.vue'
import Field from '@ui/Field.vue'
import Input from '@ui/Input.vue'
import PrivacyCheck from '@ui/PrivacyCheck.vue'
import TicketCard from '@ui/TicketCard.vue'
import { showToast } from '@ui/toast.ts'

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
const done = ref<(ClaimedSpot & { notice: OutingNotice }) | null>(null)
const copy = RIDES_CLAIM_COPY
const legal = LEGAL_COPY
const privacyPath = APP_PATHS.PRIVACIDAD

async function submit(): Promise<void> {
  if (sending.value) return
  if (!privacyAccepted.value) {
    showToast(RIDES_MESSAGES.PRIVACY_REQUIRED, 'bad')
    return
  }
  sending.value = true
  const result = await props.claim({
    name: name.value,
    whatsapp: whatsapp.value,
    moto: moto.value,
    privacyAccepted: privacyAccepted.value,
  })
  sending.value = false
  if (!result.ok) {
    showToast(result.error.message, 'bad')
    return
  }
  done.value = result.value
  emit('claimed', result.value)
}
</script>

<template>
  <TicketCard v-if="done" :title="copy.doneTitle" :meta="done.outing.title">
    <Alert tone="ok">{{ copy.doneCopy }}</Alert>
    <div class="outing-claim__actions">
      <Button :href="done.notice.whatsappHref" target="_blank">{{ copy.doneWhatsapp }}</Button>
      <Button variant="ghost" :href="done.notice.mailtoHref">{{ copy.doneMail }}</Button>
    </div>
  </TicketCard>

  <form v-else class="outing-claim" @submit.prevent="submit">
    <p class="paola-empty__kicker">{{ copy.kicker }}</p>
    <Alert v-if="paid" tone="info">{{ copy.paidNotice }}</Alert>
    <PrivacyCheck
      v-model="privacyAccepted"
      :label="legal.checkboxLabel"
      :to="privacyPath"
      :link-label="legal.checkboxLink"
    />
    <Field :label="copy.nameLabel">
      <Input v-model="name" :placeholder="copy.namePlaceholder" autocomplete="name" />
    </Field>
    <Field :label="copy.whatsappLabel">
      <Input v-model="whatsapp" :placeholder="copy.whatsappPlaceholder" type="tel" autocomplete="tel" />
    </Field>
    <Field :label="copy.motoLabel">
      <Input v-model="moto" :placeholder="copy.motoPlaceholder" />
    </Field>
    <Button type="submit" :disabled="sending || !privacyAccepted">{{ copy.submit }}</Button>
  </form>
</template>

<style scoped>
.outing-claim,
.outing-claim__actions {
  display: grid;
  gap: 12px;
  margin-top: 12px;
}
</style>
