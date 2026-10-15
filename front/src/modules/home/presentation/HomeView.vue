<script setup lang="ts">
import type { HomeModule } from '@modules/home/index.ts'
import { computed, nextTick, onMounted, ref } from 'vue'
import {
  HOME_BOARD_COPY,
  HOME_LOGO_SRC,
  HOME_PAOLA_PHOTO,
  HOME_PULSE_COPY,
} from '@modules/home/constants/copy.ts'
import type { KitHeroPanelSlide } from '@ui/KitHero.vue'
import { parsePublicPost, type PublicPost } from '@app/parsePublicPost.ts'
import { API, APP_PATHS } from '@shared/http/constants.ts'
import { runKitHeroEntrance } from '@shared/motion/runKitHero.ts'
import { usePageReveal } from '@shared/motion/usePageReveal.ts'
import BrushSplash from '@ui/BrushSplash.vue'
import Button from '@ui/Button.vue'
import FeedPost from '@ui/FeedPost.vue'
import Icon from '@ui/Icon.vue'
import KitHero from '@ui/KitHero.vue'
import KitHeroFooter from '@ui/KitHeroFooter.vue'
import VoiceBadge from '@ui/VoiceBadge.vue'

const HERO_ID = 'inicio-hero'
const TABLERO_ID = 'tablero'

const props = defineProps<{
  module: HomeModule
}>()

const board = computed(() => props.module.getBoard())
const pulse = ref<readonly PublicPost[]>([])
const copy = HOME_BOARD_COPY
const pulseCopy = HOME_PULSE_COPY
const bindReveal = usePageReveal()

const kmValue = computed(() => (board.value.totalKm !== null ? String(board.value.totalKm) : '—'))
const rodadasValue = computed(() =>
  board.value.rodadas.length ? String(board.value.rodadas.length) : board.value.memory ? '1+' : '—',
)
const integrantesValue = computed(() =>
  board.value.integrantesCount !== null ? String(board.value.integrantesCount) : '—',
)
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
      title: copy.panelEmptyTitle,
      km: '—',
      cupo: '—',
      fecha: '—',
      splash: copy.splashSoon,
      ctaLabel: copy.nextCta,
      ctaTo: APP_PATHS.PARCHESE,
    },
  ]
})

function dateParts(iso: string) {
  const date = new Date(`${iso}T12:00:00`)
  if (Number.isNaN(date.getTime())) return { day: '—', month: '', long: iso }
  return {
    day: date.toLocaleDateString('es-CO', { day: '2-digit' }),
    month: date.toLocaleDateString('es-CO', { month: 'short' }).replace('.', ''),
    long: date.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' }),
  }
}

