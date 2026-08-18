<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  modelValue: string
  options: readonly { value: string; label: string }[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const open = ref(false)
const current = () => props.options.find((o) => o.value === props.modelValue)?.label ?? 'Elegir'
</script>

<template>
  <div class="paola-drop">
    <button type="button" class="paola-select-trigger" @click="open = !open">
      {{ current() }}
    </button>
    <div v-if="open" class="paola-drop__menu">
      <button
        v-for="option in options"
        :key="option.value"
        type="button"
        @click="emit('update:modelValue', option.value); open = false"
      >
        {{ option.label }}
      </button>
    </div>
  </div>
</template>
