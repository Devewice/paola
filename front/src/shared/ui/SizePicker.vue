<script setup lang="ts">
defineProps<{
  modelValue: string
  sizes: readonly { id: string; label: string; disabled?: boolean }[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="size-picker">
    <button
      v-for="size in sizes"
      :key="size.id"
      type="button"
      :class="{ 'is-on': modelValue === size.id }"
      :disabled="size.disabled"
      @click="!size.disabled && emit('update:modelValue', size.id)"
    >{{ size.label }}</button>
  </div>
</template>
