<script setup lang="ts">
defineProps<{
  items: readonly string[]
}>()
</script>

<template>
  <ol class="guidelines">
    <li v-for="item in items" :key="item">{{ item }}</li>
  </ol>
</template>
