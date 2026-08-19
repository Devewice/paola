<script setup lang="ts">
defineProps<{
  title: string
  meta: string
  stats: readonly string[]
  icon?: string
}>()
</script>

<template>
  <div class="route-card">
    <div class="route-card__icon">{{ icon ?? 'Ruta' }}</div>
    <div>
      <strong>{{ title }}</strong>
      <p class="meta" style="margin: 4px 0 0">{{ meta }}</p>
      <div class="route-card__stats">
        <span v-for="stat in stats" :key="stat">{{ stat }}</span>
      </div>
    </div>
  </div>
</template>
