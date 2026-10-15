<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { SESSION_STORAGE_KEY } from '@app/constants/cuenta.ts'
import { RIDES_MEMORIES_COPY } from '@modules/rides/constants/copy.ts'
import type { RidesModule } from '@modules/rides/index.ts'
import { APP_PATHS, JSON_HEADERS, apiMemoryComments } from '@shared/http/constants.ts'
import { MASCOT } from '@shared/ui/mascot.ts'
import Button from '@ui/Button.vue'
import Comment from '@ui/Comment.vue'
import Empty from '@ui/Empty.vue'
import Field from '@ui/Field.vue'
import Gallery from '@ui/Gallery.vue'
import MemoriaHero from '@ui/MemoriaHero.vue'
import StatGrid from '@ui/StatGrid.vue'
import Textarea from '@ui/Textarea.vue'
import VoiceBadge from '@ui/VoiceBadge.vue'
import { showToast } from '@ui/toast.ts'

const props = defineProps<{
  module: RidesModule
}>()

type MemoryCommentRow = { id: string; authorAlias?: string; alias?: string; body: string }

const copy = RIDES_MEMORIES_COPY
const memories = computed(() => props.module.getMemories())
const latest = computed(() => memories.value.items[0] ?? null)
const photoCount = computed(() =>
  memories.value.items.reduce((sum, item) => sum + item.photos.length, 0),
)
const stats = computed(() => [
  { value: String(memories.value.totalKm), label: copy.statKm },
  { value: String(photoCount.value), label: copy.statPhotos },
  { value: String(memories.value.items.length), label: copy.statRides },
])
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

onMounted(async () => {
  const memory = latest.value
  if (!memory) return
  try {
    const response = await fetch(apiMemoryComments(memory.id))
    if (!response.ok) return
    const body = await response.json()
    comments.value = Array.isArray(body.comments) ? body.comments : []
  } catch {
    comments.value = []
  }
})

async function sendComment(): Promise<void> {
  const memory = latest.value
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
    <header class="memorias__head">
      <VoiceBadge voice="incauta" />
      <h2 class="paola-page__heading type-display">{{ copy.heading }}</h2>
    </header>

    <div v-if="latest" class="memorias__layout">
      <div class="memorias__main">
        <MemoriaHero
          :title="latest.title"
          :meta="`${latest.date} · ${latest.km} km · ${latest.credit}`"
        />
        <Gallery :photos="latest.photos" />
        <p class="paola-page__copy">{{ latest.participantsText }}</p>
        <p class="paola-page__copy paola-page__copy--muted">{{ latest.closingText }}</p>
        <p v-if="latest.instagramHref" class="paola-page__copy paola-page__copy--muted">
          <a :href="latest.instagramHref" target="_blank" rel="noopener noreferrer">{{ copy.instagram }}</a>
        </p>
      </div>

      <aside class="memorias__rail">
        <StatGrid :items="stats" />
        <h3 class="paola-page__heading">{{ copy.commentsHeading }}</h3>
        <p class="paola-page__copy paola-page__copy--muted">{{ copy.commentsRules }}</p>
        <div v-if="comments.length" class="memorias__comments">
          <Comment
            v-for="item in comments"
            :key="item.id"
            :author="item.authorAlias ?? item.alias ?? copy.commentAuthorFallback"
            :body="item.body"
          />
        </div>
        <p v-else class="paola-page__copy paola-page__copy--muted">{{ copy.commentsEmpty }}</p>
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

    <Empty
      v-else
      compact
      hide-cta
      :title="copy.emptyTitle"
      :copy="memories.emptyCopy"
      :mascot-src="MASCOT.TUMBADA"
    />
  </section>
</template>

<style scoped>
.memorias,
.memorias__main,
.memorias__rail,
.memorias__comments,
.memorias__form {
  display: grid;
  gap: 12px;
  min-width: 0;
}

.memorias__head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.memorias__layout {
  display: grid;
  gap: 24px 32px;
  align-items: start;
}

.memorias__rail {
  padding: 16px;
  border: 1px solid rgba(72, 180, 252, 0.18);
  border-radius: 12px;
  background: rgba(0, 16, 40, 0.35);
}

.memorias__form-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

@media (min-width: 960px) {
  .memorias__layout {
    grid-template-columns: minmax(0, 1.5fr) minmax(260px, 0.8fr);
  }
}
</style>
