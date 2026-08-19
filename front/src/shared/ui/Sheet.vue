<script setup lang="ts">
defineProps<{
  title: string
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>

<template>
  <div class="sheet-bg" :class="{ show: modelValue }" @click.self="emit('update:modelValue', false)">
    <div class="sheet" role="dialog" :aria-label="title">
      <div class="sheet__handle" aria-hidden="true" />
      <h3 class="sheet__title">{{ title }}</h3>
      <slot />
    </div>
  </div>
</template>