const next = computed(() => board.value.next)
const nextDate = computed(() => (next.value ? dateParts(next.value.date) : null))
const lastDate = computed(() => (board.value.last ? dateParts(board.value.last.date).long : ''))
const nextPhoto = computed(() => next.value?.photoSrc ?? null)

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

    <main :id="TABLERO_ID" :ref="bindReveal" class="wrap home-board">
      <section class="home-next" :class="{ 'home-next--empty': !next }" data-reveal>
        <div class="home-next__media" :class="{ 'home-next__media--logo': !nextPhoto }">
          <img v-if="nextPhoto" :src="nextPhoto" alt="" class="home-next__photo" />
          <img v-else :src="HOME_LOGO_SRC" alt="" class="home-next__logo" />
          <BrushSplash :label="copy.nextKicker" tone="blue" size="sm" class="home-next__splash" />
          <p v-if="nextDate" class="home-next__stamp" aria-hidden="true">
            <strong>{{ nextDate.day }}</strong>
            <span>{{ nextDate.month }}</span>
          </p>
        </div>

        <div v-if="next && nextDate" class="home-next__body">
          <h2 class="home-next__title">{{ next.title }}</h2>
          <p class="home-next__when">{{ nextDate.long }} · {{ next.point }}</p>
          <p v-if="next.route" class="home-next__route">{{ next.route }}</p>
          <p class="home-next__spots">
            <template v-if="next.spotsLeft !== null">
              <strong>{{ next.spotsLeft }}</strong>
              {{ copy.nextSpotsLabel }} · {{ next.capacity }}
            </template>
            <template v-else>{{ copy.nextNoCapacity }}</template>
          </p>
          <div class="home-next__actions">
            <Button variant="primary" :to="APP_PATHS.PARCHESE">{{ copy.nextCtaDetail }}</Button>
          </div>
        </div>

        <div v-else class="home-next__body">
          <h2 class="home-next__title">{{ copy.nextEmptyTitle }}</h2>
          <p class="home-next__route">{{ copy.nextEmptyLead }}</p>
          <p v-if="board.last" class="home-next__when">
            {{ copy.nextLastPrefix }} <strong>{{ board.last.title }}</strong> · {{ lastDate }}
          </p>
          <div class="home-next__actions">
            <Button variant="primary" :href="board.join.href" target="_blank">
              {{ board.join.label }}
              <Icon name="whatsapp" size="sm" tone="white" :circle="false" />
            </Button>
            <Button variant="ghost" :to="APP_PATHS.PARCHESE">{{ copy.nextAgendaCta }}</Button>
          </div>
        </div>
      </section>

      <section class="home-voices" data-reveal>
        <header class="home-board__head">
          <p class="home-board__kicker">{{ copy.voicesKicker }}</p>
          <h2>{{ copy.voicesTitle }}</h2>
          <p>{{ copy.voicesLead }}</p>
        </header>

        <div class="home-voices__grid">
          <article class="home-voice home-voice--loigca">
            <VoiceBadge voice="loigca" />
            <h3>{{ board.voice.tip?.title ?? copy.loigcaTitle }}</h3>
            <p class="home-voice__text">{{ board.voice.tip?.body ?? copy.loigcaEmpty }}</p>
            <div class="home-voice__actions">
              <Button variant="ghost" size="sm" :to="board.voice.to">{{ copy.loigcaCta }}</Button>
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
          </article>

          <article class="home-voice home-voice--incauta">
            <img
              v-if="board.memory?.photoSrc"
              :src="board.memory.photoSrc"
              :alt="board.memory.title"
              class="home-voice__photo"
            />
            <VoiceBadge voice="incauta" />
            <h3>{{ board.memory?.title ?? copy.incautaTitle }}</h3>
            <p v-if="board.memory" class="home-voice__meta">
              {{ board.memory.date }} · {{ board.memory.km }} {{ copy.kmUnit }} · {{ board.memory.credit }}
            </p>
            <p class="home-voice__text">{{ board.memory?.closingText ?? copy.incautaEmpty }}</p>
            <div class="home-voice__actions">
              <Button variant="ghost" size="sm" :to="`${APP_PATHS.PARCHESE}#memorias`">
                {{ copy.incautaCta }}
              </Button>
            </div>
          </article>

          <article class="home-voice home-voice--armargura">
            <img :src="HOME_PAOLA_PHOTO" alt="" class="home-voice__backdrop" />
            <VoiceBadge voice="armargura" />
            <h3>{{ copy.armarguraTitle }}</h3>
            <blockquote class="home-voice__quote">
              {{ board.paola.phrase }}
              <cite>{{ copy.paolaCite }}</cite>
            </blockquote>
            <div class="home-voice__actions">
              <Button variant="ghost" size="sm" :to="board.paola.to">{{ copy.paolaCta }}</Button>
            </div>
          </article>
        </div>
      </section>

      <section class="home-pulse" data-reveal>
        <header class="home-pulse__head">
          <div class="home-board__head">
            <p class="home-board__kicker">{{ pulseCopy.kicker }}</p>
            <h2>{{ pulseCopy.heading }}</h2>
            <p>{{ pulseCopy.lead }}</p>
          </div>
          <Button variant="ghost" size="sm" :to="APP_PATHS.FEED">{{ pulseCopy.cta }}</Button>
        </header>

        <div v-if="pulse.length" class="home-pulse__grid">
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
        </div>
        <div v-else class="home-pulse__empty">
          <strong>{{ pulseCopy.emptyTitle }}</strong>
          <p>{{ pulseCopy.empty }}</p>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.home-board {
  display: grid;
  gap: 56px;
  padding-block: 40px 72px;
}

.home-board__head {
  display: grid;
  gap: 6px;
}

.home-board__kicker {
  margin: 0;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--paola-cyan, #48b4fc);
}

