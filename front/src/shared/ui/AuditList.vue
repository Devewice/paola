<script setup lang="ts">
defineProps<{
  items: readonly string[]
}>()
</script>

<template>
  <ul class="audit-list">
    <li v-for="item in items" :key="item"><input type="checkbox" /> {{ item }}</li>
  </ul>
</template>
