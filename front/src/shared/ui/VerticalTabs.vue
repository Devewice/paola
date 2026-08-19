<script setup lang="ts">
defineProps<{
  modelValue: string
  tabs: readonly { id: string; label: string; panel: string }[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="vtabs">
    <div class="vtabs__nav">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        :class="{ 'is-on': modelValue === tab.id }"
        @click="emit('update:modelValue', tab.id)"
      >{{ tab.label }}</button>
    </div>
    <div
      v-for="tab in tabs"
      :key="`panel-${tab.id}`"
      class="vtabs__panel"
      :class="{ 'is-on': modelValue === tab.id }"
    >{{ tab.panel }}</div>
  </div>
</template>
