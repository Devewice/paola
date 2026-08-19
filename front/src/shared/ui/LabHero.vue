<script setup lang="ts">
defineProps<{
  title: string
  copy?: string
}>()
</script>

<template>
  <div class="lab-hero">
    <h2>{{ title }}</h2>
    <p v-if="copy" class="meta" style="margin:0">{{ copy }}</p>
    <slot />
  </div>
</template>
