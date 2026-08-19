<script setup lang="ts">
defineProps<{
  value: string
  trend?: string
  label: string
}>()
</script>

<template>
  <div class="stat-big">
    <strong>{{ value }}<span v-if="trend" class="trend">{{ trend }}</span></strong>
    <p class="meta" style="margin:8px 0 0">{{ label }}</p>
  </div>
</template>
