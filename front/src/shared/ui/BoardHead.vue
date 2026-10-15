<script setup lang="ts">
import type { VoiceId } from '@shared/theme/voices.ts'
import Button from '@ui/Button.vue'
import VoiceBadge from '@ui/VoiceBadge.vue'

withDefaults(
  defineProps<{
    title: string
    lead?: string
    voice?: VoiceId
    /** Extracto: enlace a la página completa de la sección. */
    moreTo?: string
    moreLabel?: string
  }>(),
  {},
)
</script>

<template>
  <header class="board-head">
    <div class="board-head__text">
      <VoiceBadge v-if="voice" :voice="voice" />
      <h2 class="board-head__title">{{ title }}</h2>
      <p v-if="lead" class="board-head__lead">{{ lead }}</p>
    </div>
    <Button v-if="moreTo && moreLabel" class="board-head__more" :to="moreTo" variant="ghost" size="sm">
      {{ moreLabel }}
    </Button>
  </header>
</template>
