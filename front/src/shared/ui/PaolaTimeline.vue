<script setup lang="ts">
defineProps<{
  steps: readonly { label: string; done?: boolean }[]
}>()
</script>

<template>
  <ol class="paola-timeline">
    <li v-for="step in steps" :key="step.label" :class="{ 'is-done': step.done }">
      {{ step.label }}
    </li>
  </ol>
</template>
