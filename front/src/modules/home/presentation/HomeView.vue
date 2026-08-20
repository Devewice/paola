<script setup lang="ts">
import type { HomeModule } from '@modules/home/index.ts'
import { computed, nextTick, onMounted, ref } from 'vue'
import { HOME_BOARD_COPY, HOME_PULSE_COPY, HOME_SHORTCUTS } from '@modules/home/constants/copy.ts'
import type { KitHeroPanelSlide } from '@ui/KitHero.vue'
import { parsePublicPost, type PublicPost } from '@app/parsePublicPost.ts'
import { API, APP_PATHS } from '@shared/http/constants.ts'
import { runKitHeroEntrance } from '@shared/motion/runKitHero.ts'
import AgendaItem from '@ui/AgendaItem.vue'
import BrushSplash from '@ui/BrushSplash.vue'
import Button from '@ui/Button.vue'
import EmptyBlock from '@ui/EmptyBlock.vue'
import FeedPost from '@ui/FeedPost.vue'
import Gallery from '@ui/Gallery.vue'
import HomeDash from '@ui/HomeDash.vue'
import Icon from '@ui/Icon.vue'
import KitHero from '@ui/KitHero.vue'
import KitHeroFooter from '@ui/KitHeroFooter.vue'
import KpiStrip from '@ui/KpiStrip.vue'
import MediaPlaceholder from '@ui/MediaPlaceholder.vue'
import MemoriaHero from '@ui/MemoriaHero.vue'
import QuoteBlock from '@ui/QuoteBlock.vue'
import VoiceBadge from '@ui/VoiceBadge.vue'
import VoiceCard from '@ui/VoiceCard.vue'

const HERO_ID = 'inicio-hero'
const TABLERO_ID = 'tablero'

const props = defineProps<{
  module: HomeModule
}>()

const board = computed(() => props.module.getBoard())
const pulse = ref<readonly PublicPost[]>([])
const copy = HOME_BOARD_COPY
const pulseCopy = HOME_PULSE_COPY

const kmValue = computed(() => (board.value.totalKm !== null ? String(board.value.totalKm) : '—'))
const rodadasValue = computed(() =>
  board.value.rodadas.length ? String(board.value.rodadas.length) : board.value.memory ? '1+' : '—',
)
const integrantesValue = computed(() =>
  board.value.integrantesCount !== null ? String(board.value.integrantesCount) : '—',
)
const spotlightRodada = computed(() => board.value.rodadas[0] ?? null)
const kpiItems = computed(() => [
  { value: rodadasValue.value, label: copy.kpiRodadas },
  { value: kmValue.value, label: copy.kpiKm },
  { value: integrantesValue.value, label: copy.kpiIntegrantes },
])
const panelSlides = computed((): readonly KitHeroPanelSlide[] => {
  const cards = board.value.rodadas
  if (cards.length) {
    return cards.map((card) => ({
      id: card.id,
      label: copy.panelLabel,
      mediaLabel: card.mediaLabel,
      mediaSrc: card.mediaSrc,
      blankMedia: !card.mediaSrc,
      title: card.title,
      km: card.km,
      cupo: card.cupo,
      fecha: card.date,
      splash: card.splash,
      ctaLabel: copy.nextCta,
      ctaTo: APP_PATHS.PARCHESE,
    }))
  }
  return [
    {
      id: 'vacio',
      label: copy.panelLabel,
      mediaLabel: copy.panelEmptyMedia,
      blankMedia: true,
      title: board.value.nextEmptyCopy,
      km: '—',
      cupo: '—',
      fecha: '—',
      splash: copy.splashSoon,
      ctaLabel: copy.nextCta,
      ctaTo: APP_PATHS.PARCHESE,
    },
  ]
})

onMounted(async () => {
  try {
    const response = await fetch(API.FEED)
    if (!response.ok) return
    const body = await response.json()
    const posts = Array.isArray(body.posts) ? body.posts : []
    pulse.value = posts
      .map((row: unknown) => parsePublicPost(row))
      .filter((item: PublicPost | null): item is PublicPost => item !== null)
      .slice(0, 3)
  } catch {
    pulse.value = []
  } finally {
    await nextTick()
    runKitHeroEntrance(HERO_ID)
  }
})
</script>

