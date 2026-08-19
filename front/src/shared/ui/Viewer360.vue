<script setup lang="ts">
defineProps<{
  copy: string
  hint?: string
}>()
</script>

<template>
  <div class="viewer-360">
    {{ copy }}
    <span class="viewer-360__hint">{{ hint ?? '360°' }}</span>
  </div>
</template>
