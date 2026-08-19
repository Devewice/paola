<script setup lang="ts">
defineProps<{
  modelValue: string
  colors: readonly { id: string; label: string }[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="swatch-picker">
    <button
      v-for="color in colors"
      :key="color.id"
      type="button"
      :data-color="color.id"
      :class="{ 'is-on': modelValue === color.id }"
      :aria-label="color.label"
      @click="emit('update:modelValue', color.id)"
    />
  </div>
</template>
