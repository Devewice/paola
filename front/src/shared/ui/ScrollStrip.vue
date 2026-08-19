<script setup lang="ts">
defineProps<{
  items: readonly { title: string; meta: string }[]
}>()
</script>

<template>
  <div class="scroll-strip">
    <div v-for="item in items" :key="item.title" class="scroll-strip__item">
      <strong>{{ item.title }}</strong><br />
      <span class="meta">{{ item.meta }}</span>
    </div>
  </div>
</template>
