<script setup lang="ts">
defineProps<{
  title?: string
  copy: string
  style?: string | Record<string, string>
}>()
</script>

<template>
  <div class="banner-inline" :style="style">
    <strong>{{ title ?? 'Disclaimer' }}</strong>
    <span>{{ copy }}</span>
  </div>
</template>
