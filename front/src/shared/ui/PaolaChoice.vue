<script setup lang="ts">
defineProps<{
  modelValue: boolean
  label: string
  kind?: 'check' | 'radio' | 'switch'
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>

<template>
  <label class="paola-choice">
    <input
      :type="kind === 'radio' ? 'radio' : 'checkbox'"
      :checked="modelValue"
      @change="emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
    />
    {{ label }}
  </label>
</template>
