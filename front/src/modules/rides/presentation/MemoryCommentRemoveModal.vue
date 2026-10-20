<script setup lang="ts">
import { MEMORY_COMMENTS_MOD_COPY } from '@modules/rides/constants/copy.ts'
import AdminModal from '@ui/AdminModal.vue'
import Button from '@ui/Button.vue'

defineProps<{ open: boolean; busy: boolean }>()
const emit = defineEmits<{ cancel: []; confirm: [] }>()

const copy = MEMORY_COMMENTS_MOD_COPY
</script>

<template>
  <AdminModal
    :model-value="open"
    tone="danger"
    :title="copy.removeTitle"
    :copy="copy.removeBody"
    @update:model-value="(value) => !value && emit('cancel')"
  >
    <template #actions>
      <Button size="sm" variant="ghost" @click="emit('cancel')">{{ copy.removeCancel }}</Button>
      <Button size="sm" variant="danger" :disabled="busy" @click="emit('confirm')">{{ copy.removeYes }}</Button>
    </template>
  </AdminModal>
</template>
