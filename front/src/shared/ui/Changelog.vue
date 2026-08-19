<script setup lang="ts">
defineProps<{
  items: readonly { time: string; text: string }[]
}>()
</script>

<template>
  <ul class="changelog">
    <li v-for="item in items" :key="item.text">
      <time>{{ item.time }}</time>
      <span>{{ item.text }}</span>
    </li>
  </ul>
</template>
