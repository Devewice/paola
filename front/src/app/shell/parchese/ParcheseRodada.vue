<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getAppDependencies, refreshInventory } from '@app/bootstrap.ts'
import { PARCHESE_FIGURES } from '@app/constants/parchese.ts'
import { useAdminEdit } from '@app/shell/adminMode.ts'
import { useParchese } from '@app/shell/parchese/context.ts'
import PollCard from '@modules/polls/presentation/PollCard.vue'
import {
  RIDES_CARD_COPY,
  RIDES_KIND_LABEL,
  RIDES_PAGE_COPY,
  daysUntil,
  remainingSpots,
  type ClaimedSpot,
  type Outing,
  type OutingCrew,
} from '@modules/rides/index.ts'
import OutingAdminTools from '@modules/rides/presentation/OutingAdminTools.vue'
import RideSignup from '@modules/rides/presentation/RideSignup.vue'
import { usePageReveal } from '@shared/motion/usePageReveal.ts'
import { APP_PATHS, appEntrarYVolver, appRodada } from '@shared/http/constants.ts'
import { MASCOT } from '@shared/ui/mascot.ts'
import { MAP_COPY } from '@ui/mapCopy.ts'
import AdminSpot from '@ui/AdminSpot.vue'
import BoardHead from '@ui/BoardHead.vue'
import Button from '@ui/Button.vue'
import Chip from '@ui/Chip.vue'
import Empty from '@ui/Empty.vue'
import Icon from '@ui/Icon.vue'
import MapBlock from '@ui/MapBlock.vue'
import StepsPoster from '@ui/StepsPoster.vue'

const copy = RIDES_PAGE_COPY
const cardCopy = RIDES_CARD_COPY
const route = useRoute()
const router = useRouter()
const bindReveal = usePageReveal()
const { deps, pollsFor, onVoted, reloadPolls } = useParchese()
const { claveFor } = useAdminEdit()
const rideClave = computed(() => claveFor('rodadas'))
const today = new Date().toISOString().slice(0, 10)

const outingId = computed(() => String(route.params.id ?? ''))
const fresh = ref<Outing | null>(null)
const outing = computed(() => {
  const stored = deps.value.rides.getOuting(outingId.value)
  return fresh.value?.id === outingId.value ? fresh.value : stored
})
const polls = computed(() => pollsFor(outingId.value))
const crew = ref<OutingCrew | null>(null)
const crewFailed = ref(false)
const enterTo = computed(() => appEntrarYVolver(appRodada(outingId.value)))

const upcoming = computed(() => Boolean(outing.value && outing.value.status !== 'realizado' && outing.value.date >= today))
const memory = computed(
  () => deps.value.rides.getMemories().items.find((item) => item.outingId === outingId.value) ?? null,
)
/** Mosaico de 4 columnas con la primera foto en 2×2: la última estira lo que sobre de su fila. */
const lastSpan = computed(() => {
  const count = memory.value?.photos.length ?? 0
  if (count < 3) return 1
  const leftover = (count + 3) % 4
  return leftover ? 4 - leftover + 1 : 1
})
const countdown = computed(() => {
  const days = outing.value ? daysUntil(outing.value.date, today) : 0
  if (days <= 0) return { value: cardCopy.today, unit: '' }
  if (days === 1) return { value: cardCopy.tomorrow, unit: '' }
  return { value: cardCopy.daysLeft(days), unit: cardCopy.daysUnit }
})
const fill = computed(() => {
  const item = outing.value
  if (!item?.capacity) return 0
  return Math.min(100, Math.round((item.taken / item.capacity) * 100))
})
const spotsText = computed(() => {
  const item = outing.value
  if (!item) return ''
  const free = remainingSpots(item)
  return free ? cardCopy.spotsFree(free, item.capacity) : cardCopy.spotsFull
})
const hasRoute = computed(() => Boolean(outing.value?.route?.start || outing.value?.route?.end))

function longDate(iso: string): string {
  const date = new Date(`${iso}T12:00:00`)
  if (Number.isNaN(date.getTime())) return iso
  return date
    .toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
    .replace(/\./g, '')
}

type Fact = { icon: string; label: string; value: string }

const facts = computed<Fact[]>(() => {
  const item = outing.value
  if (!item) return []
  const list: Fact[] = [
    { icon: 'flag', label: copy.factDate, value: longDate(item.date) },
    { icon: 'pin', label: copy.factPlace, value: item.route?.start?.label ?? item.meetingPoint },
  ]
  if (item.route?.end) list.push({ icon: 'route', label: copy.factEnd, value: item.route.end.label })
  if (item.route?.distanceKm) list.push({ icon: 'bike', label: copy.factDistance, value: MAP_COPY.distance(item.route.distanceKm) })
  if (item.route?.durationMin) list.push({ icon: 'bolt', label: copy.factDuration, value: MAP_COPY.duration(item.route.durationMin) })
  list.push({ icon: 'star', label: copy.factPrice, value: item.paid ? copy.pricePaid : copy.priceFree })
  return list
})

