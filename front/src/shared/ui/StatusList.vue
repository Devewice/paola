<script setup lang="ts">
defineProps<{
  items: readonly { label: string; tone?: 'ok' | 'warn' | 'bad' }[]
}>()
</script>

<template>
  <ul class="status-list">
    <li v-for="item in items" :key="item.label">
      <span class="status-dot" :class="`status-dot--${item.tone ?? 'ok'}`" />
      {{ item.label }}
    </li>
  </ul>
</template>
