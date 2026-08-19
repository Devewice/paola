<script setup lang="ts">
import Button from '@ui/Button.vue'

defineProps<{
  modelValue: string
  placeholder?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  apply: []
}>()
</script>

<template>
  <div class="discount-row">
    <input
      type="text"
      :value="modelValue"
      :placeholder="placeholder ?? 'Código'"
      aria-label="Código descuento"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <Button variant="ghost" @click="emit('apply')">Aplicar</Button>
  </div>
</template>
