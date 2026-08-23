<script setup lang="ts">
import InputElectricFrame from '@ui/InputElectricFrame.vue'

withDefaults(
  defineProps<{
    modelValue: string
    placeholder?: string
    disabled?: boolean
    invalid?: boolean
    type?: string
    tone?: 'plain' | 'electric'
  }>(),
  { tone: 'plain' },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <span v-if="tone === 'electric'" class="input-electric" :class="{ 'is-invalid': invalid }">
    <InputElectricFrame />
    <input
      class="input input--electric"
      :class="{ 'is-invalid': invalid }"
      :type="type ?? 'text'"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
  </span>
  <input
    v-else
    class="input"
    :class="{ 'is-invalid': invalid }"
    :type="type ?? 'text'"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>
