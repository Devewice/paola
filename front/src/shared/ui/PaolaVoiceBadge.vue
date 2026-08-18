<script setup lang="ts">
import { VOICE_TONES, type VoiceId } from '@shared/theme/voices.ts'

defineProps<{
  voice: VoiceId
}>()
</script>

<template>
  <span class="voice-badge" :class="`voice-badge--${voice}`">
    <strong>{{ VOICE_TONES[voice].name }}</strong>
    {{ VOICE_TONES[voice].phrase }}
  </span>
</template>
