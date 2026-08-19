<script setup lang="ts">
defineProps<{
  items: readonly { label: string; href: string }[]
}>()
</script>

<template>
  <ul class="section-index">
    <li v-for="(item, index) in items" :key="item.label">
      <a :href="item.href">{{ item.label }}</a>
      <span>§{{ index + 1 }}</span>
    </li>
  </ul>
</template>
