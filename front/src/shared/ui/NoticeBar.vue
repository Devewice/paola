<script setup lang="ts">
defineProps<{
  kicker?: string
  text: string
}>()
</script>

<template>
  <div class="notice-bar">
    <span v-if="kicker" class="meta">{{ kicker }}</span>
    <span>{{ text }}</span>
  </div>
</template>
