<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  modelValue: string
  label: string
  id?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const visible = ref(false)
</script>

<template>
  <div class="field pass-field">
    <label :for="id ?? 'pass-field'">{{ label }}</label>
    <input
      class="input"
      :id="id ?? 'pass-field'"
      :type="visible ? 'text' : 'password'"
      :value="modelValue"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <button type="button" class="pass-field__toggle" @click="visible = !visible">
      {{ visible ? 'Ocultar' : 'Ver' }}
    </button>
  </div>
</template>
