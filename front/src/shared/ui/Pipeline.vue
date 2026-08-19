<script setup lang="ts">
defineProps<{
  steps: readonly { label: string; state?: 'done' | 'active' | 'reject' | 'idle' }[]
}>()
</script>

<template>
  <div class="pipeline">
    <span
      v-for="step in steps"
      :key="step.label"
      class="pipeline__step"
      :class="{
        'is-done': step.state === 'done',
        'is-active': step.state === 'active',
        'is-reject': step.state === 'reject',
      }"
    >{{ step.label }}</span>
  </div>
</template>
