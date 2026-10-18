<script setup lang="ts">
import { ref } from 'vue'
import type { RidesModule } from '@modules/rides/composition.ts'
import { RIDES_ADMIN_COPY, RIDES_STATUS } from '@modules/rides/constants/copy.ts'
import type { OperatorOutingStatus, Outing } from '@modules/rides/domain/entities/Outing.ts'
import OutingForm from '@modules/rides/presentation/OutingForm.vue'
import AdminDrawer from '@ui/AdminDrawer.vue'
import AdminItemTools from '@ui/AdminItemTools.vue'
import { showToast } from '@ui/toast.ts'

const props = defineProps<{
  module: RidesModule
  clave: string
  outing: Outing
}>()

const emit = defineEmits<{ changed: []; removed: [] }>()

const copy = RIDES_ADMIN_COPY
const open = ref(false)
const busy = ref(false)

async function setStatus(status: OperatorOutingStatus) {
  busy.value = true
  const result = await props.module.setOutingStatus(props.outing.id, status, props.clave)
  busy.value = false
  if (!result.ok) {
    showToast(result.error.message || copy.statusFail, 'bad')
    return
  }
  showToast(copy.statusOk, 'ok')
  emit('changed')
}

async function remove() {
  busy.value = true
  const result = await props.module.removeOuting(props.outing.id, props.clave)
  busy.value = false
  if (!result.ok) {
    showToast(result.error.message || copy.outingRemoveFail, 'bad')
    return
  }
  showToast(copy.outingRemoved, 'ok')
  emit('removed')
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
    :confirm-label="outing.taken ? copy.removeWithTickets(outing.taken) : copy.removeConfirm"
    :busy="busy"
    @edit="open = true"
    @remove="remove"
  >
    <button
      v-if="outing.status === RIDES_STATUS.ABIERTO || outing.status === RIDES_STATUS.LLENO"
      type="button"
      class="admin-tools__btn"
      :disabled="busy"
      @click="setStatus('cerrado')"
    >
      {{ copy.markClosed }}
    </button>
    <button
      v-else-if="outing.status === RIDES_STATUS.CERRADO"
      type="button"
      class="admin-tools__btn"
      :disabled="busy"
      @click="setStatus('abierto')"
    >
      {{ copy.reopen }}
    </button>
    <button
      v-if="outing.status !== RIDES_STATUS.REALIZADO"
      type="button"
      class="admin-tools__btn"
      :disabled="busy"
      @click="setStatus('realizado')"
    >
      {{ copy.markDone }}
    </button>
  </AdminItemTools>
  <AdminDrawer v-model="open" :title="copy.editOutingTitle" :lead="copy.editOutingLead">
    <OutingForm :module="module" :clave="clave" :outing="outing" @saved="onSaved" @cancel="open = false" />
  </AdminDrawer>
</template>
