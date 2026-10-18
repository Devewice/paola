<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { VoiceModule } from '@modules/voice/composition.ts'
import { VOICE_ADMIN_COPY } from '@modules/voice/constants/copy.ts'
import type { FineGuide } from '@modules/voice/domain/entities/Fine.ts'
import Button from '@ui/Button.vue'
import Field from '@ui/Field.vue'
import Input from '@ui/Input.vue'
import Textarea from '@ui/Textarea.vue'
import { showToast } from '@ui/toast.ts'

const props = defineProps<{
  module: VoiceModule
  clave: string
  fine?: FineGuide | null
}>()

const emit = defineEmits<{ saved: []; cancel: [] }>()

const copy = VOICE_ADMIN_COPY
const editing = computed(() => Boolean(props.fine))

function fromFine(fine?: FineGuide | null) {
  return {
    title: fine?.title ?? '',
    guide: fine?.guide ?? '',
    officialHref: fine?.officialHref ?? '',
    disclaimer: fine?.disclaimer ?? copy.fineDisclaimerDefault,
  }
}

const draft = ref(fromFine(props.fine))
const busy = ref(false)

watch(
  () => props.fine,
  (fine) => {
    draft.value = fromFine(fine)
  },
)

async function submit() {
  busy.value = true
  const payload = {
    title: draft.value.title.trim(),
    guide: draft.value.guide.trim(),
    officialHref: draft.value.officialHref.trim(),
    disclaimer: draft.value.disclaimer.trim(),
  }
  const result = props.fine
    ? await props.module.updateFine(props.fine.id, payload, props.clave)
    : await props.module.createFine(payload, props.clave)
  busy.value = false
  if (!result.ok) {
    showToast(result.error.message || copy.fineFail, 'bad')
    return
  }
  showToast(editing.value ? copy.fineSaved : copy.fineOk, 'ok')
  if (!editing.value) draft.value = fromFine(null)
  emit('saved')
}
</script>

<template>
  <form class="admin-form" @submit.prevent="submit">
    <Field :label="copy.fineFieldTitle">
      <Input v-model="draft.title" />
    </Field>
    <Field :label="copy.fineFieldGuide">
      <Textarea v-model="draft.guide" />
    </Field>
    <Field :label="copy.fineFieldHref">
      <Input v-model="draft.officialHref" type="url" placeholder="https://" />
    </Field>
    <Field :label="copy.fineFieldDisclaimer">
      <Textarea v-model="draft.disclaimer" />
    </Field>
    <div class="admin-form__actions">
      <Button type="submit" :disabled="busy">{{ editing ? copy.save : copy.fineCta }}</Button>
      <Button type="button" variant="ghost" @click="emit('cancel')">{{ copy.cancel }}</Button>
    </div>
  </form>
</template>
