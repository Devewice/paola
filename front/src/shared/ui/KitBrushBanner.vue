<script setup lang="ts">
defineProps<{
  copy?: string
}>()
</script>

<template>
  <div class="brush-banner">
    <svg viewBox="0 0 800 52" preserveAspectRatio="none" aria-hidden="true"><use href="#brush-banner-bg" /></svg>
    <p class="type-stamped">{{ copy ?? '¡Nos vemos en la ruta!' }}</p>
  </div>
</template>
