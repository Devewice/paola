<script setup lang="ts">
defineProps<{
  lines: readonly string[]
  footer?: string
}>()
</script>

<template>
  <div class="wa-order">
    <template v-for="(line, index) in lines" :key="index">{{ line }}<br v-if="index < lines.length - 1" /></template>
    <p v-if="footer" class="wa-order__line">{{ footer }}</p>
  </div>
</template>
