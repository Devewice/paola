<script setup lang="ts">
defineProps<{
  items: readonly { label: string; href: string }[]
  current: string
  kicker?: string
  copy?: string
}>()
</script>

<template>
  <div class="layout-sidebar">
    <nav class="layout-sidebar__nav" aria-label="Panel lateral">
      <a
        v-for="item in items"
        :key="item.label"
        :href="item.href"
        :class="{ 'is-on': current === item.label }"
      >{{ item.label }}</a>
    </nav>
    <div class="layout-sidebar__main">
      <p v-if="kicker" class="meta" style="margin: 0 0 8px">{{ kicker }}</p>
      <p v-if="copy" class="sm" style="margin: 0; color: var(--muted)">{{ copy }}</p>
      <slot />
    </div>
  </div>
</template>
