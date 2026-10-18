<script setup lang="ts">
import { ref } from 'vue'
import type { VoiceModule } from '@modules/voice/composition.ts'
import { VOICE_ADMIN_COPY } from '@modules/voice/constants/copy.ts'
import type { FineGuide } from '@modules/voice/domain/entities/Fine.ts'
import type { Tip } from '@modules/voice/domain/entities/Tip.ts'
import FineForm from '@modules/voice/presentation/FineForm.vue'
import TipForm from '@modules/voice/presentation/TipForm.vue'
import AdminDrawer from '@ui/AdminDrawer.vue'
import AdminItemTools from '@ui/AdminItemTools.vue'
import { showToast } from '@ui/toast.ts'

/** Editar o borrar un tip o una guía de comparendo desde donde se vea. */
const props = defineProps<{
  module: VoiceModule
  clave: string
  tip?: Tip
  fine?: FineGuide
}>()

const emit = defineEmits<{ changed: [] }>()

const copy = VOICE_ADMIN_COPY
const open = ref(false)
const busy = ref(false)

async function remove() {
  busy.value = true
  const result = props.tip
    ? await props.module.removeTip(props.tip.id, props.clave)
    : props.fine
      ? await props.module.removeFine(props.fine.id, props.clave)
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
  <AdminDrawer v-model="open" :title="tip ? copy.editTipTitle : copy.editFineTitle">
    <TipForm v-if="tip" :module="module" :clave="clave" :tip="tip" @saved="onSaved" @cancel="open = false" />
    <FineForm
      v-else-if="fine"
      :module="module"
      :clave="clave"
      :fine="fine"
      @saved="onSaved"
      @cancel="open = false"
    />
  </AdminDrawer>
</template>
