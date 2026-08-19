<script setup lang="ts">
defineProps<{
  title: string
  copy: string
}>()
</script>

<template>
  <div class="wa-hero">
    <h4>{{ title }}</h4>
    <p class="meta" style="margin: 0 0 12px">{{ copy }}</p>
    <slot />
  </div>
</template>
