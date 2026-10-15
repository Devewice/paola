<script setup lang="ts">
import { ref } from 'vue'
import { LEGAL_COPY } from '@app/constants/legal.ts'
import type { VoiceModule } from '@modules/voice/composition.ts'
import { VOICE_COPY, VOICE_FIGURES, VOICE_REPORT_ANCHOR } from '@modules/voice/constants/copy.ts'
import { APP_PATHS } from '@shared/http/constants.ts'
import Button from '@ui/Button.vue'
import Field from '@ui/Field.vue'
import Input from '@ui/Input.vue'
import PrivacyCheck from '@ui/PrivacyCheck.vue'
import Textarea from '@ui/Textarea.vue'
import { showToast } from '@ui/toast.ts'

const props = defineProps<{
  module: VoiceModule
}>()

const copy = VOICE_COPY
const legal = LEGAL_COPY

const title = ref('')
const whatHappened = ref('')
const whereText = ref('')
const happenedAt = ref('')
const evidenceSrc = ref('')
const privacyAccepted = ref(false)
const busy = ref(false)

async function sendReport(): Promise<void> {
  busy.value = true
  try {
    const result = await props.module.submitReport({
      title: title.value,
      whatHappened: whatHappened.value,
      whereText: whereText.value,
      happenedAt: happenedAt.value,
      evidenceSrc: evidenceSrc.value,
      privacyAccepted: privacyAccepted.value,
    })
    if (!result.ok) {
      showToast(result.error.message, 'bad')
      return
    }
    title.value = ''
    whatHappened.value = ''
    whereText.value = ''
    happenedAt.value = ''
    evidenceSrc.value = ''
    privacyAccepted.value = false
    showToast(copy.sendOk, 'ok')
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <aside
    :id="VOICE_REPORT_ANCHOR"
    class="poster poster--armargura poster--mascot-top has-mascot report-form"
  >
    <img class="poster__mascot" :src="VOICE_FIGURES.REPORT_FORM" alt="" aria-hidden="true" loading="lazy" />
    <div class="poster__copy">
      <h3 class="type-brush-dry type-brush-dry--xs">{{ copy.formHeading }}</h3>
      <p>{{ copy.formLead }}</p>
    </div>
    <form class="report-form__grid" @submit.prevent="sendReport">
      <Field :label="copy.formTitle">
        <Input v-model="title" type="text" autocomplete="off" />
      </Field>
      <Field :label="copy.formWhat">
        <Textarea v-model="whatHappened" />
      </Field>
      <Field :label="copy.formWhere">
        <Input v-model="whereText" type="text" autocomplete="off" />
      </Field>
      <Field :label="copy.formWhen">
        <Input v-model="happenedAt" type="text" autocomplete="off" />
      </Field>
      <Field :label="copy.formEvidence">
        <Input v-model="evidenceSrc" type="url" autocomplete="off" />
      </Field>
      <PrivacyCheck
        v-model="privacyAccepted"
        :label="legal.checkboxLabel"
        :to="APP_PATHS.PRIVACIDAD"
        :link-label="legal.checkboxLink"
      />
      <Button type="submit" :disabled="busy || !privacyAccepted">{{ copy.sendCta }}</Button>
    </form>
  </aside>
</template>

<style scoped>
.report-form {
  scroll-margin-top: 96px;
}

.report-form__grid {
  display: grid;
  gap: 12px;
}
</style>
