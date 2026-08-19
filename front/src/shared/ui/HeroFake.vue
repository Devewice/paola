<script setup lang="ts">
defineProps<{
  copy?: string
}>()
</script>

<template>
  <div class="hero-fake">
    <p class="meta">{{ copy ?? 'Capa afiche · texto sobre foto' }}</p>
  </div>
</template>
