<script setup lang="ts">
defineProps<{
  title: string
  collab?: boolean
  href?: string
  linkLabel?: string
  note?: string
}>()
</script>

<template>
  <div class="shelf-header" :class="{ 'shelf-header--collab': collab }">
    <h3>{{ title }}</h3>
    <a v-if="href" :href="href" class="sm">{{ linkLabel ?? 'Ver todo' }}</a>
    <span v-else-if="note" class="sm" style="color: var(--muted)">{{ note }}</span>
  </div>
</template>
