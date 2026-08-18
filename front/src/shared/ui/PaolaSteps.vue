<script setup lang="ts">
defineProps<{
  steps: readonly string[]
  current: number
}>()
</script>

<template>
  <ol class="paola-steps">
    <li v-for="(step, index) in steps" :key="step" :class="{ 'is-on': index === current }">
      {{ step }}
    </li>
  </ol>
</template>
