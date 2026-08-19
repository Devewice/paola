<script setup lang="ts">
defineProps<{
  modelValue: string
  slots: readonly { id: string; label: string; disabled?: boolean }[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="slot-grid">
    <button
      v-for="item in slots"
      :key="item.id"
      type="button"
      :class="{ 'is-on': modelValue === item.id }"
      :disabled="item.disabled"
      @click="!item.disabled && emit('update:modelValue', item.id)"
    >{{ item.label }}</button>
  </div>
</template>
