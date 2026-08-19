<script setup lang="ts">
defineProps<{
  items: readonly string[]
}>()
</script>

<template>
  <div class="lightbox-grid">
    <button v-for="item in items" :key="item" type="button">{{ item }}</button>
  </div>
</template>
