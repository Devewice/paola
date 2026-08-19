<script setup lang="ts">
defineProps<{
  copy?: string
}>()
</script>

<template>
  <div class="mod-comment-bar">
    <p>{{ copy ?? 'Barra de moderador en hilo — ocultar, fijar, cerrar.' }}</p>
    <slot />
  </div>
</template>
