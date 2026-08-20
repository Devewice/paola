<script setup lang="ts">
import type { HomeModule } from '@modules/home/index.ts'
import { computed, nextTick, onMounted, ref } from 'vue'
import { HOME_BOARD_COPY, HOME_PULSE_COPY } from '@modules/home/constants/copy.ts'
import { parsePublicPost, type PublicPost } from '@app/parsePublicPost.ts'
import { API, APP_PATHS } from '@shared/http/constants.ts'
import { runKitHeroEntrance } from '@shared/motion/runKitHero.ts'
import Button from '@ui/Button.vue'
import DualChannel from '@ui/DualChannel.vue'
import EmptyBlock from '@ui/EmptyBlock.vue'
import FeedPost from '@ui/FeedPost.vue'
import Gallery from '@ui/Gallery.vue'
import HomeDash from '@ui/HomeDash.vue'
import Icon from '@ui/Icon.vue'
import KitHero from '@ui/KitHero.vue'
import KitHeroFooter from '@ui/KitHeroFooter.vue'
import KitHeroPanel from '@ui/KitHeroPanel.vue'
import MemoriaHero from '@ui/MemoriaHero.vue'
import QuoteBlock from '@ui/QuoteBlock.vue'
import StatBig from '@ui/StatBig.vue'
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
const rodadasValue = computed(() => (board.value.memory ? '1+' : '—'))
const nextFecha = computed(() => board.value.next?.date ?? '—')
const panelTitle = computed(() => board.value.next?.title ?? copy.panelTitle)
const splash = computed(() => (board.value.next ? board.value.next.date : copy.splashSoon))
const mediaLabel = computed(() =>
  board.value.memory ? `${board.value.memory.title} · ${board.value.memory.date}` : copy.panelEmptyMedia,
)

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
      <template #panel>
        <KitHeroPanel
          :label="copy.panelLabel"
          :media-label="mediaLabel"
          :media-src="board.memory?.photoSrc"
          :title="panelTitle"
          :km="kmValue"
          cupo="—"
          :fecha="nextFecha"
          :splash="splash"
          :cta-label="copy.nextCta"
          :cta-to="APP_PATHS.PARCHESE"
        />
      </template>
      <template #footer>
        <KitHeroFooter
          :stamp="copy.stamp"
          :rodadas="rodadasValue"
          :km="kmValue"
        />
      </template>
    </KitHero>

    <main :id="TABLERO_ID" class="wrap">
      <HomeDash>
        <template #hero>
          <div class="stack">
            <h4>{{ pulseCopy.heading }}</h4>
            <p class="meta" style="margin: 0">{{ pulseCopy.lead }}</p>
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
          </div>
        </template>
        <template #km>
          <div class="stack">
            <h4>{{ copy.kmHeading }}</h4>
            <StatBig :value="kmValue" :label="copy.kmLabel" />
          </div>
        </template>
        <template #memory>
          <div class="stack">
            <h4>{{ copy.memoryHeading }}</h4>
            <template v-if="board.memory">
              <MemoriaHero
                :title="board.memory.title"
                :meta="`${board.memory.date} · ${board.memory.km} km · ${board.memory.credit}`"
              />
              <Gallery v-if="board.memory.photos.length" :photos="board.memory.photos" />
              <p class="meta" style="margin: 0">{{ board.memory.closingText }}</p>
            </template>
            <EmptyBlock v-else glyph="◎" :copy="board.memoryEmptyCopy" />
          </div>
        </template>
        <template #voice>
          <div class="stack">
            <h4>{{ copy.voiceHeading }}</h4>
            <VoiceCard v-if="board.voice.tip" voice="loigca">
              <strong>{{ board.voice.tip.title }}</strong>
              — {{ board.voice.tip.body }}
            </VoiceCard>
            <EmptyBlock v-else glyph="◎" :copy="board.voice.emptyCopy" />
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
        </template>
        <template #paola>
          <div class="stack">
            <h4>{{ copy.paolaHeading }}</h4>
            <QuoteBlock :quote="board.paola.phrase" :cite="copy.paolaCite" />
            <Button variant="ghost" size="sm" :to="board.paola.to">{{ copy.paolaCta }}</Button>
          </div>
        </template>
      </HomeDash>

      <DualChannel style="margin-top: 28px">
        <template #wa>
          <p class="meta" style="margin: 8px 0">{{ copy.channelWa }}</p>
          <Button size="sm" :href="board.join.href" target="_blank">
            {{ board.join.label }}
            <Icon name="whatsapp" size="sm" tone="white" :circle="false" />
          </Button>
        </template>
        <template #web>
          <p class="meta" style="margin: 8px 0">{{ copy.channelWeb }}</p>
          <Button variant="ghost" size="sm" :to="APP_PATHS.PARCHESE">{{ copy.parcheseCta }}</Button>
        </template>
      </DualChannel>
    </main>
  </div>
</template>
