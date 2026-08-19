<script setup lang="ts">
defineProps<{
  voice?: 'loigca' | 'incauta' | 'armargura'
  voiceLabel?: string
}>()
</script>

<template>
  <div class="paper-frame">
    <span v-if="voice" :class="`voice-badge voice-badge--${voice}`">{{ voiceLabel ?? voice }}</span>
    <slot />
  </div>
</template>
