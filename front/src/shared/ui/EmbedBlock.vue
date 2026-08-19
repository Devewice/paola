<script setup lang="ts">
defineProps<{
  copy: string
}>()
</script>

<template>
  <div class="embed-16x9">{{ copy }}</div>
</template>
