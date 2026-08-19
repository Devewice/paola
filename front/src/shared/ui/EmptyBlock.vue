<script setup lang="ts">
defineProps<{
  glyph: string
  copy: string
}>()
</script>

<template>
  <div class="empty-block"><strong>{{ glyph }}</strong>{{ copy }}</div>
</template>
