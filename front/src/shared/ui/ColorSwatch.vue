<script setup lang="ts">
defineProps<{
  css: string
  label: string
  border?: boolean
}>()
</script>

<template>
  <div class="swatch">
    <i :style="{ background: css, border: border ? '1px solid var(--line)' : undefined }" />
    <span>{{ label }}</span>
  </div>
</template>
