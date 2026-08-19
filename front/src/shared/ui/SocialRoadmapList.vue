<script setup lang="ts">
defineProps<{
  items: readonly { bold: string; text: string }[]
}>()
</script>

<template>
  <ul>
    <li v-for="item in items" :key="item.bold">
      <strong>{{ item.bold }}</strong> {{ item.text }}
    </li>
  </ul>
</template>
