<script setup lang="ts">
defineProps<{
  modelValue: number
  min?: number
  max?: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()
</script>

<template>
  <div class="paola-qty" role="group" aria-label="Cantidad">
    <button type="button" @click="emit('update:modelValue', Math.max(min ?? 1, modelValue - 1))">−</button>
    <span>{{ modelValue }}</span>
    <button type="button" @click="emit('update:modelValue', Math.min(max ?? 9, modelValue + 1))">+</button>
  </div>
</template>
