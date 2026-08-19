<script setup lang="ts">
defineProps<{
  modelValue: string
  options: readonly { value: string; title: string; copy: string }[]
  style?: string | Record<string, string>
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="mode-cards" :style="style">
    <button
      v-for="opt in options"
      :key="opt.value"
      type="button"
      class="mode-card"
      :class="{ 'is-on': modelValue === opt.value }"
      @click="$emit('update:modelValue', opt.value)"
    >
      <strong>{{ opt.title }}</strong>{{ opt.copy }}
    </button>
  </div>
</template>
