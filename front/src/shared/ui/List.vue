<script setup lang="ts">
defineProps<{
  items: readonly string[]
  kind?: 'check' | 'choice' | 'action' | 'media'
}>()
</script>

<template>
  <ul class="paola-list" :class="`paola-list--${kind ?? 'check'}`">
    <li v-for="item in items" :key="item">{{ item }}</li>
  </ul>
</template>
