<script setup lang="ts">
defineProps<{
  copy?: string
}>()
</script>

<template>
  <p class="comment-removed">{{ copy ?? 'Comentario retirado por moderación.' }}</p>
</template>
