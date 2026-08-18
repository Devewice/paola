<script setup lang="ts">
defineProps<{
  modelValue: string
  placeholder?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <label class="paola-search">
    <span class="paola-field__label">Buscar</span>
    <input
      class="paola-input"
      type="search"
      :value="modelValue"
      :placeholder="placeholder ?? 'Buscar…'"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
  </label>
</template>
