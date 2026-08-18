<script setup lang="ts">
defineProps<{
  author: string
  body: string
  meta: string
}>()
</script>

<template>
  <article class="paola-feed">
    <p class="paola-empty__kicker">{{ author }}</p>
    <p>{{ body }}</p>
    <p class="paola-ride__meta">{{ meta }}</p>
    <slot />
  </article>
</template>