<template>
  <div>
    <KitHero
      :hero-id="HERO_ID"
      variant="portal"
      :tagline="copy.tagline"
      :kicker="copy.kicker"
      :splash-label="copy.splashPhrase"
      :photo-src="board.memory?.photoSrc"
      logo-src="/logo.png"
      :scroll-href="`#${TABLERO_ID}`"
      :scroll-label="copy.scrollLabel"
      :panel-slides="panelSlides"
    >
      <template #voices>
        <VoiceBadge voice="loigca" />
        <VoiceBadge voice="incauta" />
        <VoiceBadge voice="armargura" />
      </template>
      <template #actions>
        <Button variant="brush" :to="APP_PATHS.PARCHESE">{{ copy.nextCta }}</Button>
        <Button variant="ghost" :href="board.join.href" target="_blank">
          {{ board.join.label }}
          <Icon name="whatsapp" size="sm" tone="white" :circle="false" />
        </Button>
        <span class="label-brush">{{ copy.motto }}</span>
      </template>
      <template #footer>
        <KitHeroFooter
          :stamp="copy.stamp"
          :rodadas="rodadasValue"
          :km="kmValue"
          :integrantes="integrantesValue"
        />
      </template>
    </KitHero>

    <main :id="TABLERO_ID" class="wrap home-board">
      <header class="home-board__intro stack">
        <BrushSplash :label="copy.boardKicker" tone="blue" size="sm" style="margin: 0" />
        <h2 class="home-board__title">{{ copy.boardTitle }}</h2>
        <p class="meta home-board__lead">{{ copy.boardLead }}</p>
        <KpiStrip :items="kpiItems" />
      </header>

      <HomeDash>
        <template #next>
          <section class="stack home-board__section">
            <div>
              <h4>{{ copy.nextHeading }}</h4>
              <p class="meta" style="margin: 6px 0 0">{{ copy.nextLead }}</p>
            </div>
            <article v-if="spotlightRodada" class="home-spotlight">
              <div class="home-spotlight__media">
                <img
                  v-if="spotlightRodada.mediaSrc"
                  :src="spotlightRodada.mediaSrc"
                  :alt="spotlightRodada.title"
                  class="home-spotlight__photo"
                />
                <MediaPlaceholder v-else :label="copy.nextPhotoLabel" aspect="21 / 9" />
              </div>
              <div class="home-spotlight__body stack">
                <AgendaItem
                  :date="spotlightRodada.date"
                  :title="spotlightRodada.title"
                  kind="rodada"
                  :point="spotlightRodada.point"
                  when="proxima"
                />
                <div class="home-spotlight__meta row">
                  <span class="home-spotlight__chip"><strong>{{ spotlightRodada.km }}</strong> km</span>
                  <span class="home-spotlight__chip"><strong>{{ spotlightRodada.cupo }}</strong> cupo</span>
                </div>
                <Button variant="primary" size="sm" :to="APP_PATHS.PARCHESE">{{ copy.nextCtaDetail }}</Button>
              </div>
            </article>
            <article v-else-if="board.next" class="home-spotlight home-spotlight--compact">
              <MediaPlaceholder :label="copy.nextPhotoLabel" aspect="21 / 9" />
              <div class="home-spotlight__body stack">
                <AgendaItem
                  :date="board.next.date"
                  :title="board.next.title"
                  :kind="board.next.kind"
                  :point="board.next.point"
                  when="proxima"
                />
                <Button variant="primary" size="sm" :to="APP_PATHS.PARCHESE">{{ copy.nextCtaDetail }}</Button>
              </div>
            </article>
            <EmptyBlock v-else glyph="◎" :copy="board.nextEmptyCopy" />
          </section>
        </template>

        <template #pulse>
          <section class="stack home-board__section">
            <div>
              <h4>{{ pulseCopy.heading }}</h4>
              <p class="meta" style="margin: 6px 0 0">{{ pulseCopy.lead }}</p>
            </div>
            <FeedPost
              v-for="item in pulse"
              :key="item.id"
              :author="item.authorAlias"
              :body="item.body"
              :meta="item.createdAt"
              :photos="item.photos"
              :pinned="item.isPinned"
              :highlighted="item.isHighlighted"
            />
            <EmptyBlock v-if="!pulse.length" glyph="◎" :copy="pulseCopy.empty" />
            <Button variant="ghost" size="sm" :to="APP_PATHS.FEED">{{ pulseCopy.cta }}</Button>
          </section>
        </template>

        <template #aside>
          <section class="home-board__pane stack">
            <h4>{{ copy.memoryHeading }}</h4>
            <template v-if="board.memory">
              <MemoriaHero
                :title="board.memory.title"
                :meta="`${board.memory.date} · ${board.memory.km} km · ${board.memory.credit}`"
                :photo-src="board.memory.photoSrc"
                :photo-label="copy.memoryPhotoLabel"
              />
              <Gallery v-if="board.memory.photos.length" :photos="board.memory.photos" />
              <p class="meta" style="margin: 0">{{ board.memory.closingText }}</p>
            </template>
            <EmptyBlock v-else glyph="◎" :copy="board.memoryEmptyCopy" />
          </section>

          <section class="home-board__pane stack">
            <h4>{{ copy.voiceHeading }}</h4>
            <VoiceCard v-if="board.voice.tip" voice="loigca">
              <strong>{{ board.voice.tip.title }}</strong>
              — {{ board.voice.tip.body }}
            </VoiceCard>
            <EmptyBlock v-else glyph="◎" :copy="board.voice.emptyCopy" />
            <div class="row">
              <Button variant="ghost" size="sm" :to="board.voice.to">{{ copy.voiceCta }}</Button>
              <Button
                v-if="board.voice.tip?.officialHref"
                variant="ghost"
                size="sm"
                :href="board.voice.tip.officialHref"
                target="_blank"
              >
                {{ copy.officialCta }}
              </Button>
            </div>
          </section>

          <section class="home-board__pane stack">
            <h4>{{ copy.paolaHeading }}</h4>
            <QuoteBlock :quote="board.paola.phrase" :cite="copy.paolaCite" />
            <Button variant="ghost" size="sm" :to="board.paola.to">{{ copy.paolaCta }}</Button>
          </section>

          <section class="home-board__pane stack">
            <h4>{{ copy.shortcutsHeading }}</h4>
            <p class="meta" style="margin: 0">{{ copy.shortcutsLead }}</p>
            <nav class="home-board__shortcuts" aria-label="Entradas del portal">
              <Button
                v-for="item in HOME_SHORTCUTS"
                :key="item.id"
                variant="ghost"
                size="sm"
                :to="item.to"
              >
                {{ item.label }}
              </Button>
            </nav>
          </section>
        </template>
      </HomeDash>
    </main>
  </div>
</template>