const bring = computed(() =>
  (outing.value?.whatToBring ?? '')
    .split(/,|\s+y\s+/)
    .map((part) => part.trim().replace(/\.$/, ''))
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1)),
)

async function loadCrew(): Promise<void> {
  if (!outing.value) return
  crewFailed.value = false
  const result = await deps.value.rides.loadCrew(outingId.value)
  if (result.ok) crew.value = result.value
  else crewFailed.value = true
}

watch([outingId, () => deps.value.rides], () => {
  crew.value = null
  fresh.value = null
  void loadCrew()
}, { immediate: true })

async function onInscribed(spot: ClaimedSpot): Promise<void> {
  fresh.value = spot.outing
  await Promise.all([loadCrew(), reloadPolls()])
}

async function onSpotChanged(): Promise<void> {
  await refreshInventory()
  fresh.value = getAppDependencies().rides.getOuting(outingId.value)
  await loadCrew()
}

function initial(alias: string): string {
  return alias.trim().charAt(0).toUpperCase() || '·'
}
</script>

<template>
  <div :ref="bindReveal" class="board ride-page">
    <div class="ride-page__top">
      <Button variant="ghost" size="sm" :to="APP_PATHS.PARCHESE_RODADAS">{{ copy.back }}</Button>
      <div v-if="outing" class="ride-page__tags">
        <Chip :tone="outing.status">{{ outing.status }}</Chip>
        <span class="ride-page__kind">{{ RIDES_KIND_LABEL[outing.kind] }}</span>
      </div>
    </div>

    <Empty
      v-if="!outing"
      compact
      hide-cta
      :title="copy.notFoundTitle"
      :copy="copy.notFoundCopy"
      :mascot-src="MASCOT.TUMBADA"
    />

    <template v-else>
      <AdminSpot :active="Boolean(rideClave)" data-reveal>
        <template #tools>
          <OutingAdminTools
            :module="deps.rides"
            :clave="rideClave"
            :outing="outing"
            @changed="onSpotChanged"
            @removed="router.push(APP_PATHS.PARCHESE_RODADAS)"
          />
        </template>
        <dl class="ride-facts" :aria-label="copy.factsAria">
          <div v-for="fact in facts" :key="fact.label" class="ride-fact">
            <dt>
              <Icon :name="fact.icon" size="sm" tone="cyan" :circle="false" />
              {{ fact.label }}
            </dt>
            <dd>{{ fact.value }}</dd>
          </div>
        </dl>
      </AdminSpot>

      <div class="board-split ride-page__split" data-reveal>
        <section class="board-main">
          <div v-if="upcoming" class="poster poster--blue ride-countdown">
            <p class="ride-countdown__days">
              <strong>{{ countdown.value }}</strong>
              <span v-if="countdown.unit">{{ countdown.unit }}</span>
            </p>
            <div class="ride-countdown__spots">
              <div class="ride-countdown__bar" role="presentation">
                <span :style="{ width: `${fill}%` }" />
              </div>
              <span>{{ spotsText }}</span>
            </div>
          </div>
          <MapBlock v-if="hasRoute" meeting-point="" :map-href="outing.mapHref" :route="outing.route" />
          <article class="board-panel ride-plan">
            <template v-if="outing.routeText">
              <h3 class="board-kicker">{{ copy.planTitle }}</h3>
              <p class="ride-plan__text">{{ outing.routeText }}</p>
            </template>
            <template v-if="bring.length">
              <h3 class="board-kicker">{{ copy.bringTitle }}</h3>
              <ul class="ride-bring">
                <li v-for="item in bring" :key="item">
                  <Icon name="check" size="sm" tone="cyan" :circle="false" />
                  {{ item }}
                </li>
              </ul>
            </template>
          </article>

          <section v-if="polls.length || upcoming" class="ride-page__polls-block" :aria-label="copy.pollsTitle">
            <BoardHead voice="loigca" :title="copy.pollsTitle" :lead="copy.pollsLead" />
            <div v-if="polls.length" class="ride-page__polls">
              <PollCard
                v-for="poll in polls"
                :key="poll.id"
                :module="deps.polls"
                :poll="poll"
                :account-to="enterTo"
                @voted="onVoted"
              />
            </div>
            <p v-else class="meta-text">{{ copy.pollsEmpty }}</p>
          </section>
        </section>

        <aside class="board-rail">
          <template v-if="upcoming">
            <section id="inscripcion" class="poster poster--navy ride-page__signup">
              <RideSignup
                :module="deps.rides"
                :outing="outing"
                :crew="crew"
                :failed="crewFailed"
                :enter-to="enterTo"
                :garage-to="APP_PATHS.CUENTA"
                @inscribed="onInscribed"
                @changed="onSpotChanged"
              />
            </section>
            <section v-if="crew?.inscribed" class="poster poster--blue ride-crew" :aria-label="copy.crewTitle">
              <h3 class="type-brush-dry type-brush-dry--xs">{{ copy.crewTitle }}</h3>
              <ul v-if="crew.riders.length" class="ride-crew__list">
                <li v-for="rider in crew.riders" :key="rider.alias" class="ride-crew__rider">
                  <img v-if="rider.avatarSrc" class="ride-crew__avatar" :src="rider.avatarSrc" alt="" />
                  <span v-else class="ride-crew__avatar" aria-hidden="true">{{ initial(rider.alias) }}</span>
                  <span class="ride-crew__who">
                    <strong>{{ rider.alias }}</strong>
                    <span>{{ rider.moto || copy.crewNoMoto }}</span>
                  </span>
                </li>
              </ul>
              <p v-else>{{ copy.crewEmpty }}</p>
              <Button size="sm" variant="ghost" :to="APP_PATHS.CUENTA">{{ copy.crewChat }}</Button>
            </section>
            <StepsPoster
              v-else
              tone="navy"
              :title="copy.crewLockedTitle"
              :steps="copy.crewLockedSteps"
              :mascot-src="PARCHESE_FIGURES.JOIN"
              class="poster--mascot-top"
            />
          </template>

          <section v-else class="poster poster--blue ride-memory">
            <span class="board-kicker">{{ copy.memoryKicker }}</span>
            <template v-if="memory">
              <dl class="hub-stats hub-stats--dl">
                <div class="hub-stat">
                  <dt><span>{{ copy.memoryKm }}</span></dt>
                  <dd><strong>{{ memory.km }}</strong></dd>
                </div>
                <div class="hub-stat">
                  <dt><span>{{ copy.memoryPhotos }}</span></dt>
                  <dd><strong>{{ memory.photos.length }}</strong></dd>
                </div>
              </dl>
              <p v-if="memory.participantsText" class="ride-memory__quote">{{ memory.participantsText }}</p>
              <Button size="sm" variant="ghost" :to="APP_PATHS.PARCHESE_MEMORIAS">{{ copy.memoryCta }}</Button>
            </template>
            <template v-else>
              <h3 class="type-brush-dry type-brush-dry--xs">{{ copy.memoryPendingTitle }}</h3>
              <p>{{ copy.memoryPending }}</p>
            </template>
          </section>
        </aside>
      </div>

      <section v-if="memory?.photos.length" class="ride-gallery-block" data-reveal>
        <BoardHead voice="incauta" :title="copy.galleryTitle" :lead="memory.credit" />
        <div
          class="ride-gallery"
          :class="{ 'ride-gallery--few': memory.photos.length < 3 }"
          :style="{ '--last-span': lastSpan }"
        >
          <a
            v-for="photo in memory.photos"
            :key="photo.id"
            class="ride-gallery__item"
            :href="photo.src"
            target="_blank"
            rel="noopener"
            :aria-label="copy.galleryOpen(photo.alt)"
          >
            <img :src="photo.src" :alt="photo.alt" loading="lazy" />
          </a>
        </div>
        <blockquote v-if="memory.closingText" class="ride-gallery__closing">{{ memory.closingText }}</blockquote>
      </section>
    </template>
  </div>
