<script setup lang="ts">
defineProps<{
  steps: readonly { title: string; copy: string }[]
  current: number
}>()
</script>

<template>
  <ol class="steps">
    <li
      v-for="(step, index) in steps"
      :key="step.title"
      class="steps__item"
      :class="{ 'is-done': index < current, 'is-active': index === current }"
    >
      <strong>{{ step.title }}</strong>
      {{ step.copy }}
    </li>
  </ol>
</template>
