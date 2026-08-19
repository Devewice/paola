<script setup lang="ts">
defineProps<{
  modelValue: string
  chips: readonly { id: string; label: string; disabled?: boolean }[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="time-chips">
    <button
      v-for="chip in chips"
      :key="chip.id"
      type="button"
      class="time-chip"
      :class="{ 'is-on': modelValue === chip.id }"
      :disabled="chip.disabled"
      :style="chip.disabled ? { opacity: 0.4 } : undefined"
      @click="!chip.disabled && emit('update:modelValue', chip.id)"
    >
      {{ chip.label }}
    </button>
  </div>
</template>
