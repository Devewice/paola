<script setup lang="ts">
withDefaults(
  defineProps<{
    kind?: 'line' | 'card'
    width?: 'full' | 'w60' | 'w40'
  }>(),
  { kind: 'line', width: 'full' },
)
</script>

<template>
  <div
    class="skeleton"
    :class="[kind === 'card' ? 'skeleton-card' : 'skeleton-line', width === 'full' ? '' : width]"
    aria-hidden="true"
  />
</template>
