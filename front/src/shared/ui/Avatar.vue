<script setup lang="ts">
defineProps<{
  initial: string
}>()
</script>

<template>
  <div class="avatar">{{ initial }}</div>
</template>
