<script setup lang="ts">
defineProps<{
  tabs: readonly { href: string; icon: string; label: string; active?: boolean; badge?: boolean }[]
}>()
</script>

<template>
  <nav class="bottom-nav" aria-label="Pestañas principales">
    <a
      v-for="tab in tabs"
      :key="tab.label"
      :href="tab.href"
      :class="{ 'is-on': tab.active, 'badge-dot': tab.badge }"
    >
      <span class="bottom-nav__icon">{{ tab.icon }}</span>{{ tab.label }}
    </a>
  </nav>
</template>
