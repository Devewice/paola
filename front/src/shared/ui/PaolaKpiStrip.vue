<script setup lang="ts">
defineProps<{
  items: readonly { value: string; label: string }[]
}>()
</script>

<template>
  <div class="paola-kpi">
    <div v-for="item in items" :key="item.label" class="paola-stat">
      <strong>{{ item.value }}</strong>
      <span>{{ item.label }}</span>
    </div>
  </div>
</template>
