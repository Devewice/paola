<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { VoiceModule } from '@modules/voice/composition.ts'
import { VOICE_ADMIN_COPY } from '@modules/voice/constants/copy.ts'
import type { Tip } from '@modules/voice/domain/entities/Tip.ts'
import Button from '@ui/Button.vue'
import Field from '@ui/Field.vue'
import Input from '@ui/Input.vue'
import Textarea from '@ui/Textarea.vue'
import { showToast } from '@ui/toast.ts'

const props = defineProps<{
  module: VoiceModule
  clave: string
  tip?: Tip | null
}>()

const emit = defineEmits<{ saved: []; cancel: [] }>()

const copy = VOICE_ADMIN_COPY
const editing = computed(() => Boolean(props.tip))

function fromTip(tip?: Tip | null) {
  return { title: tip?.title ?? '', body: tip?.body ?? '', officialHref: tip?.officialHref ?? '' }
}

const draft = ref(fromTip(props.tip))
const busy = ref(false)

watch(
  () => props.tip,
  (tip) => {
    draft.value = fromTip(tip)
  },
)

async function submit() {
  busy.value = true
  const payload = {
    title: draft.value.title.trim(),
    body: draft.value.body.trim(),
    officialHref: draft.value.officialHref.trim() || undefined,
  }
  const result = props.tip
    ? await props.module.updateTip(props.tip.id, payload, props.clave)
    : await props.module.createTip(payload, props.clave)
  busy.value = false
  if (!result.ok) {
    showToast(result.error.message || copy.tipFail, 'bad')
    return
  }
  showToast(editing.value ? copy.tipSaved : copy.tipOk, 'ok')
  if (!editing.value) draft.value = fromTip(null)
  emit('saved')
}
</script>

<template>
  <form class="admin-form" @submit.prevent="submit">
    <Field :label="copy.tipFieldTitle">
      <Input v-model="draft.title" />
    </Field>
    <Field :label="copy.tipFieldBody">
      <Textarea v-model="draft.body" />
    </Field>
    <Field :label="copy.tipFieldHref">
      <Input v-model="draft.officialHref" type="url" placeholder="https://" />
    </Field>
    <div class="admin-form__actions">
      <Button type="submit" :disabled="busy">{{ editing ? copy.save : copy.tipCta }}</Button>
      <Button type="button" variant="ghost" @click="emit('cancel')">{{ copy.cancel }}</Button>
    </div>
  </form>
</template>
