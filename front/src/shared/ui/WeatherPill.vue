<script setup lang="ts">
defineProps<{
  copy?: string
}>()
</script>

<template>
  <span class="weather-pill">{{ copy ?? '☁ Consultar día anterior · no GPS en vivo' }}</span>
</template>
