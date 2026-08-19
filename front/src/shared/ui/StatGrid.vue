<script setup lang="ts">
defineProps<{
  items: readonly { value: string; label: string }[]
}>()
</script>

<template>
  <div class="stat-grid">
    <div v-for="item in items" :key="item.label" class="stat-box">
      <strong>{{ item.value }}</strong>
      <span>{{ item.label }}</span>
    </div>
  </div>
</template>
