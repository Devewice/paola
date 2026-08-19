<script setup lang="ts">
import Button from '@ui/Button.vue'
import VoiceBadge from '@ui/VoiceBadge.vue'
import { VOICE_TONES, type VoiceId } from '@shared/theme/voices.ts'

withDefaults(
  defineProps<{
    title: string
    copy?: string
    mascotSrc?: string
    mascotAlt?: string
    compact?: boolean
    hideCta?: boolean
    ctaHref?: string
    ctaLabel?: string
    glyph?: string
  }>(),
  {
    copy: 'Próximamente. Esta pestaña todavía no tiene contenido.',
    mascotSrc: '/mascota/en-pie.png',
    mascotAlt: 'Insta360, mascota Cámara Incauta del parche',
    compact: false,
    hideCta: false,
    ctaHref: 'mailto:contacto@paolabiker.com',
    ctaLabel: 'Escribirle a Paola',
  },
)

const voices = Object.keys(VOICE_TONES) as VoiceId[]
</script>

<template>
  <section class="empty-state" :class="{ 'empty-block': compact }">
    <div class="empty-state__icon" aria-hidden="true">
      <img v-if="!glyph" :src="mascotSrc" :alt="mascotAlt" width="40" height="40" />
      <template v-else>{{ glyph }}</template>
    </div>
    <h3>{{ title }}</h3>
    <p>{{ copy }}</p>
    <div v-if="!compact && !glyph" class="row" style="justify-content: center; margin-bottom: 16px">
      <VoiceBadge v-for="id in voices" :key="id" :voice="id" />
    </div>
    <Button v-if="!hideCta" :href="ctaHref" size="sm" :variant="glyph ? 'ghost' : 'primary'" :target="ctaHref.startsWith('http') ? '_blank' : undefined">
      {{ ctaLabel }}
    </Button>
  </section>
</template>
