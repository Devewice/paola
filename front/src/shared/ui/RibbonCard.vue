<script setup lang="ts">
defineProps<{
  ribbon?: string
  style?: string | Record<string, string>
}>()
</script>

<template>
  <div class="ribbon-card" :style="style">
    <span class="ribbon">{{ ribbon ?? 'Próxima' }}</span>
    <slot />
  </div>
</template>
