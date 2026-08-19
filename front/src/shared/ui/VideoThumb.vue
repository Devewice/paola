<script setup lang="ts">
defineProps<{
  duration?: string
}>()
</script>

<template>
  <div class="video-thumb">
    <button type="button" class="video-thumb__play" aria-label="Reproducir">▶</button>
    <span class="video-thumb__dur">{{ duration ?? '—:—' }}</span>
  </div>
</template>
