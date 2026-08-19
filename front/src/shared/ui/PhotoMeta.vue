<script setup lang="ts">
defineProps<{
  items: readonly string[]
}>()
</script>

<template>
  <div class="photo-meta">
    <span v-for="item in items" :key="item">{{ item }}</span>
  </div>
</template>
