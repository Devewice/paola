<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { ADMIN_CONFIRM_MS, ADMIN_TOOLS_COPY } from '@ui/adminCopy.ts'

withDefaults(
  defineProps<{
    editLabel?: string
    removeLabel?: string
    confirmLabel?: string
    editable?: boolean
    removable?: boolean
    busy?: boolean
  }>(),
  {
    editLabel: ADMIN_TOOLS_COPY.edit,
    removeLabel: ADMIN_TOOLS_COPY.remove,
    confirmLabel: ADMIN_TOOLS_COPY.removeConfirm,
    editable: true,
    removable: true,
  },
)

const emit = defineEmits<{ edit: []; remove: [] }>()

const confirming = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

function onRemove(): void {
  if (confirming.value) {
    confirming.value = false
    clearTimeout(timer)
    emit('remove')
    return
  }
  confirming.value = true
  timer = setTimeout(() => {
    confirming.value = false
  }, ADMIN_CONFIRM_MS)
}

onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <div class="admin-tools" role="group">
    <button v-if="editable" type="button" class="admin-tools__btn" :disabled="busy" @click="emit('edit')">
      {{ editLabel }}
    </button>
    <slot />
    <button
      v-if="removable"
      type="button"
      class="admin-tools__btn admin-tools__btn--danger"
      :class="{ 'is-confirming': confirming }"
      :disabled="busy"
      @click="onRemove"
    >
      {{ confirming ? confirmLabel : removeLabel }}
    </button>
  </div>
</template>