</template>

<style scoped>
.ride-page {
  gap: 24px;
}

.ride-page__top {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.ride-page__tags {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ride-page__kind {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--paola-muted, #8b9bb0);
}

.ride-facts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 9.5rem), 1fr));
  gap: 1px;
  margin: 0;
  overflow: hidden;
  border: 1px solid rgba(72, 180, 252, 0.22);
  border-radius: 12px;
  background: rgba(72, 180, 252, 0.16);
}

.ride-fact {
  display: grid;
  gap: 6px;
  align-content: start;
  padding: 14px 16px;
  background: linear-gradient(160deg, #001028 0%, #05070c 100%);
}

.ride-fact dt {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--paola-muted, #8b9bb0);
}

.ride-fact dd {
  margin: 0;
  font-family: var(--paola-font-display, Oswald, sans-serif);
  font-size: 18px;
  line-height: 1.2;
  text-transform: uppercase;
  color: #fff;
}

.ride-page__split {
  scroll-margin-top: 96px;
}

.ride-countdown {
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  gap: 16px 32px;
}

.ride-countdown__days {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin: 0;
}

.ride-countdown__days strong {
  font-family: var(--paola-font-display, Oswald, sans-serif);
  font-size: clamp(48px, 6vw, 72px);
  line-height: 1;
  color: #fff;
  text-shadow: 0 0 24px rgba(72, 180, 252, 0.45);
}

.ride-countdown__days span {
  font-family: var(--paola-font-display, Oswald, sans-serif);
  font-size: 15px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(234, 242, 255, 0.85);
}

.ride-countdown__spots {
  display: grid;
  gap: 8px;
  font-size: 13px;
  color: rgba(234, 242, 255, 0.85);
}

.ride-countdown__bar {
  height: 10px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(5, 7, 12, 0.5);
}

.ride-countdown__bar span {
  display: block;
  height: 100%;
  min-width: 6px;
  border-radius: inherit;
  background: linear-gradient(90deg, #0088f8, #48b4fc);
  box-shadow: 0 0 12px rgba(72, 180, 252, 0.6);
}

@media (max-width: 560px) {
  .ride-countdown {
    grid-template-columns: 1fr;
  }
}

.ride-plan {
  gap: 12px;
  padding: 20px;
}

.ride-plan__text {
  margin: 0 0 8px;
  font-size: 15px;
  line-height: 1.6;
  color: rgba(234, 242, 255, 0.9);
}

.ride-bring {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.ride-bring li {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px 6px 8px;
  border: 1px solid rgba(72, 180, 252, 0.28);
  border-radius: 999px;
  background: rgba(0, 16, 40, 0.6);
  font-size: 13px;
}

.ride-page__signup {
  scroll-margin-top: 96px;
}

.ride-memory p {
  margin: 0;
}

.ride-memory__quote {
  padding-left: 12px;
  border-left: 2px solid var(--paola-cyan, #48b4fc);
  font-size: 14px;
  line-height: 1.55;
  color: rgba(234, 242, 255, 0.85);
}

.ride-gallery-block,
.ride-page__polls-block {
  display: grid;
  gap: 16px;
}

.ride-gallery {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  grid-auto-rows: 160px;
  gap: 8px;
}

.ride-gallery__item {
  overflow: hidden;
  border-radius: 10px;
  border: 1px solid rgba(72, 180, 252, 0.18);
  background: #001028;
}

.ride-gallery__item:first-child {
  grid-column: span 2;
  grid-row: span 2;
}

.ride-gallery__item:last-child:not(:first-child) {
  grid-column: span var(--last-span, 1);
}

.ride-gallery--few {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-auto-rows: 320px;
}

.ride-gallery--few .ride-gallery__item:first-child {
  grid-column: span 1;
  grid-row: span 1;
}

.ride-gallery--few .ride-gallery__item:only-child {
  grid-column: span 2;
}

.ride-gallery__item img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.ride-gallery__item:hover img,
.ride-gallery__item:focus-visible img {
  transform: scale(1.04);
}

.ride-gallery__closing {
  margin: 0;
  padding: 16px 20px;
  border-left: 3px solid var(--paola-blue, #0088f8);
  border-radius: 0 10px 10px 0;
  background: rgba(0, 16, 40, 0.5);
  font-size: 15px;
  font-style: italic;
  line-height: 1.6;
  color: rgba(234, 242, 255, 0.88);
}

.ride-page__polls {
  display: grid;
  gap: 16px;
}

.ride-crew__list {
  display: grid;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.ride-crew__rider {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 12px;
  align-items: center;
  padding: 8px 10px;
  border: 1px solid rgba(72, 180, 252, 0.16);
  border-radius: 10px;
  background: rgba(5, 7, 12, 0.45);
}

.ride-crew__avatar {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border: 1px solid var(--paola-cyan, #48b4fc);
  border-radius: 50%;
  object-fit: cover;
  background: rgba(0, 16, 40, 0.8);
  font-family: var(--display, Oswald, sans-serif);
  font-size: 16px;
}

.ride-crew__who {
  display: grid;
  min-width: 0;
  font-size: 13px;
}

.ride-crew__who strong {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
}

.ride-crew__who span {
  color: rgba(234, 242, 255, 0.7);
}

@media (min-width: 960px) {
  .ride-page__split {
    grid-template-columns: minmax(0, 1fr) minmax(300px, 26rem);
  }
}

@media (max-width: 720px) {
  .ride-gallery {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-auto-rows: 140px;
  }

  .ride-gallery__item:last-child:not(:first-child) {
    grid-column: span 1;
  }

  .ride-gallery--few {
    grid-auto-rows: 220px;
  }
}
</style>