.home-board__head h2 {
  margin: 0;
  font-family: var(--display, Oswald, sans-serif);
  font-size: clamp(24px, 3.4vw, 34px);
  line-height: 1.05;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

.home-board__head > p:last-child {
  margin: 0;
  max-width: 54ch;
  color: var(--paola-muted, #9aa3b2);
  font-size: 14px;
  line-height: 1.5;
}

/* Próxima salida: franja tipo afiche */
.home-next {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
  min-height: 340px;
  border-radius: 16px;
  overflow: hidden;
  background: linear-gradient(135deg, #001028 0%, #05070c 100%);
  border: 1px solid rgba(72, 180, 252, 0.18);
  scroll-margin-top: 96px;
}

.home-next__media {
  position: relative;
  min-height: 240px;
  overflow: hidden;
}

.home-next__photo {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.home-next__media::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(5, 7, 12, 0) 55%, rgba(0, 16, 40, 0.95) 100%),
    linear-gradient(0deg, rgba(5, 7, 12, 0.55) 0%, rgba(5, 7, 12, 0) 45%);
}

.home-next__media--logo {
  display: grid;
  place-items: center;
  background:
    radial-gradient(circle at 50% 50%, rgba(72, 180, 252, 0.28) 0%, rgba(0, 136, 248, 0.08) 38%, transparent 65%),
    #001028;
}

.home-next__logo {
  position: relative;
  width: min(52%, 220px);
  height: auto;
  filter: drop-shadow(0 0 28px rgba(72, 180, 252, 0.45));
}

.home-next--empty .home-next__logo {
  opacity: 0.85;
}

.home-next__splash {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 1;
  margin: 0;
}

.home-next__stamp {
  position: absolute;
  left: 20px;
  bottom: 20px;
  z-index: 1;
  display: grid;
  justify-items: center;
  margin: 0;
  padding: 10px 14px;
  border-radius: 10px;
  background: #0088f8;
  box-shadow: 0 0 24px rgba(72, 180, 252, 0.35);
  font-family: var(--display, Oswald, sans-serif);
  text-transform: uppercase;
  line-height: 1;
}

.home-next__stamp strong {
  font-size: 34px;
}

.home-next__stamp span {
  font-size: 13px;
  letter-spacing: 0.12em;
}

.home-next__body {
  display: grid;
  align-content: center;
  gap: 12px;
  padding: clamp(24px, 4vw, 40px);
  min-width: 0;
}

.home-next__title {
  margin: 0;
  font-family: var(--display, Oswald, sans-serif);
  font-size: clamp(28px, 4vw, 42px);
  line-height: 1;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.home-next__when {
  margin: 0;
  color: var(--paola-cyan, #48b4fc);
  font-size: 14px;
  font-weight: 600;
}

.home-next__when::first-letter {
  text-transform: uppercase;
}

.home-next__route {
  margin: 0;
  max-width: 46ch;
  color: var(--paola-muted, #9aa3b2);
  font-size: 15px;
  line-height: 1.55;
}

.home-next__spots {
  margin: 4px 0 0;
  color: var(--paola-muted, #9aa3b2);
  font-size: 13px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.home-next__spots strong {
  margin-right: 6px;
  font-family: var(--display, Oswald, sans-serif);
  font-size: 32px;
  color: #fff;
}

.home-next__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 8px;
}

/* Tres voces */
.home-voices {
  display: grid;
  gap: 24px;
}

.home-voices__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

.home-voice {
  --voice-accent: var(--paola-cyan, #48b4fc);
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  padding: 24px;
  border-radius: 14px;
  overflow: hidden;
  background: rgba(0, 16, 40, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-top: 3px solid var(--voice-accent);
  min-width: 0;
}

.home-voice--incauta {
  --voice-accent: var(--paola-incauta, #f2c14e);
}

.home-voice--armargura {
  --voice-accent: var(--paola-armargura, #e0566b);
}

.home-voice > * {
  position: relative;
  z-index: 1;
}

.home-voice h3 {
  margin: 0;
  font-family: var(--display, Oswald, sans-serif);
  font-size: 22px;
  line-height: 1.1;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.home-voice__text {
  margin: 0;
  color: var(--paola-muted, #9aa3b2);
  font-size: 14px;
  line-height: 1.55;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.home-voice__meta {
  margin: 0;
  font-size: 12px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--voice-accent);
}

.home-voice__photo {
  width: calc(100% + 48px);
  max-width: none;
  margin: -24px -24px 4px;
  aspect-ratio: 16 / 9;
  object-fit: cover;
}

.home-voice__backdrop {
  position: absolute;
  inset: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 30%;
  opacity: 0.22;
  filter: grayscale(0.4);
}

.home-voice--armargura::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  background: linear-gradient(180deg, rgba(5, 7, 12, 0.35) 0%, rgba(5, 7, 12, 0.92) 70%);
}

.home-voice__quote {
  margin: 0;
  font-size: 17px;
  font-style: italic;
  line-height: 1.5;
}

.home-voice__quote cite {
  display: block;
  margin-top: 8px;
  font-size: 12px;
  font-style: normal;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--voice-accent);
}

.home-voice__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: auto;
  padding-top: 4px;
}

/* El parche en vivo */
.home-pulse {
  display: grid;
  gap: 24px;
}

.home-pulse__head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
}

.home-pulse__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 18rem), 1fr));
  gap: 20px;
  align-items: start;
}

.home-pulse__empty {
  display: grid;
  gap: 4px;
  padding: 20px 24px;
  border-radius: 14px;
  border-left: 3px solid var(--paola-cyan, #48b4fc);
  background: rgba(0, 16, 40, 0.35);
}

.home-pulse__empty strong {
  font-family: var(--display, Oswald, sans-serif);
  font-size: 18px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.home-pulse__empty p {
  margin: 0;
  color: var(--paola-muted, #9aa3b2);
  font-size: 14px;
}

@media (max-width: 959px) {
  .home-board {
    gap: 40px;
    padding-block: 28px 56px;
  }

  .home-voices__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .home-voice--armargura {
    grid-column: 1 / -1;
  }
}

@media (max-width: 760px) {
  .home-next {
    grid-template-columns: 1fr;
  }

  .home-next__media {
    min-height: 220px;
  }

  .home-next__media--logo {
    padding-top: 40px;
  }

  .home-next__media::after {
    background: linear-gradient(0deg, rgba(0, 16, 40, 0.95) 0%, rgba(5, 7, 12, 0) 60%);
  }
}

@media (max-width: 639px) {
  .home-voices__grid {
    grid-template-columns: 1fr;
  }

  .home-next__actions :deep(.btn),
  .home-next__actions > * {
    width: 100%;
  }
}
</style>
