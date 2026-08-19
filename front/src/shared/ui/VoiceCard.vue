<script setup lang="ts">
defineProps<{
  voice?: 'loigca' | 'incauta' | 'armargura'
  byline?: string
}>()
</script>

<template>
  <div class="voice-card" :class="voice ? `voice-card--${voice}` : undefined">
    <slot />
    <p v-if="$slots.byline" class="voice-card__byline"><slot name="byline" /></p>
    <p v-else-if="byline" class="voice-card__byline">{{ byline }}</p>
  </div>
</template>
