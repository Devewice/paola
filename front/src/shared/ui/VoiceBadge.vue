<script setup lang="ts">
import { VOICE_TONES, type VoiceId } from '@shared/theme/voices.ts'

withDefaults(
  defineProps<{
    voice: VoiceId
    /** Si viene, reemplaza el nombre de la voz dentro del badge. */
    label?: string
  }>(),
  {},
)
</script>

<template>
  <span class="voice-badge" :class="`voice-badge--${voice}`" :title="VOICE_TONES[voice].phrase">
    {{ label ?? VOICE_TONES[voice].name }}
  </span>
</template>
