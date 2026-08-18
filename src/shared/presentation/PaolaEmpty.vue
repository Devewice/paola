<script setup lang="ts">
import PaolaButton from '@shared/presentation/PaolaButton.vue'
import PaolaCard from '@shared/presentation/PaolaCard.vue'
import { VOICE_TONES } from '@shared/theme/voices.ts'

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
    mascotAlt: 'Cámara Incauta, mascota 360 del parche',
  },
)
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
          <span
            v-for="(voice, id) in VOICE_TONES"
            :key="id"
            class="voice-badge"
            :class="`voice-badge--${id}`"
          >
            <strong>{{ voice.name }}</strong>
            {{ voice.phrase }}
          </span>
        </div>
        <PaolaButton href="mailto:contacto@paolabiker.com">Escribirle a Paola</PaolaButton>
    </PaolaCard>
  </section>
</template>
