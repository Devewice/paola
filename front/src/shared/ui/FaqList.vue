<script setup lang="ts">
defineProps<{
  items: readonly { q: string; a: string }[]
}>()
</script>

<template>
  <div class="faq-masonry">
    <article v-for="item in items" :key="item.q">
      <h5>{{ item.q }}</h5>
      <p class="meta" style="margin: 0">{{ item.a }}</p>
    </article>
  </div>
</template>
