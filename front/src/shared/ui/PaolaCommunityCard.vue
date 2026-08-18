<script setup lang="ts">
defineProps<{
  title: string
  meta: string
}>()
</script>

<template>
  <article class="paola-community">
    <h3 class="paola-ride__title">{{ title }}</h3>
    <p class="paola-ride__meta">{{ meta }}</p>
    <p>Comunidad persistente en web. WhatsApp sigue como canal paralelo.</p>
  </article>
</template>
