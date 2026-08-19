<script setup lang="ts">
defineProps<{
  items: readonly { label: string; done?: boolean }[]
}>()
</script>

<template>
  <ul class="equip-check">
    <li v-for="item in items" :key="item.label" :class="{ 'is-done': item.done }">{{ item.label }}</li>
  </ul>
</template>
