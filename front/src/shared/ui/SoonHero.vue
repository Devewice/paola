<script setup lang="ts">
defineProps<{
  title: string
  copy?: string
}>()
</script>

<template>
  <div class="soon-hero">
    <h3>{{ title }}</h3>
    <p v-if="copy" class="meta" style="margin:0">{{ copy }}</p>
  </div>
</template>
