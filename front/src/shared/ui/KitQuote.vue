<script setup lang="ts">
defineProps<{
  style?: string | Record<string, string>
}>()
</script>

<template>
  <blockquote class="quote" :style="style">
    <slot />
  </blockquote>
</template>
