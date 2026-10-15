<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { SESSION_STORAGE_KEY } from '@app/constants/cuenta.ts'
import { RIDES_MEMORIES_COPY } from '@modules/rides/constants/copy.ts'
import type { RidesModule } from '@modules/rides/index.ts'
import { APP_PATHS, JSON_HEADERS, apiMemoryComments } from '@shared/http/constants.ts'
import { MASCOT } from '@shared/ui/mascot.ts'
import Button from '@ui/Button.vue'
import Comment from '@ui/Comment.vue'
import Field from '@ui/Field.vue'
import Gallery from '@ui/Gallery.vue'
import HubTile from '@ui/HubTile.vue'
import MemoriaHero from '@ui/MemoriaHero.vue'
import StatBand from '@ui/StatBand.vue'
import StepsPoster from '@ui/StepsPoster.vue'
import Textarea from '@ui/Textarea.vue'
import { showToast } from '@ui/toast.ts'

const props = defineProps<{
  module: RidesModule
}>()

type MemoryCommentRow = { id: string; authorAlias?: string; alias?: string; body: string }

const copy = RIDES_MEMORIES_COPY
const memories = computed(() => props.module.getMemories())
const selectedId = ref('')
const current = computed(
  () => memories.value.items.find((item) => item.id === selectedId.value) ?? memories.value.items[0] ?? null,
)
const archive = computed(() => memories.value.items.filter((item) => item.id !== current.value?.id))
const photoCount = computed(() =>
  memories.value.items.reduce((sum, item) => sum + item.photos.length, 0),
)
const stats = computed(() => [
  { value: String(memories.value.totalKm), label: copy.statKm },
  { value: String(photoCount.value), label: copy.statPhotos },
  { value: String(memories.value.items.length), label: copy.statRides },
])
const layoutEl = ref<HTMLElement | null>(null)

function select(id: string): void {
  selectedId.value = id
  layoutEl.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const comments = ref<readonly MemoryCommentRow[]>([])
const commentBody = ref('')
const sending = ref(false)
const sessionId = ref(readSession())

function readSession(): string {
  try {
    return localStorage.getItem(SESSION_STORAGE_KEY) ?? ''
  } catch {
    return ''
  }
}

async function loadComments(memoryId: string): Promise<void> {
  comments.value = []
  try {
    const response = await fetch(apiMemoryComments(memoryId))
    if (!response.ok) return
    const body = await response.json()
    comments.value = Array.isArray(body.comments) ? body.comments : []
  } catch {
    comments.value = []
  }
}

watch(
  () => current.value?.id,
  (id) => {
    if (id) void loadComments(id)
  },
  { immediate: true },
)

async function sendComment(): Promise<void> {
  const memory = current.value
  if (!memory || sending.value) return
  if (!sessionId.value) {
    showToast(copy.commentNeedAccount, 'warn')
    return
  }
  sending.value = true
  try {
    const response = await fetch(apiMemoryComments(memory.id), {
      method: 'POST',
      headers: { ...JSON_HEADERS, 'x-session-id': sessionId.value },
      body: JSON.stringify({ body: commentBody.value }),
    })
    if (!response.ok) {
      showToast(copy.commentFail, 'bad')
      return
    }
    commentBody.value = ''
    showToast(copy.commentSent, 'ok')
  } catch {
    showToast(copy.commentFail, 'bad')
  } finally {
    sending.value = false
  }
}
</script>

<template>
  <section class="memorias" :aria-label="copy.aria">
    <StatBand
      v-if="memories.items.length"
      tone="blue"
      :title="copy.bandTitle"
      :items="stats"
      :mascot-src="MASCOT.LENTE"
    />
    <div v-if="current" ref="layoutEl" class="memorias__layout">
      <div class="memorias__main">
        <MemoriaHero
          :title="current.title"
          :meta="`${current.date} · ${current.km} km · ${current.credit}`"
          :photo-src="current.photos[0]?.src"
          :photo-label="current.title"
        />
        <Gallery :photos="current.photos" />
        <p class="paola-page__copy">{{ current.participantsText }}</p>
        <p class="paola-page__copy paola-page__copy--muted">{{ current.closingText }}</p>
        <p v-if="current.instagramHref" class="paola-page__copy paola-page__copy--muted">
          <a :href="current.instagramHref" target="_blank" rel="noopener noreferrer">{{ copy.instagram }}</a>
        </p>
      </div>

      <aside class="memorias__rail poster poster--navy">
        <span class="board-kicker">{{ copy.railKicker }}</span>
        <dl class="hub-stats hub-stats--dl memorias__rail-stats">
          <div class="hub-stat">
            <dt><span>{{ copy.railKm }}</span></dt>
            <dd><strong>{{ current.km }}</strong></dd>
          </div>
          <div class="hub-stat">
            <dt><span>{{ copy.railPhotos }}</span></dt>
            <dd><strong>{{ current.photos.length }}</strong></dd>
          </div>
        </dl>
        <h3 class="memorias__rail-title">{{ copy.commentsHeading }}</h3>
        <p class="meta-text">{{ copy.commentsRules }}</p>
        <div v-if="comments.length" class="memorias__comments">
          <Comment
            v-for="item in comments"
            :key="item.id"
            :author="item.authorAlias ?? item.alias ?? copy.commentAuthorFallback"
            :body="item.body"
          />
        </div>
        <p v-else class="meta-text">{{ copy.commentsEmpty }}</p>
        <form class="memorias__form" @submit.prevent="sendComment">
          <Field :label="copy.commentLabel">
            <Textarea v-model="commentBody" />
          </Field>
          <div class="memorias__form-actions">
            <Button type="submit" size="sm" :disabled="sending">{{ copy.commentSend }}</Button>
            <Button v-if="!sessionId" size="sm" variant="ghost" :to="APP_PATHS.ENTRAR">
              {{ copy.commentLogin }}
            </Button>
          </div>
        </form>
      </aside>
    </div>

    <StepsPoster
      v-else
      wide
      tone="blue"
      :kicker="copy.emptyKicker"
      :title="copy.emptyTitle"
      :lead="memories.emptyCopy"
      :steps="copy.emptySteps"
      :mascot-src="MASCOT.LENTE"
    >
      <Button size="sm" :to="APP_PATHS.PARCHESE_RODADAS">{{ copy.emptyCta }}</Button>
    </StepsPoster>

    <div v-if="archive.length" class="memorias__archive">
      <h3 class="memorias__rail-title">{{ copy.archiveHeading }}</h3>
      <div class="memorias__archive-grid">
        <HubTile
          v-for="(item, index) in archive"
          :key="item.id"
          size="compact"
          :tone="index % 2 ? 'blue' : 'navy'"
          :index="String(index + 1).padStart(2, '0')"
          :image-src="item.photos[0]?.src"
          :mascot-src="item.photos[0] ? undefined : MASCOT.LENTE"
          :kicker="`${item.date} · ${item.km} km`"
          :title="item.title"
          :cta="copy.archiveCta"
          @click="select(item.id)"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.memorias,
.memorias__main,
.memorias__rail,
.memorias__comments,
.memorias__form,
.memorias__archive {
  display: grid;
  gap: 12px;
  min-width: 0;
}

.memorias {
  gap: 32px;
}

.memorias__layout {
  display: grid;
  gap: 24px 32px;
  align-items: start;
  scroll-margin-top: 96px;
}

.memorias__rail-title {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.memorias__form-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.memorias__archive-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 16rem), 1fr));
}

@media (min-width: 960px) {
  .memorias__layout {
    grid-template-columns: minmax(0, 1.5fr) minmax(260px, 0.8fr);
  }
}
</style>
