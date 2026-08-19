<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: number
    label?: string
    min?: number
    max?: number
    minLabel?: string
    maxLabel?: string
  }>(),
  { modelValue: 60, label: 'Hasta $ —', min: 0, max: 100, minLabel: '$0', maxLabel: '$ —' },
)

const emit = defineEmits<{ 'update:modelValue': [value: number] }>()

const valueLabel = computed(() => props.maxLabel)
</script>

<template>
  <div class="range-field">
    <label>{{ label }}</label>
    <input
      type="range"
      :min="min"
      :max="max"
      :value="modelValue"
      @input="emit('update:modelValue', Number(($event.target as HTMLInputElement).value))"
    />
    <div class="range-field__labels"><span>{{ minLabel }}</span><span>{{ valueLabel }}</span></div>
  </div>
</template>
