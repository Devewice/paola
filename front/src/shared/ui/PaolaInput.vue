<script setup lang="ts">
defineProps<{
  modelValue: string
  placeholder?: string
  disabled?: boolean
  invalid?: boolean
  type?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <input
    class="paola-input"
    :class="{ 'is-invalid': invalid }"
    :type="type ?? 'text'"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>
