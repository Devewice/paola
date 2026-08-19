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
  <div class="modal-bg" :class="{ show: modelValue }" @click.self="emit('update:modelValue', false)">
    <div class="modal" role="dialog" :aria-label="title">
      <h3 class="kit">{{ title }}</h3>
      <slot />
    </div>
  </div>
</template>
