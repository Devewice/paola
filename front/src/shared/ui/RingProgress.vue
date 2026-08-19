<script setup lang="ts">
defineProps<{
  pct: number
  label: string
  title?: string
}>()
</script>

<template>
  <div
    class="ring-progress"
    :data-label="label"
    :style="{ '--pct': pct }"
    :title="title"
  />
</template>
