<script setup lang="ts">
defineProps<{
  question: string
  options: readonly { label: string; pct: string; width: string }[]
}>()
</script>

<template>
  <div class="poll-widget">
    <p style="margin: 0 0 10px">{{ question }}</p>
    <div v-for="option in options" :key="option.label" class="poll-option">
      <div class="poll-option__meta"><span>{{ option.label }}</span><span>{{ option.pct }}</span></div>
      <div class="poll-option__bar"><div class="poll-option__fill" :style="{ width: option.width }" /></div>
    </div>
  </div>
</template>
