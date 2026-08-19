<script setup lang="ts">
defineProps<{
  before: string
  after: string
}>()
</script>

<template>
  <div class="ba-slider">
    <div class="ba-slider__after">{{ after }}</div>
    <div class="ba-slider__before">{{ before }}</div>
    <div class="ba-slider__handle" />
  </div>
</template>
