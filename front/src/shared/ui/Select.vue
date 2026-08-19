<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  modelValue: string
  options: readonly { value: string; label: string; muted?: boolean }[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const open = ref(false)
const current = () => props.options.find((o) => o.value === props.modelValue)?.label ?? 'Elegir'
</script>

<template>
  <div class="list-select" :class="{ open: open }">
    <button type="button" class="list-select__trigger" aria-haspopup="listbox" :aria-expanded="open" @click="open = !open">
      <span class="list-select__value">{{ current() }}</span>
      <span class="list-select__chev" aria-hidden="true" />
    </button>
    <ul v-if="open" class="list-select__menu" role="listbox">
      <li
        v-for="option in options"
        :key="option.value"
        class="list-select__option"
        :class="{ 'is-selected': option.value === modelValue, 'is-muted': option.muted }"
        role="option"
        @click="emit('update:modelValue', option.value); open = false"
      >
        {{ option.label }}
      </li>
    </ul>
  </div>
</template>
