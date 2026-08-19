<script setup lang="ts">
defineProps<{
  modelValue: string
  options: readonly { value: string; label: string }[]
  id?: string
  style?: string | Record<string, string>
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div :id="id" class="segmented" :style="style">
    <button
      v-for="opt in options"
      :key="opt.value"
      type="button"
      class="segmented__btn"
      :class="{ 'is-on': modelValue === opt.value }"
      @click="$emit('update:modelValue', opt.value)"
    >
      {{ opt.label }}
    </button>
  </div>
</template>
