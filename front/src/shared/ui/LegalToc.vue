<script setup lang="ts">
defineProps<{
  items: readonly { label: string; href: string }[]
}>()
</script>

<template>
  <nav class="legal-toc">
    <ol>
      <li v-for="item in items" :key="item.label"><a :href="item.href">{{ item.label }}</a></li>
    </ol>
  </nav>
</template>
