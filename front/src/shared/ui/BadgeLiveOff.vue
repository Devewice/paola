<script setup lang="ts">
defineProps<{
  copy?: string
}>()
</script>

<template>
  <span class="badge-live-off">{{ copy ?? 'Sin GPS en vivo' }}</span>
</template>
