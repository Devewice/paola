<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { ClubModule } from '@modules/club/composition.ts'
import { CLUB_ADMIN_COPY } from '@modules/club/constants/copy.ts'
import type { Alliance } from '@modules/club/domain/entities/Alliance.ts'
import Button from '@ui/Button.vue'
import Field from '@ui/Field.vue'
import Input from '@ui/Input.vue'
import { showToast } from '@ui/toast.ts'

const props = defineProps<{
  module: ClubModule
  clave: string
  alliance?: Alliance | null
}>()

const emit = defineEmits<{ saved: []; cancel: [] }>()

const copy = CLUB_ADMIN_COPY
const editing = computed(() => Boolean(props.alliance))

function fromAlliance(alliance?: Alliance | null) {
  return { name: alliance?.name ?? '', support: alliance?.support ?? '', href: alliance?.href ?? '' }
}

const draft = ref(fromAlliance(props.alliance))
const busy = ref(false)

watch(
  () => props.alliance,
  (alliance) => {
    draft.value = fromAlliance(alliance)
  },
)

async function submit() {
  busy.value = true
  const payload = {
    name: draft.value.name.trim(),
    support: draft.value.support.trim(),
    href: draft.value.href.trim() || undefined,
  }
  const result = props.alliance
    ? await props.module.updateAlliance(props.alliance.id, payload, props.clave)
    : await props.module.createAlliance(payload, props.clave)
  busy.value = false
  if (!result.ok) {
    showToast(result.error.message || copy.allianceFail, 'bad')
    return
  }
  showToast(editing.value ? copy.allianceSaved : copy.allianceOk, 'ok')
  if (!editing.value) draft.value = fromAlliance(null)
  emit('saved')
}
</script>

<template>
  <form class="admin-form" @submit.prevent="submit">
    <Field :label="copy.fieldName">
      <Input v-model="draft.name" />
    </Field>
    <Field :label="copy.fieldSupport">
      <Input v-model="draft.support" />
    </Field>
    <Field :label="copy.fieldHref">
      <Input v-model="draft.href" type="url" placeholder="https://" />
    </Field>
    <div class="admin-form__actions">
      <Button type="submit" :disabled="busy">{{ editing ? copy.save : copy.allianceCta }}</Button>
      <Button type="button" variant="ghost" @click="emit('cancel')">{{ copy.cancel }}</Button>
    </div>
  </form>
</template>
