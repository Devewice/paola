<script setup lang="ts">
import { ref, watch } from 'vue'
import type { RidesModule } from '@modules/rides/composition.ts'
import { RIDES_ADMIN_COPY } from '@modules/rides/constants/copy.ts'
import Button from '@ui/Button.vue'
import Field from '@ui/Field.vue'
import Input from '@ui/Input.vue'
import Select from '@ui/Select.vue'
import Textarea from '@ui/Textarea.vue'
import { showToast } from '@ui/toast.ts'

const props = defineProps<{
  module: RidesModule
  clave: string
  /** Salidas realizadas que aún no tienen memoria. */
  outings: readonly { value: string; label: string }[]
}>()

const emit = defineEmits<{ saved: []; cancel: [] }>()

const copy = RIDES_ADMIN_COPY

const empty = () => ({
  outingId: props.outings[0]?.value ?? '',
  km: '',
  closingText: '',
  credit: '',
  participantsText: '',
  instagramHref: '',
  photos: '',
})
const draft = ref(empty())
const busy = ref(false)

watch(
  () => props.outings,
  (list) => {
    if (!list.some((item) => item.value === draft.value.outingId)) draft.value.outingId = list[0]?.value ?? ''
  },
)

function parsePhotos(raw: string) {
  return raw
    .split('\n')
    .map((line) => line.split('|').map((part) => part.trim()))
    .filter(([src]) => Boolean(src))
    .map(([src, alt]) => ({ src: src ?? '', alt: alt || draft.value.credit.trim() || copy.fieldPhotos }))
}

async function submit() {
  busy.value = true
  const value = draft.value
  const result = await props.module.publishMemory(
    {
      outingId: value.outingId,
      km: Number(value.km),
      closingText: value.closingText.trim(),
      credit: value.credit.trim(),
      participantsText: value.participantsText.trim(),
      instagramHref: value.instagramHref.trim() || undefined,
      photos: parsePhotos(value.photos),
    },
    props.clave,
  )
  busy.value = false
  if (!result.ok) {
    showToast(result.error.message || copy.memoryFail, 'bad')
    return
  }
  showToast(copy.memoryOk, 'ok')
  draft.value = empty()
  emit('saved')
}
</script>

<template>
  <p v-if="!outings.length" class="admin-empty">{{ copy.memoryNoOutings }}</p>
  <form v-else class="admin-form" @submit.prevent="submit">
    <Select v-model="draft.outingId" :label="copy.fieldOuting" :options="outings" />
    <div class="admin-fields">
      <Field :label="copy.fieldKm">
        <Input v-model="draft.km" type="number" />
      </Field>
      <Field :label="copy.fieldCredit">
        <Input v-model="draft.credit" />
      </Field>
    </div>
    <Field :label="copy.fieldClosing">
      <Textarea v-model="draft.closingText" />
    </Field>
    <Field :label="copy.fieldParticipants">
      <Input v-model="draft.participantsText" />
    </Field>
    <Field :label="copy.fieldInstagram">
      <Input v-model="draft.instagramHref" type="url" placeholder="https://" />
    </Field>
    <Field :label="copy.fieldPhotos">
      <Textarea v-model="draft.photos" :placeholder="copy.photosPlaceholder" />
    </Field>
    <div class="admin-form__actions">
      <Button type="submit" :disabled="busy">{{ copy.memoryCta }}</Button>
      <Button type="button" variant="ghost" @click="emit('cancel')">{{ copy.cancel }}</Button>
    </div>
  </form>
</template>
