<script setup lang="ts">
defineProps<{
  logo?: string
  copy: string
}>()
</script>

<template>
  <div class="alliance-card">
    <div class="alliance-card__logo">{{ logo ?? 'Logo aliado' }}</div>
    <p class="sm" style="margin: 0; color: var(--muted)">{{ copy }}</p>
  </div>
</template>
