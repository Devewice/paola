<script setup lang="ts">
import { ref } from 'vue'
import type { ClubModule } from '@modules/club/composition.ts'
import { CLUB_ADMIN_COPY } from '@modules/club/constants/copy.ts'
import type { Alliance } from '@modules/club/domain/entities/Alliance.ts'
import type { Member } from '@modules/club/domain/entities/Member.ts'
import AllianceForm from '@modules/club/presentation/AllianceForm.vue'
import MemberForm from '@modules/club/presentation/MemberForm.vue'
import AdminDrawer from '@ui/AdminDrawer.vue'
import AdminItemTools from '@ui/AdminItemTools.vue'
import { showToast } from '@ui/toast.ts'

/** Editar o borrar un integrante o una alianza desde donde se vea. */
const props = defineProps<{
  module: ClubModule
  clave: string
  member?: Member
  alliance?: Alliance
}>()

const emit = defineEmits<{ changed: [] }>()

const copy = CLUB_ADMIN_COPY
const open = ref(false)
const busy = ref(false)

async function remove() {
  busy.value = true
  const result = props.member
    ? await props.module.removeMember(props.member.id, props.clave)
    : props.alliance
      ? await props.module.removeAlliance(props.alliance.id, props.clave)
      : null
  busy.value = false
  if (!result) return
  if (!result.ok) {
    showToast(result.error.message || copy.removeFail, 'bad')
    return
  }
  showToast(copy.removed, 'ok')
  emit('changed')
}

function onSaved() {
  open.value = false
  emit('changed')
}
</script>

<template>
  <AdminItemTools
    :edit-label="copy.edit"
    :remove-label="copy.remove"
    :confirm-label="copy.removeConfirm"
    :busy="busy"
    @edit="open = true"
    @remove="remove"
  />
  <AdminDrawer v-model="open" :title="member ? copy.editMemberTitle : copy.editAllianceTitle">
    <MemberForm v-if="member" :module="module" :clave="clave" :member="member" @saved="onSaved" @cancel="open = false" />
    <AllianceForm
      v-else-if="alliance"
      :module="module"
      :clave="clave"
      :alliance="alliance"
      @saved="onSaved"
      @cancel="open = false"
    />
  </AdminDrawer>
</template>
