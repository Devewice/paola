<script setup lang="ts">
import type { HomeModule } from '@modules/home/index.ts'
import PaolaAgendaItem from '@ui/PaolaAgendaItem.vue'
import PaolaButton from '@ui/PaolaButton.vue'
import PaolaStatGrid from '@ui/PaolaStatGrid.vue'
import PaolaVoiceBadge from '@ui/PaolaVoiceBadge.vue'

const props = defineProps<{
  module: HomeModule
}>()

const board = props.module.getBoard()
</script>

<template>
  <article class="home-page">
    <header class="home-page__hero">
      <img
        class="home-page__logo"
        src="/logo.png"
        alt="Paola — Rodando con propósito"
        width="140"
        height="140"
      />
      <p class="paola-empty__kicker">El corte del día</p>
      <h1 class="home-page__title type-display">Paola Biker</h1>
    </header>

    <section class="home-page__block" aria-label="Próxima salida">
      <PaolaVoiceBadge voice="loigca" />
      <h2 class="home-page__heading type-display">Próxima</h2>
      <PaolaAgendaItem
        v-if="board.next"
        :date="board.next.date"
        :title="board.next.title"
        :kind="board.next.kind"
        :point="board.next.point"
        when="proxima"
      />
      <p v-else class="home-page__copy">{{ board.nextEmptyCopy }}</p>
      <div class="home-page__actions">
        <PaolaButton
          v-if="board.next"
          variant="hero"
          to="/parchese"
        >
          Ver próxima salida
        </PaolaButton>
        <PaolaButton
          v-else
          variant="hero"
          :href="board.join.href"
          target="_blank"
        >
          {{ board.join.label }}
        </PaolaButton>
        <PaolaButton v-if="board.next" variant="ghost" :href="board.join.href" target="_blank">
          {{ board.join.label }}
        </PaolaButton>
        <PaolaButton v-else variant="ghost" to="/parchese">Parchese</PaolaButton>
      </div>
    </section>

    <section class="home-page__block" aria-label="Kilómetros">
      <PaolaVoiceBadge voice="incauta" />
      <h2 class="home-page__heading type-display">Memoria</h2>
      <PaolaStatGrid :items="[{ value: '—', label: 'Km' }]" />
      <p class="home-page__copy home-page__copy--muted">{{ board.kmCopy }}</p>
    </section>

    <section class="home-page__block" aria-label="Tu voz">
      <PaolaVoiceBadge voice="loigca" />
      <h2 class="home-page__heading type-display">Tu voz</h2>
      <p class="home-page__copy">{{ board.voice.copy }}</p>
      <PaolaButton variant="ghost" size="sm" :to="board.voice.to">Tu voz</PaolaButton>
    </section>

    <section class="home-page__block" aria-label="Paola">
      <PaolaVoiceBadge voice="armargura" />
      <h2 class="home-page__heading type-display">Paola</h2>
      <p class="home-page__copy">{{ board.paola.phrase }}</p>
      <PaolaButton variant="ghost" size="sm" :to="board.paola.to">Conocer a Paola</PaolaButton>
    </section>
  </article>
</template>

<style scoped>
.home-page {
  max-width: 40rem;
  margin: 0 auto;
  padding: calc(var(--paola-space) * 4) calc(var(--paola-space) * 2)
    calc(var(--paola-space) * 8);
  display: grid;
  gap: calc(var(--paola-space) * 5);
}

.home-page__hero {
  text-align: center;
}

.home-page__logo {
  display: block;
  width: 140px;
  height: 140px;
  margin: 0 auto calc(var(--paola-space) * 3);
  object-fit: contain;
}

.home-page__title {
  margin: 0;
  font-size: 40px;
}

.home-page__block {
  display: grid;
  gap: 12px;
}

.home-page__heading {
  margin: 0;
  font-size: 22px;
}

.home-page__copy {
  margin: 0;
  font-size: 16px;
  line-height: 1.6;
  color: var(--paola-white);
}

.home-page__copy--muted {
  color: var(--paola-muted);
  font-size: 14px;
}

.home-page__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.home-page__block :deep(.paola-stat-grid) {
  grid-template-columns: minmax(0, 140px);
}
</style>
