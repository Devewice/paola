<script setup lang="ts">
defineProps<{
  items: readonly { icon: string; label: string; locked?: boolean }[]
}>()
</script>

<template>
  <div class="badge-grid">
    <div v-for="item in items" :key="item.label" class="badge-item" :class="{ 'is-locked': item.locked }">
      <div class="badge-item__icon">{{ item.icon }}</div>
      {{ item.label }}
    </div>
  </div>
</template>
