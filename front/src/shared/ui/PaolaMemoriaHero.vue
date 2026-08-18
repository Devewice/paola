<script setup lang="ts">
defineProps<{
  title: string
  meta: string
}>()
</script>

<template>
  <header class="paola-memoria">
    <p class="paola-empty__kicker">Cámara Incauta</p>
    <h2 class="paola-ride__title">{{ title }}</h2>
    <p class="paola-ride__meta">{{ meta }}</p>
  </header>
</template>
