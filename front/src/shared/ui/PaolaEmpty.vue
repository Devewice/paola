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
  }>(),
  {
    copy: 'Próximamente. Esta pestaña todavía no tiene contenido.',
    mascotSrc: '/mascota/en-pie.png',
    mascotAlt: 'Insta360, mascota Cámara Incauta del parche',
  },
)

const voices = Object.keys(VOICE_TONES) as VoiceId[]
</script>

<template>
  <section class="paola-empty">
    <PaolaCard>
      <div class="paola-empty__mascot-hole" aria-hidden="true">
        <img class="paola-empty__mascot" :src="mascotSrc" :alt="mascotAlt" />
      </div>
      <p class="paola-empty__kicker">Cámara Incauta</p>
      <h1 class="paola-empty__title type-display">{{ title }}</h1>
      <p class="paola-empty__copy">{{ copy }}</p>
      <div class="paola-voices" aria-label="Voces del parche">
        <PaolaVoiceBadge v-for="id in voices" :key="id" :voice="id" />
      </div>
      <PaolaButton href="mailto:contacto@paolabiker.com">Escribirle a Paola</PaolaButton>
    </PaolaCard>
  </section>
</template>
