<script setup lang="ts">
defineProps<{
  media?: string
  readTime: string
  voice: string
  title: string
  copy: string
}>()
</script>

<template>
  <article class="blog-card">
    <div class="blog-card__media">{{ media ?? 'Foto ruta' }}</div>
    <div class="blog-card__body">
      <div class="blog-card__meta"><span>{{ readTime }}</span><span>{{ voice }}</span></div>
      <strong>{{ title }}</strong>
      <p class="meta" style="margin: 8px 0 0">{{ copy }}</p>
    </div>
  </article>
</template>
