<script setup lang="ts">
defineProps<{
  modelValue: string
  options: readonly { id: string; label: string; blocked?: boolean; disabled?: boolean }[]
}>()

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <div class="city-gate">
    <button
      v-for="option in options"
      :key="option.id"
      type="button"
      :class="{ 'is-on': modelValue === option.id, 'is-blocked': option.blocked }"
      :disabled="option.disabled"
      @click="emit('update:modelValue', option.id)"
    >{{ option.label }}</button>
  </div>
</template>
