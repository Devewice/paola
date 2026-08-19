<script setup lang="ts">
defineProps<{
  current: number
  steps: readonly string[]
}>()
</script>

<template>
  <div class="onboard-steps">
    <div
      v-for="(step, index) in steps"
      :key="step"
      class="onboard-steps__item"
      :class="{ 'is-done': index < current, 'is-active': index === current }"
    >
      <span class="onboard-steps__num">{{ index + 1 }}</span>
      {{ step }}
    </div>
  </div>
</template>
