<script setup lang="ts">
defineProps<{
  items: readonly { label: string; href?: string }[]
}>()
</script>

<template>
  <p class="crumbs">
    <template v-for="(item, index) in items" :key="item.label">
      <a v-if="item.href" :href="item.href">{{ item.label }}</a>
      <template v-else>{{ item.label }}</template>
      <template v-if="index < items.length - 1"> / </template>
    </template>
  </p>
</template>
