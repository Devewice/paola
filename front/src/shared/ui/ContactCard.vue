<script setup lang="ts">
defineProps<{
  items: readonly { label: string; href?: string; icon: string }[]
}>()
</script>

<template>
  <div class="contact-card">
    <a v-for="item in items" :key="item.label" :href="item.href ?? '#'">
      <span class="icon" style="width: 32px; height: 32px; font-size: 14px">{{ item.icon }}</span>
      {{ item.label }}
    </a>
  </div>
</template>
