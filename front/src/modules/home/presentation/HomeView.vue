<script setup lang="ts">
import type { HomeModule } from '@modules/home/index.ts'
import { computed, onMounted, ref } from 'vue'
import { HOME_BOARD_COPY, HOME_PULSE_COPY } from '@modules/home/constants/copy.ts'
import { parsePublicPost, type PublicPost } from '@app/parsePublicPost.ts'
import { API, APP_PATHS } from '@shared/http/constants.ts'
import { usePageReveal } from '@shared/motion/usePageReveal.ts'
import AficheHero from '@ui/AficheHero.vue'
import Button from '@ui/Button.vue'
import Chip from '@ui/Chip.vue'
import DualChannel from '@ui/DualChannel.vue'
import DualCta from '@ui/DualCta.vue'
import EmptyBlock from '@ui/EmptyBlock.vue'
import FeedPost from '@ui/FeedPost.vue'
import Gallery from '@ui/Gallery.vue'
import HomeDash from '@ui/HomeDash.vue'
import HomeFeedWidget from '@ui/HomeFeedWidget.vue'
import KitBrushDivider from '@ui/KitBrushDivider.vue'
import MascotEmpty from '@ui/MascotEmpty.vue'
import MemoriaHero from '@ui/MemoriaHero.vue'
import QuoteBlock from '@ui/QuoteBlock.vue'
import RideListItem from '@ui/RideListItem.vue'
import StatBig from '@ui/StatBig.vue'
import VoiceBadge from '@ui/VoiceBadge.vue'
import VoiceCard from '@ui/VoiceCard.vue'

const MONTHS = [
  'Ene',
  'Feb',
  'Mar',
  'Abr',
  'May',
  'Jun',
  'Jul',
  'Ago',
  'Sep',
  'Oct',
  'Nov',
  'Dic',
] as const

const props = defineProps<{
  module: HomeModule
}>()

const board = computed(() => props.module.getBoard())
const bindReveal = usePageReveal()
const pulse = ref<readonly PublicPost[]>([])
const copy = HOME_BOARD_COPY
const pulseCopy = HOME_PULSE_COPY

const nextDate = computed(() => {
  const date = board.value.next?.date
  if (!date) return { day: '—', month: '' }
  const [, month, day] = date.split('-')
  const monthIndex = Number(month) - 1
  return { day: day ?? '—', month: MONTHS[monthIndex] ?? '' }
})

const kmValue = computed(() => (board.value.totalKm !== null ? String(board.value.totalKm) : '—'))

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
  }
})
</script>

<template>
  <article :ref="bindReveal" class="paola-page">
    <AficheHero
      :kicker="copy.kicker"
      :title="copy.title"
      :plate="copy.plate"
      logo
      :photo-src="board.memory?.photoSrc"
      data-reveal
    >
      <template #lead>{{ copy.lead }}</template>
      <template #actions>
        <DualCta>
          <Button v-if="board.next" variant="hero" :to="APP_PATHS.PARCHESE">{{ copy.nextCta }}</Button>
          <Button v-else variant="hero" :href="board.join.href" target="_blank">{{ board.join.label }}</Button>
          <Button v-if="board.next" variant="ghost" :href="board.join.href" target="_blank">
            {{ board.join.label }}
          </Button>
          <Button v-else variant="ghost" :to="APP_PATHS.PARCHESE">{{ copy.parcheseCta }}</Button>
        </DualCta>
      </template>
    </AficheHero>

    <HomeDash data-reveal>
      <template #hero>
        <div class="stack">
          <VoiceBadge voice="loigca" />
          <h4>{{ copy.nextHeading }}</h4>
          <template v-if="board.next">
            <RideListItem
              :day="nextDate.day"
              :month="nextDate.month"
              :title="board.next.title"
              :meta="`${board.next.kind === 'rodada' ? 'Rodada' : 'Actividad'} · ${board.next.point}`"
            >
              <Chip tone="abierto">Próxima</Chip>
            </RideListItem>
            <DualCta>
              <Button variant="hero" size="sm" :to="APP_PATHS.PARCHESE">{{ copy.nextCta }}</Button>
              <Button variant="ghost" size="sm" :href="board.join.href" target="_blank">
                {{ board.join.label }}
              </Button>
            </DualCta>
          </template>
          <MascotEmpty v-else :title="copy.emptyNextTitle" :copy="board.nextEmptyCopy">
            <Button variant="ghost" size="sm" :href="board.join.href" target="_blank">
              {{ board.join.label }}
            </Button>
          </MascotEmpty>
        </div>
      </template>

      <template #km>
        <div class="stack">
          <VoiceBadge voice="incauta" />
          <h4>{{ copy.kmHeading }}</h4>
          <StatBig :value="kmValue" :label="copy.kmLabel" />
        </div>
      </template>

      <template #memory>
        <div class="stack">
          <VoiceBadge voice="incauta" />
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
          <VoiceBadge voice="loigca" />
          <h4>{{ copy.voiceHeading }}</h4>
          <VoiceCard v-if="board.voice.tip" voice="loigca">
            <strong>{{ board.voice.tip.title }}</strong>
            — {{ board.voice.tip.body }}
          </VoiceCard>
          <EmptyBlock v-else glyph="◎" :copy="board.voice.emptyCopy" />
          <DualCta v-if="board.voice.tip?.officialHref">
            <Button variant="ghost" size="sm" :to="board.voice.to">{{ copy.voiceCta }}</Button>
            <Button variant="ghost" size="sm" :href="board.voice.tip.officialHref" target="_blank">
              {{ copy.officialCta }}
            </Button>
          </DualCta>
          <Button v-else variant="ghost" size="sm" :to="board.voice.to">{{ copy.voiceCta }}</Button>
        </div>
      </template>

      <template #paola>
        <div class="stack">
          <VoiceBadge voice="armargura" />
          <h4>{{ copy.paolaHeading }}</h4>
          <QuoteBlock :quote="board.paola.phrase" :cite="copy.paolaCite" />
          <Button variant="ghost" size="sm" :to="board.paola.to">{{ copy.paolaCta }}</Button>
        </div>
      </template>
    </HomeDash>

    <KitBrushDivider variant="thin" data-reveal />

    <HomeFeedWidget
      :title="pulseCopy.heading"
      :meta="pulseCopy.lead"
      :to="APP_PATHS.FEED"
      :link-label="pulseCopy.cta"
      data-reveal
    >
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
    </HomeFeedWidget>

    <DualChannel data-reveal>
      <template #wa>
        <p class="meta" style="margin: 8px 0">{{ copy.channelWa }}</p>
        <Button size="sm" :href="board.join.href" target="_blank">{{ board.join.label }}</Button>
      </template>
      <template #web>
        <p class="meta" style="margin: 8px 0">{{ copy.channelWeb }}</p>
        <Button variant="ghost" size="sm" :to="APP_PATHS.PARCHESE">{{ copy.parcheseCta }}</Button>
      </template>
    </DualChannel>
  </article>
</template>

<style scoped>
.paola-page :deep(.kit-hero__actions .dual-cta) {
  width: min(100%, 28rem);
}

.paola-page :deep(.home-dash__cell--wide .ride-list-item) {
  background: var(--ink);
}
</style>
