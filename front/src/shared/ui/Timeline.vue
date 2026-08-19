<script setup lang="ts">
defineProps<{
  steps: readonly { title?: string; label?: string; meta?: string; done?: boolean; state?: 'done' | 'active' }[]
}>()
</script>

<template>
  <ul class="timeline">
    <li
      v-for="(step, index) in steps"
      :key="step.title ?? step.label ?? index"
      :class="{
        'is-done': step.done || step.state === 'done',
        'is-active': step.state === 'active',
      }"
    >
      <p class="timeline__title">{{ step.title ?? step.label }}</p>
      <p v-if="step.meta" class="timeline__meta">{{ step.meta }}</p>
    </li>
  </ul>
</template>
