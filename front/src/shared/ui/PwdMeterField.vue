<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue?: string
  placeholder?: string
}>()

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const strength = computed(() => {
  const len = props.modelValue?.length ?? 0
  if (len >= 12) return '100%'
  if (len >= 8) return '70%'
  if (len >= 4) return '40%'
  return len > 0 ? '15%' : '0%'
})
</script>

<template>
  <div>
    <input
      class="input"
      type="password"
      :placeholder="placeholder ?? 'Mín. 8 caracteres'"
      :value="modelValue"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <div class="pwd-meter"><span :style="{ width: strength }" /></div>
  </div>
</template>
