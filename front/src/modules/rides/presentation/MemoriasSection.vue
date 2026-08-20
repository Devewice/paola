<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { RidesModule } from '@modules/rides/index.ts'
import { APP_PATHS, JSON_HEADERS, apiMemoryComments } from '@shared/http/constants.ts'
import Button from '@ui/Button.vue'
import Comment from '@ui/Comment.vue'
import Empty from '@ui/Empty.vue'
import Field from '@ui/Field.vue'
import Gallery from '@ui/Gallery.vue'
import MemoriaHero from '@ui/MemoriaHero.vue'
import StatGrid from '@ui/StatGrid.vue'
import Textarea from '@ui/Textarea.vue'
import VoiceBadge from '@ui/VoiceBadge.vue'

const props = defineProps<{
  module: RidesModule
}>()

type MemoryCommentRow = { id: string; authorAlias?: string; alias?: string; body: string }

const memories = props.module.getMemories()
const latest = memories.items[0] ?? null
const photoCount = memories.items.reduce((sum, item) => sum + item.photos.length, 0)
const comments = ref<readonly MemoryCommentRow[]>([])
const commentBody = ref('')
const sessionId = ref(typeof localStorage !== 'undefined' ? localStorage.getItem('paola_session_id') ?? '' : '')
const commentError = ref('')

onMounted(async () => {
  if (!latest) return
  try {
    const response = await fetch(apiMemoryComments(latest.id))
    if (!response.ok) return
    const body = await response.json()
    comments.value = Array.isArray(body.comments) ? body.comments : []
  } catch {
    comments.value = []
  }
})

async function sendComment(): Promise<void> {
  commentError.value = ''
  if (!latest) return
  if (!sessionId.value) {
    commentError.value = 'Entra a tu cuenta para comentar. WhatsApp sigue abierto.'
    return
  }
  const response = await fetch(apiMemoryComments(latest.id), {
    method: 'POST',
    headers: { ...JSON_HEADERS, 'x-session-id': sessionId.value },
    body: JSON.stringify({ body: commentBody.value }),
  })
  if (!response.ok) {
    commentError.value = 'No se pudo enviar. Moderamos los comentarios.'
    return
  }
  commentBody.value = ''
  commentError.value = 'Enviado. Si entra a revisión, lo ves cuando lo publiquemos.'
}
</script>

<template>
  <section class="parchese-page__memorias" aria-label="Memorias">
    <VoiceBadge voice="incauta" />
    <h2 class="paola-page__heading type-display">Memorias</h2>

    <template v-if="latest">
      <MemoriaHero
        :title="latest.title"
        :meta="`${latest.date} · ${latest.km} km · ${latest.credit}`"
      />
      <Gallery :photos="latest.photos" />
      <StatGrid
        :items="[
          { value: String(memories.totalKm), label: 'Km del parche' },
          { value: String(photoCount), label: 'Fotos' },
          { value: String(memories.items.length), label: 'Rodadas' },
        ]"
      />
      <p class="paola-page__copy">{{ latest.participantsText }}</p>
      <p class="paola-page__copy paola-page__copy--muted">{{ latest.closingText }}</p>
      <p v-if="latest.instagramHref" class="paola-page__copy paola-page__copy--muted">
        <a :href="latest.instagramHref" target="_blank" rel="noopener noreferrer">Instagram de la salida</a>
      </p>

      <h3 class="paola-page__heading">Comentarios</h3>
      <p class="paola-page__copy paola-page__copy--muted">
        Respeto, no doxxing, no menores. Moderamos. No es un chat ni un tribunal.
      </p>
      <div v-if="comments.length" class="parchese-page__comments">
        <Comment
          v-for="item in comments"
          :key="item.id"
          :author="item.authorAlias ?? item.alias ?? 'parcero'"
          :body="item.body"
        />
      </div>
      <p v-else class="paola-page__copy paola-page__copy--muted">Aún no hay comentarios publicados.</p>
      <p v-if="commentError" class="paola-page__copy paola-page__copy--muted">{{ commentError }}</p>
      <form class="parchese-page__comment-form" @submit.prevent="sendComment">
        <Field label="Comentar">
          <Textarea v-model="commentBody" />
        </Field>
        <Button type="submit" size="sm">Enviar</Button>
        <Button v-if="!sessionId" type="button" size="sm" variant="ghost" :to="APP_PATHS.CUENTA">Cuenta</Button>
      </form>
    </template>

    <Empty
      v-else
      compact
      hide-cta
      title="Sin recuento aún"
      :copy="memories.emptyCopy"
      mascot-src="/mascota/tumbada.png"
    />
  </section>
</template>

<style scoped>
.parchese-page__memorias,
.parchese-page__comments,
.parchese-page__comment-form {
  display: grid;
  gap: 12px;
}
.parchese-page__comments {
  margin: 0;
  padding-left: 1.2rem;
}
</style>
