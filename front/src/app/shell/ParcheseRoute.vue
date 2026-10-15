<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { getAppDependencies, refreshInventory } from '@app/bootstrap.ts'
import { PARCHESE_COPY, PARCHESE_HERO_PHOTO } from '@app/constants/parchese.ts'
import ClubRoster from '@modules/club/presentation/ClubRoster.vue'
import { remainingSpots } from '@modules/rides/index.ts'
import AgendaSection from '@modules/rides/presentation/AgendaSection.vue'
import MemoriasSection from '@modules/rides/presentation/MemoriasSection.vue'
import { usePageReveal } from '@shared/motion/usePageReveal.ts'
import { APP_PATHS } from '@shared/http/constants.ts'
import AficheHero from '@ui/AficheHero.vue'
import Button from '@ui/Button.vue'
import DualChannel from '@ui/DualChannel.vue'
import GuidelinesList from '@ui/GuidelinesList.vue'
import Icon from '@ui/Icon.vue'
import VoiceCard from '@ui/VoiceCard.vue'

const copy = PARCHESE_COPY
const bindReveal = usePageReveal()
const stamp = ref(0)

onMounted(async () => {
  await refreshInventory()
  stamp.value += 1
})

const deps = computed(() => {
  stamp.value
  return getAppDependencies()
})

const rides = computed(() => deps.value.rides)
const club = computed(() => deps.value.club)
const join = computed(() => club.value.getJoinChannel())
const nextOuting = computed(() => rides.value.nextOpenOuting())
</script>

<template>
  <div :ref="bindReveal" class="parchese-page">
    <AficheHero
      :kicker="copy.kicker"
      :title="copy.title"
      :plate="copy.plate"
      :photo-src="PARCHESE_HERO_PHOTO"
      data-reveal
    >
      <template #lead>{{ copy.lead }}</template>
      <template #actions>
        <Button variant="hero" :href="join.href" target="_blank">
          {{ join.cta }}
          <Icon name="whatsapp" size="sm" tone="white" :circle="false" />
        </Button>
      </template>
      <template #panel>
        <VoiceCard voice="loigca">
          <p class="parchese-page__panel-kicker">{{ copy.panelKicker }}</p>
          <template v-if="nextOuting">
            <strong class="parchese-page__panel-title">{{ nextOuting.title }}</strong>
            <p class="parchese-page__panel-meta">
              {{ nextOuting.date }} · {{ nextOuting.meetingPoint }}
            </p>
            <p class="parchese-page__panel-spots">
              <span>{{ remainingSpots(nextOuting) }}</span>
              {{ copy.panelSpots }} · {{ nextOuting.taken }} / {{ nextOuting.capacity }}
            </p>
            <Button variant="ghost" size="sm" href="#agenda">{{ copy.panelCta }}</Button>
          </template>
          <p v-else class="meta">{{ copy.panelEmpty }}</p>
        </VoiceCard>
      </template>
    </AficheHero>

    <main class="wrap parchese-board">
      <nav class="parchese-board__nav filter-pills" :aria-label="copy.title" data-reveal>
        <a class="filter-pill" href="#agenda">{{ copy.navAgenda }}</a>
        <a class="filter-pill" href="#memorias">{{ copy.navMemories }}</a>
        <a class="filter-pill" href="#integrantes">{{ copy.navMembers }}</a>
        <a class="filter-pill" href="#alianzas">{{ copy.navAllies }}</a>
      </nav>

      <div id="agenda" class="parchese-board__split" data-reveal>
        <AgendaSection :module="rides" />

        <aside class="parchese-board__rail">
          <div class="parchese-board__rail-block">
            <h3>{{ copy.railJoinTitle }}</h3>
            <p class="meta">{{ join.copy }}</p>
            <Button size="sm" :href="join.href" target="_blank">{{ join.cta }}</Button>
          </div>
          <div class="parchese-board__rail-block">
            <h3>{{ copy.railHowTitle }}</h3>
            <GuidelinesList :items="copy.railHowItems" />
          </div>
          <div class="parchese-board__rail-block">
            <h3>{{ copy.railTalkTitle }}</h3>
            <DualChannel>
              <template #wa>
                <p class="meta">{{ copy.railTalkWa }}</p>
              </template>
              <template #web>
                <p class="meta">{{ copy.railTalkWeb }}</p>
                <Button variant="ghost" size="sm" :to="APP_PATHS.FEED">{{ copy.railFeed }}</Button>
              </template>
            </DualChannel>
          </div>
        </aside>
      </div>

      <div id="memorias" class="parchese-board__section" data-reveal>
        <MemoriasSection :module="rides" />
      </div>

      <div class="parchese-board__section" data-reveal>
        <ClubRoster :module="club" />
      </div>
    </main>
  </div>
</template>

<style scoped>
.parchese-page {
  width: 100%;
}

.parchese-page__panel-kicker {
  margin: 0 0 8px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--paola-muted, #9aa3b2);
}

.parchese-page__panel-title {
  display: block;
  font-family: var(--display, Oswald, sans-serif);
  font-size: 20px;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.parchese-page__panel-meta {
  margin: 6px 0 12px;
  color: var(--paola-muted, #9aa3b2);
  font-size: 14px;
}

.parchese-page__panel-spots {
  margin: 0 0 14px;
  font-size: 13px;
  color: var(--paola-muted, #9aa3b2);
}

.parchese-page__panel-spots span {
  font-family: var(--display, Oswald, sans-serif);
  font-size: 28px;
  color: var(--paola-cyan, #48b4fc);
  margin-right: 4px;
}

.parchese-board {
  display: grid;
  gap: 48px;
  padding-block: 32px 64px;
}

.parchese-board__nav {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.parchese-board__nav .filter-pill {
  text-decoration: none;
}

.parchese-board__split {
  display: grid;
  gap: 24px 32px;
  align-items: start;
  scroll-margin-top: 96px;
}

.parchese-board__section {
  scroll-margin-top: 96px;
  min-width: 0;
}

.parchese-board__rail {
  display: grid;
  gap: 16px;
  min-width: 0;
}

.parchese-board__rail-block {
  display: grid;
  gap: 10px;
  padding: 16px;
  border: 1px solid rgba(72, 180, 252, 0.18);
  border-radius: 12px;
  background: rgba(0, 16, 40, 0.35);
}

.parchese-board__rail-block :deep(.where-we-talk) {
  grid-template-columns: 1fr;
}

.parchese-board__rail-block h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

@media (min-width: 960px) {
  .parchese-board__split {
    grid-template-columns: minmax(0, 1fr) minmax(260px, 20rem);
  }

  .parchese-board__rail {
    position: sticky;
    top: 96px;
  }
}

@media (max-width: 959px) {
  .parchese-board {
    gap: 32px;
    padding-block: 24px 48px;
  }
}
</style>
