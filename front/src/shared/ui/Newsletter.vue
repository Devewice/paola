<script setup lang="ts">
import Button from '@ui/Button.vue'

defineProps<{
  modelValue: string
  placeholder?: string
  cta?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="newsletter-inline">
    <input
      type="email"
      :value="modelValue"
      :placeholder="placeholder ?? 'Tu correo'"
      aria-label="Correo newsletter"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <Button>{{ cta ?? 'Avisos rodada' }}</Button>
  </div>
</template>
