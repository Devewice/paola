<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <div class="back-bar">
    <button type="button" class="back-bar__btn" aria-label="Volver">←</button>
    <h2 class="back-bar__title">{{ title }}</h2>
  </div>
</template>
