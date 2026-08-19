<script setup lang="ts">
defineProps<{
  steps: readonly { label: string; meta: string; state?: 'done' | 'active' | 'idle' }[]
}>()
</script>

<template>
  <ol class="checkout-vsteps">
    <li
      v-for="(step, index) in steps"
      :key="step.label"
      :class="{ 'is-done': step.state === 'done', 'is-active': step.state === 'active' }"
    >
      <span class="checkout-vsteps__dot">{{ step.state === 'done' ? '✓' : index + 1 }}</span>
      <div>
        <strong>{{ step.label }}</strong>
        <p class="meta" style="margin: 4px 0 0">{{ step.meta }}</p>
      </div>
    </li>
  </ol>
</template>
