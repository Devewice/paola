<script setup lang="ts">
defineProps<{
  title?: string
  copy?: string
  voice?: 'loigca' | 'incauta' | 'armargura'
  voiceLabel?: string
}>()
</script>

<template>
  <div class="paola-block">
    <span v-if="voice" :class="`voice-badge voice-badge--${voice}`">{{ voiceLabel ?? voice }}</span>
    <h4 v-if="title">{{ title }}</h4>
    <p v-if="copy" class="meta" style="margin: 0">{{ copy }}</p>
    <slot />
  </div>
</template>
