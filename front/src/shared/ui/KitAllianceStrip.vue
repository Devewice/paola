<script setup lang="ts">
defineProps<{
  items: readonly string[]
  style?: string | Record<string, string>
}>()
</script>

<template>
  <div class="alliance-strip" :style="style">
    <div v-for="item in items" :key="item" class="alliance-strip__logo">{{ item }}</div>
  </div>
</template>
