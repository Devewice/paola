<script setup lang="ts">
import type { HomeModule } from '@modules/home/index.ts'
import { computed, onMounted, ref } from 'vue'
import { HOME_PULSE_COPY } from '@modules/home/constants/copy.ts'
import { parsePublicPost, type PublicPost } from '@app/parsePublicPost.ts'
import { API, APP_PATHS } from '@shared/http/constants.ts'
import { usePageReveal } from '@shared/motion/usePageReveal.ts'
import AficheHero from '@ui/AficheHero.vue'
import AgendaItem from '@ui/AgendaItem.vue'
import Alert from '@ui/Alert.vue'
import Button from '@ui/Button.vue'
import Card from '@ui/Card.vue'
import Empty from '@ui/Empty.vue'
import FeedPost from '@ui/FeedPost.vue'
import Gallery from '@ui/Gallery.vue'
import Icon from '@ui/Icon.vue'
import MemoriaHero from '@ui/MemoriaHero.vue'
import StatGrid from '@ui/StatGrid.vue'
import VoiceBadge from '@ui/VoiceBadge.vue'

const props = defineProps<{
  module: HomeModule
}>()

const board = computed(() => props.module.getBoard())
const bindReveal = usePageReveal()
const photoCount = computed(() => board.value.memory?.photos.length ?? 0)
const pulse = ref<readonly PublicPost[]>([])
const pulseCopy = HOME_PULSE_COPY

onMounted(async () => {
  try {
    const response = await fetch(API.FEED)
    if (!response.ok) return
    const body = await response.json()
    const posts = Array.isArray(body.posts) ? body.posts : []
    pulse.value = posts
      .map((row: unknown) => parsePublicPost(row))
      .filter((item: PublicPost | null): item is PublicPost => item !== null)
      .slice(0, 5)
  } catch {
    pulse.value = []
  }
})
</script>

<template>
  <article :ref="bindReveal" class="paola-page">
    <AficheHero
      kicker="El corte del día"
      title="Paola Biker"
      plate="Rodando"
      logo
      :photo-src="board.memory?.photoSrc"
      data-reveal
    >
      <template #lead>Qué hay hoy: próxima rodada, kilómetros y un recorte de Paola.</template>
      <template #actions>
        <Button v-if="board.next" variant="hero" to="/parchese">Ver próxima salida</Button>
        <Button v-else variant="hero" :href="board.join.href" target="_blank">
          {{ board.join.label }}
        </Button>
        <Button v-if="board.next" variant="ghost" :href="board.join.href" target="_blank">
          {{ board.join.label }}
        </Button>
        <Button v-else variant="ghost" to="/parchese">Parchese</Button>
        <Button variant="ghost" to="/feed">Feed</Button>
      </template>
    </AficheHero>

    <div class="paola-page__split" data-reveal>
      <Card class="home-page__visual" aria-hidden="true">
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
        <p v-else class="paola-afiche__lead">Todavía no hay foto de una rodada publicada.</p>
      </Card>

      <section class="paola-page__block" aria-label="Próxima salida">
        <VoiceBadge voice="loigca" />
        <h2 class="paola-page__heading type-display">Próxima</h2>
        <div v-if="board.next" class="paola-ride paola-ride--featured home-page__next">
          <AgendaItem
            :date="board.next.date"
            :title="board.next.title"
            :kind="board.next.kind"
            :point="board.next.point"
            when="proxima"
          />
        </div>
        <Empty
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
      <VoiceBadge voice="incauta" />
      <h2 class="paola-page__heading type-display">Memoria</h2>
      <MemoriaHero
        v-if="board.memory"
        :title="board.memory.title"
        :meta="`${board.memory.date} · ${board.memory.km} km · ${board.memory.credit}`"
      />
      <Gallery :photos="board.memory?.photos" />
      <StatGrid
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
        <VoiceBadge voice="loigca" />
        <h2 class="paola-page__heading type-display">Tu voz</h2>
        <Alert tone="info">
          <template v-if="board.voice.tip">
            <strong>{{ board.voice.tip.title }}</strong>
            — {{ board.voice.tip.body }}
            <a
              v-if="board.voice.tip.officialHref"
              class="home-page__official"
              :href="board.voice.tip.officialHref"
              target="_blank"
              rel="noopener noreferrer"
            >
              Norma oficial
            </a>
          </template>
          <template v-else>{{ board.voice.emptyCopy }}</template>
        </Alert>
        <Button variant="ghost" size="sm" :to="board.voice.to">Tu voz</Button>
      </section>

      <section class="paola-page__block" aria-label="Paola">
        <VoiceBadge voice="armargura" />
        <Card>
          <div class="home-page__paola-row">
            <Icon name="heart" tone="white" />
            <h2 class="paola-page__heading type-display">Paola</h2>
          </div>
          <p class="paola-page__copy">{{ board.paola.phrase }}</p>
          <Button variant="ghost" size="sm" :to="board.paola.to">Conocer a Paola</Button>
        </Card>
      </section>
    </div>

    <section class="paola-page__block" aria-label="Pulso" data-reveal>
      <VoiceBadge voice="incauta" />
      <h2 class="paola-page__heading type-display">{{ pulseCopy.heading }}</h2>
      <p class="paola-page__copy paola-page__copy--muted">{{ pulseCopy.lead }}</p>
      <div v-if="pulse.length" class="home-page__pulse">
        <FeedPost
          v-for="item in pulse"
          :key="item.id"
          :author="item.authorAlias"
          :body="item.body"
          :meta="item.createdAt"
        />
      </div>
      <p v-else class="paola-page__copy paola-page__copy--muted">{{ pulseCopy.empty }}</p>
      <Button variant="ghost" size="sm" :to="APP_PATHS.FEED">{{ pulseCopy.cta }}</Button>
    </section>
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

.home-page__official {
  display: inline-block;
  margin-top: 8px;
  color: var(--paola-cian);
  text-decoration: underline;
}

.home-page__pulse {
  display: grid;
  gap: 12px;
}
</style>
