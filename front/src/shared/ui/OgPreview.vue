<script setup lang="ts">
defineProps<{
  image?: string
  title: string
  desc: string
}>()
</script>

<template>
  <div class="og-preview">
    <div class="og-preview__img">{{ image ?? 'Preview · logo / rodada' }}</div>
    <div class="og-preview__body">
      <p class="og-preview__title">{{ title }}</p>
      <p class="og-preview__desc">{{ desc }}</p>
    </div>
  </div>
</template>
