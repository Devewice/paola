<script setup lang="ts">
defineProps<{
  copy?: string
  style?: string | Record<string, string>
}>()
</script>

<template>
  <div class="comment-closed" :style="style">{{ copy ?? 'Comentarios cerrados en esta denuncia · solo lectura del registro publicado.' }}</div>
</template>
