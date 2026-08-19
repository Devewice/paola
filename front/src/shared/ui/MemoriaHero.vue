<script setup lang="ts">
defineProps<{
  title: string
  meta: string
}>()
</script>

<template>
  <div class="memoria-hero">
    <div class="memoria-hero__text">
      <h3>{{ title }}</h3>
      <p>{{ meta }}</p>
    </div>
  </div>
</template>
