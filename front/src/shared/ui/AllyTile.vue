<script setup lang="ts">
defineProps<{
  logo?: string
  title: string
  copy?: string
}>()
</script>

<template>
  <div class="ally-card">
    <div class="ally-card__logo">{{ logo ?? 'Logo' }}</div>
    <strong>{{ title }}</strong>
    <p v-if="copy" class="meta" style="margin:6px 0 0">{{ copy }}</p>
  </div>
</template>
