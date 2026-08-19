<script setup lang="ts">
defineProps<{
  copy: string
}>()
</script>

<template>
  <div class="video-block">
    <span class="video-block__play" aria-hidden="true">▶</span>
    <p>{{ copy }}</p>
  </div>
</template>
