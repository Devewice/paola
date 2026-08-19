<script setup lang="ts">
defineProps<{
  items: readonly { icon: string; label: string }[]
}>()
</script>

<template>
  <div class="feature-icons">
    <div v-for="item in items" :key="item.label" class="feature-icons__item">
      <span class="icon">{{ item.icon }}</span>
      {{ item.label }}
    </div>
  </div>
</template>
