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
  <div class="qty-stepper" role="group" aria-label="Cantidad">
    <button
      type="button"
      class="qty-stepper__btn"
      aria-label="Menos"
      @click="emit('update:modelValue', Math.max(min ?? 1, modelValue - 1))"
    >
      −
    </button>
    <span class="qty-stepper__val">{{ modelValue }}</span>
    <button
      type="button"
      class="qty-stepper__btn"
      aria-label="Más"
      @click="emit('update:modelValue', Math.min(max ?? 9, modelValue + 1))"
    >
      +
    </button>
  </div>
</template>
