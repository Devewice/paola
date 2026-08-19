<script setup lang="ts">
defineProps<{
  modelValue?: 'yes' | 'no'
}>()

const emit = defineEmits<{
  'update:modelValue': [value: 'yes' | 'no']
}>()
</script>

<template>
  <div class="thumbs-row">
    <button type="button" :class="{ 'is-on': modelValue === 'yes' }" @click="emit('update:modelValue', 'yes')">👍 Sí</button>
    <button type="button" :class="{ 'is-on': modelValue === 'no' }" @click="emit('update:modelValue', 'no')">👎 No</button>
  </div>
</template>
