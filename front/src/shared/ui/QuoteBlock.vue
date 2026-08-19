<script setup lang="ts">
defineProps<{
  quote: string
  cite: string
}>()
</script>

<template>
  <blockquote class="quote-block">
    {{ quote }}
    <cite>{{ cite }}</cite>
  </blockquote>
</template>
