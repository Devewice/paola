<script setup lang="ts">
defineProps<{
  items: readonly { value: string; label: string }[]
}>()
</script>

<template>
  <div class="kpi-strip">
    <div v-for="item in items" :key="item.label" class="kpi">
      <strong>{{ item.value }}</strong>
      <span>{{ item.label }}</span>
    </div>
  </div>
</template>
