<script setup lang="ts">
defineProps<{
  items: readonly { title: string; copy: string }[]
}>()
</script>

<template>
  <div class="trust-strip">
    <div v-for="item in items" :key="item.title" class="trust-strip__item">
      <strong>{{ item.title }}</strong>
      {{ item.copy }}
    </div>
  </div>
</template>
