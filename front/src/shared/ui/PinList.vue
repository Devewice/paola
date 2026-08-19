<script setup lang="ts">
defineProps<{
  items: readonly { title: string; meta: string }[]
}>()
</script>

<template>
  <ul class="pin-list">
    <li v-for="item in items" :key="item.title">
      <span class="pin-list__icon">📍</span>
      <div>
        <strong>{{ item.title }}</strong><br />
        <span class="meta">{{ item.meta }}</span>
      </div>
    </li>
  </ul>
</template>
