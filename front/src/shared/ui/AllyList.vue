<script setup lang="ts">
defineProps<{
  items: readonly { logo?: string; title: string; copy?: string }[]
}>()
</script>

<template>
  <ul class="ally-list">
    <li v-for="item in items" :key="item.title">
      <div class="ally-list__logo">{{ item.logo ?? 'Logo' }}</div>
      <div>
        <strong>{{ item.title }}</strong>
        <p v-if="item.copy" class="meta" style="margin:4px 0 0">{{ item.copy }}</p>
      </div>
    </li>
  </ul>
</template>
