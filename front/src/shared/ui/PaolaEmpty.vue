<script setup lang="ts">
import PaolaButton from '@ui/PaolaButton.vue'
import PaolaCard from '@ui/PaolaCard.vue'
import PaolaVoiceBadge from '@ui/PaolaVoiceBadge.vue'
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
  <section class="paola-empty" :class="{ 'paola-empty--compact': compact }">
    <PaolaCard>
      <div class="paola-empty__mascot-hole" aria-hidden="true">
        <img class="paola-empty__mascot" :src="mascotSrc" :alt="mascotAlt" />
      </div>
      <p class="paola-empty__kicker">Cámara Incauta</p>
      <component :is="compact ? 'h2' : 'h1'" class="paola-empty__title type-display">{{ title }}</component>
      <p class="paola-empty__copy">{{ copy }}</p>
      <div v-if="!compact" class="paola-voices" aria-label="Voces del parche">
        <PaolaVoiceBadge v-for="id in voices" :key="id" :voice="id" />
      </div>
      <PaolaButton v-if="!hideCta" :href="ctaHref" :target="ctaHref.startsWith('http') ? '_blank' : undefined">
        {{ ctaLabel }}
      </PaolaButton>
    </PaolaCard>
  </section>
</template>
