<script setup lang="ts">
defineProps<{
  title: string
  rows: readonly string[]
}>()
</script>

<template>
  <div class="mobile-row-card">
    <div class="mobile-row-card__head">
      <p class="mobile-row-card__title">{{ title }}</p>
      <slot name="chip" />
    </div>
    <div class="mobile-row-card__grid">
      <span v-for="row in rows" :key="row">{{ row }}</span>
    </div>
    <slot />
  </div>
</template>
