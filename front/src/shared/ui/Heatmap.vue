<script setup lang="ts">
defineProps<{
  cells: readonly ('' | 'l1' | 'l2' | 'l3')[]
}>()
</script>

<template>
  <div class="heatmap" aria-hidden="true">
    <span v-for="(cell, index) in cells" :key="index" :class="cell" />
  </div>
</template>
