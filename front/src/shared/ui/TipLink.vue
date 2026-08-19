<script setup lang="ts">
defineProps<{
  voice?: 'loigca' | 'incauta' | 'armargura'
  label: string
  href?: string
}>()
</script>

<template>
  <a class="tip-item" :href="href ?? '#'">
    <span v-if="voice" :class="`voice-badge voice-badge--${voice}`">{{ voice === 'loigca' ? 'Loigca' : voice }}</span>
    <span>{{ label }}</span>
    <span class="meta">→</span>
  </a>
</template>
