<script setup lang="ts">
defineProps<{
  modelValue: string
  tabs: readonly { id: string; label: string }[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="paola-tabs" role="tablist">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      type="button"
      role="tab"
      :class="{ 'is-on': modelValue === tab.id }"
      @click="emit('update:modelValue', tab.id)"
    >
      {{ tab.label }}
    </button>
  </div>
</template>
