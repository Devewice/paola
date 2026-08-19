<script setup lang="ts">
defineProps<{
  modelValue: string
  tools: readonly { id: string; label: string; icon: string }[]
}>()

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <div class="icon-toolbar">
    <button
      v-for="tool in tools"
      :key="tool.id"
      type="button"
      :class="{ 'is-on': modelValue === tool.id }"
      :aria-label="tool.label"
      @click="emit('update:modelValue', tool.id)"
    >{{ tool.icon }}</button>
  </div>
</template>
