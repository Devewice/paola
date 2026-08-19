<script setup lang="ts">
defineProps<{
  items: readonly { src: string; alt: string; caption: string }[]
}>()
</script>

<template>
  <div class="afiche-refs">
    <figure v-for="item in items" :key="item.src" class="afiche-ref">
      <img :src="item.src" :alt="item.alt" />
      <figcaption>{{ item.caption }}</figcaption>
    </figure>
  </div>
</template>
