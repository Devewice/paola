<script setup lang="ts">
import type { RidesModule } from '@modules/rides/index.ts'
import PaolaEmpty from '@ui/PaolaEmpty.vue'
import PaolaGallery from '@ui/PaolaGallery.vue'
import PaolaMemoriaHero from '@ui/PaolaMemoriaHero.vue'
import PaolaStatGrid from '@ui/PaolaStatGrid.vue'
import PaolaVoiceBadge from '@ui/PaolaVoiceBadge.vue'

const props = defineProps<{
  module: RidesModule
}>()

const memories = props.module.getMemories()
const latest = memories.items[0] ?? null
const photoCount = memories.items.reduce((sum, item) => sum + item.photos.length, 0)
</script>

<template>
  <section class="parchese-page__memorias" aria-label="Memorias">
    <PaolaVoiceBadge voice="incauta" />
    <h2 class="paola-page__heading type-display">Memorias</h2>

    <template v-if="latest">
      <PaolaMemoriaHero
        :title="latest.title"
        :meta="`${latest.date} · ${latest.km} km · ${latest.credit}`"
      />
      <PaolaGallery :photos="latest.photos" />
      <PaolaStatGrid
        :items="[
          { value: String(memories.totalKm), label: 'Km del parche' },
          { value: String(photoCount), label: 'Fotos' },
          { value: String(memories.items.length), label: 'Rodadas' },
        ]"
      />
      <p class="paola-page__copy">{{ latest.participantsText }}</p>
      <p class="paola-page__copy paola-page__copy--muted">{{ latest.closingText }}</p>
      <p v-if="latest.instagramHref" class="paola-page__copy paola-page__copy--muted">
        <a :href="latest.instagramHref" target="_blank" rel="noopener noreferrer">Instagram de la salida</a>
      </p>
    </template>

    <PaolaEmpty
      v-else
      compact
      hide-cta
      title="Sin recuento aún"
      :copy="memories.emptyCopy"
      mascot-src="/mascota/tumbada.png"
    />
  </section>
</template>

<style scoped>
.parchese-page__memorias {
  display: grid;
  gap: 12px;
}
</style>
