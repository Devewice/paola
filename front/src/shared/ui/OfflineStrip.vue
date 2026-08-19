<script setup lang="ts">
defineProps<{
  copy: string
}>()
</script>

<template>
  <div class="offline-strip">{{ copy }}</div>
</template>
