<script setup lang="ts">
defineProps<{
  items: readonly { icon: string; title: string; meta: string }[]
}>()
</script>

<template>
  <ul class="activity-mini">
    <li v-for="item in items" :key="item.title">
      <span class="activity-mini__icon">{{ item.icon }}</span>
      <div>
        <strong>{{ item.title }}</strong>
        <p class="meta" style="margin:2px 0 0">{{ item.meta }}</p>
      </div>
    </li>
  </ul>
</template>
