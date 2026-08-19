<script setup lang="ts">
defineProps<{
  title: string
  meta: string
  badge?: string
}>()
</script>

<template>
  <div class="address-card" :class="{ 'is-default': Boolean(badge) }">
    <span v-if="badge" class="address-card__badge">{{ badge }}</span>
    <strong>{{ title }}</strong>
    <p class="meta" style="margin: 6px 0 0">{{ meta }}</p>
  </div>
</template>
