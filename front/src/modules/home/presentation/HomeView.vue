<script setup lang="ts">
import type { HomeModule } from '@modules/home/index.ts'
import { usePageReveal } from '@shared/motion/usePageReveal.ts'
import PaolaAficheHero from '@ui/PaolaAficheHero.vue'
import PaolaAgendaItem from '@ui/PaolaAgendaItem.vue'
import PaolaAlert from '@ui/PaolaAlert.vue'
import PaolaButton from '@ui/PaolaButton.vue'
import PaolaCard from '@ui/PaolaCard.vue'
import PaolaEmpty from '@ui/PaolaEmpty.vue'
import PaolaGallery from '@ui/PaolaGallery.vue'
import PaolaIcon from '@ui/PaolaIcon.vue'
import PaolaMemoriaHero from '@ui/PaolaMemoriaHero.vue'
import PaolaStatGrid from '@ui/PaolaStatGrid.vue'
import PaolaVoiceBadge from '@ui/PaolaVoiceBadge.vue'

const props = defineProps<{
  module: HomeModule
}>()

const board = props.module.getBoard()
const bindReveal = usePageReveal()
const photoCount = board.memory?.photos.length ?? 0
</script>

<template>
  <article :ref="bindReveal" class="paola-page">
    <PaolaAficheHero kicker="El corte del día" title="Paola Biker" plate="Rodando" logo data-reveal>
      <template #lead>Un tablero del parche, no un welcome genérico.</template>
      <template #actions>
        <PaolaButton v-if="board.next" variant="hero" to="/parchese">Ver próxima salida</PaolaButton>
        <PaolaButton v-else variant="hero" :href="board.join.href" target="_blank">
          {{ board.join.label }}
        </PaolaButton>
        <PaolaButton v-if="board.next" variant="ghost" :href="board.join.href" target="_blank">
          {{ board.join.label }}
        </PaolaButton>
        <PaolaButton v-else variant="ghost" to="/parchese">Parchese</PaolaButton>
      </template>
    </PaolaAficheHero>

    <div class="paola-page__split" data-reveal>
      <PaolaCard class="home-page__visual" aria-hidden="true">
        <div class="paola-empty__mascot-hole">
          <img
            v-if="board.memory?.photoSrc"
            class="home-page__memory-photo"
            :src="board.memory.photoSrc"
            alt=""
          />
          <img v-else class="paola-empty__mascot" src="/mascota/en-pie.png" alt="" />
        </div>
        <p class="paola-empty__kicker">Cámara Incauta</p>
        <p v-if="board.memory" class="paola-afiche__lead">
          {{ board.memory.title }} · {{ board.memory.date }}
        </p>
        <p v-else class="paola-afiche__lead">Foto de rodada cuando haya memoria. Hoy el hueco queda.</p>
      </PaolaCard>

      <section class="paola-page__block" aria-label="Próxima salida">
        <PaolaVoiceBadge voice="loigca" />
        <h2 class="paola-page__heading type-display">Próxima</h2>
        <div v-if="board.next" class="paola-ride paola-ride--featured home-page__next">
          <PaolaAgendaItem
            :date="board.next.date"
            :title="board.next.title"
            :kind="board.next.kind"
            :point="board.next.point"
            when="proxima"
          />
        </div>
        <PaolaEmpty
          v-else
          compact
          hide-cta
          title="Sin fecha"
          :copy="board.nextEmptyCopy"
          mascot-src="/mascota/tumbada.png"
        />
      </section>
    </div>

    <section class="paola-page__block" aria-label="Kilómetros" data-reveal>
      <PaolaVoiceBadge voice="incauta" />
      <h2 class="paola-page__heading type-display">Memoria</h2>
      <PaolaMemoriaHero
        v-if="board.memory"
        :title="board.memory.title"
        :meta="`${board.memory.date} · ${board.memory.km} km · ${board.memory.credit}`"
      />
      <PaolaGallery :photos="board.memory?.photos" />
      <PaolaStatGrid
        :items="[
          { value: board.totalKm !== null ? String(board.totalKm) : '—', label: 'Km del parche' },
          { value: board.memory ? String(photoCount) : '—', label: 'Fotos' },
          { value: board.memory ? '1+' : '—', label: 'Rodadas' },
        ]"
      />
      <p v-if="board.memory" class="paola-page__copy paola-page__copy--muted">{{ board.memory.closingText }}</p>
      <p v-else class="paola-page__copy paola-page__copy--muted">{{ board.memoryEmptyCopy }}</p>
    </section>

    <div class="paola-page__split" data-reveal>
      <section class="paola-page__block" aria-label="Tu voz">
        <PaolaVoiceBadge voice="loigca" />
        <h2 class="paola-page__heading type-display">Tu voz</h2>
        <PaolaAlert tone="info">{{ board.voice.copy }}</PaolaAlert>
        <PaolaButton variant="ghost" size="sm" :to="board.voice.to">Tu voz</PaolaButton>
      </section>

      <section class="paola-page__block" aria-label="Paola">
        <PaolaVoiceBadge voice="armargura" />
        <PaolaCard>
          <div class="home-page__paola-row">
            <PaolaIcon name="heart" tone="white" />
            <h2 class="paola-page__heading type-display">Paola</h2>
          </div>
          <p class="paola-page__copy">{{ board.paola.phrase }}</p>
          <PaolaButton variant="ghost" size="sm" :to="board.paola.to">Conocer a Paola</PaolaButton>
        </PaolaCard>
      </section>
    </div>
  </article>
</template>

<style scoped>
.home-page__visual {
  text-align: center;
}

.home-page__memory-photo {
  width: 100%;
  max-height: 220px;
  object-fit: cover;
  border-radius: 10px;
}

.home-page__next {
  padding: 12px;
}

.home-page__next :deep(.paola-agenda) {
  background: transparent;
  border: 0;
  padding: 0;
}

.home-page__paola-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}
</style>
