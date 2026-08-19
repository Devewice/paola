<script setup lang="ts">
defineProps<{
  day: string
  month: string
  title: string
  meta: string
}>()
</script>

<template>
  <div class="ride-list-item">
    <div class="ride-list-item__date">
      <strong>{{ day }}</strong>
      <span>{{ month }}</span>
    </div>
    <div class="ride-list-item__body">
      <p class="ride-list-item__title">{{ title }}</p>
      <p class="ride-list-item__meta">{{ meta }}</p>
    </div>
    <slot />
  </div>
</template>
