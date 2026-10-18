<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { ClubModule } from '@modules/club/composition.ts'
import { CLUB_ADMIN_COPY } from '@modules/club/constants/copy.ts'
import type { Member } from '@modules/club/domain/entities/Member.ts'
import Button from '@ui/Button.vue'
import Field from '@ui/Field.vue'
import Input from '@ui/Input.vue'
import { showToast } from '@ui/toast.ts'

const props = defineProps<{
  module: ClubModule
  clave: string
  member?: Member | null
}>()

const emit = defineEmits<{ saved: []; cancel: [] }>()

const copy = CLUB_ADMIN_COPY
const editing = computed(() => Boolean(props.member))

function fromMember(member?: Member | null) {
  return { alias: member?.alias ?? '', moto: member?.moto ?? '', instagramHref: member?.instagramHref ?? '' }
}

const draft = ref(fromMember(props.member))
const busy = ref(false)

watch(
  () => props.member,
  (member) => {
    draft.value = fromMember(member)
  },
)

async function submit() {
  busy.value = true
  const payload = {
    alias: draft.value.alias.trim(),
    moto: draft.value.moto.trim() || undefined,
    instagramHref: draft.value.instagramHref.trim() || undefined,
  }
  const result = props.member
    ? await props.module.updateMember(props.member.id, payload, props.clave)
    : await props.module.createMember(payload, props.clave)
  busy.value = false
  if (!result.ok) {
    showToast(result.error.message || copy.memberFail, 'bad')
    return
  }
  showToast(editing.value ? copy.memberSaved : copy.memberOk, 'ok')
  if (!editing.value) draft.value = fromMember(null)
  emit('saved')
}
</script>

<template>
  <form class="admin-form" @submit.prevent="submit">
    <Field :label="copy.fieldAlias">
      <Input v-model="draft.alias" />
    </Field>
    <Field :label="copy.fieldMoto">
      <Input v-model="draft.moto" />
    </Field>
    <Field :label="copy.fieldInstagram">
      <Input v-model="draft.instagramHref" type="url" placeholder="https://instagram.com/" />
    </Field>
    <div class="admin-form__actions">
      <Button type="submit" :disabled="busy">{{ editing ? copy.save : copy.memberCta }}</Button>
      <Button type="button" variant="ghost" @click="emit('cancel')">{{ copy.cancel }}</Button>
    </div>
  </form>
</template>
