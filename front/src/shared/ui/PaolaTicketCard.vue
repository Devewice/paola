<script setup lang="ts">
defineProps<{
  title: string
  meta: string
}>()
</script>

<template>
  <article class="paola-ticket">
    <p class="paola-empty__kicker">Ticket</p>
    <h3 class="paola-ride__title">{{ title }}</h3>
    <p class="paola-ride__meta">{{ meta }}</p>
    <slot />
  </article>
</template>
