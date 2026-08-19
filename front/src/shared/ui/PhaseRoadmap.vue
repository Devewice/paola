<script setup lang="ts">
defineProps<{
  items: readonly { phase: string; title: string; copy: string; tone?: 'future' | 'gated' }[]
}>()
</script>

<template>
  <div class="phase-roadmap-grid">
    <div
      v-for="item in items"
      :key="item.phase + item.title"
      class="phase-roadmap-card"
      :class="{ 'is-future': item.tone === 'future', 'is-gated': item.tone === 'gated' }"
    >
      <span class="phase-label">{{ item.phase }}</span>
      <strong>{{ item.title }}</strong>
      <p class="meta" style="margin: 6px 0 0">{{ item.copy }}</p>
    </div>
  </div>
</template>
