<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { CUENTA_COPY, CUENTA_NAV_COPY, CUENTA_SECTIONS_COPY } from '@app/constants/cuenta.ts'
import { detailOf, useCuenta } from '@app/shell/cuenta/context.ts'
import { API, CUENTA_CHAT_QUERY, apiChatMessages, appCuentaChat } from '@shared/http/constants.ts'
import Alert from '@ui/Alert.vue'
import Button from '@ui/Button.vue'
import ChatBubble from '@ui/ChatBubble.vue'
import Field from '@ui/Field.vue'
import Input from '@ui/Input.vue'
import Textarea from '@ui/Textarea.vue'
import './cuenta-card.css'

type ChatRow = { id: string; kind: string; title?: string; peerAlias?: string; peerId?: string; silenced: boolean }
type ChatLine = { id: string; authorAlias: string; body?: string; photoSrc?: string; voiceSrc?: string; pinned?: boolean }

const copy = CUENTA_COPY
const sections = CUENTA_SECTIONS_COPY
const route = useRoute()
const router = useRouter()
const { myAlias, sessionHeaders } = useCuenta()

const chats = ref<ChatRow[]>([])
const activeId = ref('')
const messages = ref<ChatLine[]>([])
const draft = ref('')
const photo = ref('')
const voice = ref('')
const error = ref('')
const busy = ref(false)

function labelOf(row: ChatRow): string {
  return row.title || row.peerAlias || row.kind
}

function bodyOf(line: ChatLine): string {
  if (line.body) return line.body
  if (line.photoSrc) return copy.photoFallback
  if (line.voiceSrc) return copy.voiceFallback
  return ''
}

async function loadChats(): Promise<void> {
  try {
    const response = await fetch(API.CHATS, { headers: sessionHeaders() })
    if (!response.ok) return
    const body = (await response.json()) as Record<string, unknown>
    chats.value = Array.isArray(body.chats) ? (body.chats as ChatRow[]) : []
  } catch {
    chats.value = []
  }
}

async function openChat(id: string): Promise<void> {
  activeId.value = id
  messages.value = []
  if (!id) return
  try {
    const response = await fetch(apiChatMessages(id), { headers: sessionHeaders() })
    if (!response.ok) return
    const body = (await response.json()) as Record<string, unknown>
    messages.value = Array.isArray(body.messages) ? (body.messages as ChatLine[]) : []
  } catch {
    messages.value = []
  }
}

async function send(): Promise<void> {
  if (!activeId.value) return
  error.value = ''
  busy.value = true
  try {
    const response = await fetch(apiChatMessages(activeId.value), {
      method: 'POST',
      headers: sessionHeaders(true),
      body: JSON.stringify({
        body: draft.value,
        photoSrc: photo.value.trim() || undefined,
        voiceSrc: voice.value.trim() || undefined,
      }),
    })
    if (!response.ok) {
      error.value = await detailOf(response, copy.failGeneric)
      return
    }
    draft.value = ''
    photo.value = ''
    voice.value = ''
    await openChat(activeId.value)
  } catch {
    error.value = copy.failGeneric
  } finally {
    busy.value = false
  }
}

function pick(id: string): void {
  void router.replace(appCuentaChat(id))
}

watch(
  () => route.query[CUENTA_CHAT_QUERY],
  (value) => void openChat(typeof value === 'string' ? value : ''),
  { immediate: true },
)

onMounted(loadChats)
</script>

<template>
  <section class="cuenta-card" aria-labelledby="cuenta-chat-title" data-reveal>
    <header class="cuenta-card__head">
      <span class="board-kicker">{{ CUENTA_NAV_COPY.chatNote }}</span>
      <h2 id="cuenta-chat-title" class="cuenta-card__title">{{ sections.chatTitle }}</h2>
      <p class="meta-text">{{ copy.chatLead }}</p>
    </header>

    <Alert v-if="error" tone="bad">{{ error }}</Alert>

    <p v-if="!chats.length" class="meta-text">{{ copy.chatEmpty }}</p>

    <div v-else class="cuenta-chat">
      <nav class="cuenta-chat__list" :aria-label="sections.chatList">
        <button
          v-for="row in chats"
          :key="row.id"
          type="button"
          class="cuenta-row cuenta-chat__item"
          :class="{ 'is-active': row.id === activeId }"
          @click="pick(row.id)"
        >
          <strong class="cuenta-row__title">{{ labelOf(row) }}</strong>
        </button>
      </nav>

      <div class="cuenta-chat__thread">
        <p v-if="!activeId" class="meta-text">{{ sections.chatPick }}</p>
        <template v-else>
          <div class="cuenta-chat__messages">
            <ChatBubble
              v-for="line in messages"
              :key="line.id"
              :mine="line.authorAlias === myAlias"
              :body="line.body ?? bodyOf(line)"
              :photo-src="line.photoSrc"
              :voice-src="line.voiceSrc"
              :pinned="line.pinned"
            />
          </div>
          <form class="cuenta-card__form" @submit.prevent="send">
            <Field :label="copy.messageLabel"><Textarea v-model="draft" /></Field>
            <details class="cuenta-chat__attach">
              <summary>{{ sections.chatAttach }}</summary>
              <Field :label="copy.photoUrl"><Input v-model="photo" /></Field>
              <Field :label="copy.voiceUrl"><Input v-model="voice" /></Field>
            </details>
            <div class="cuenta-card__actions">
              <Button type="submit" size="sm" :disabled="busy">{{ copy.chatSend }}</Button>
            </div>
          </form>
        </template>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cuenta-chat {
  display: grid;
  grid-template-columns: minmax(200px, 280px) minmax(0, 1fr);
  gap: 16px;
  align-items: start;
}

.cuenta-chat__list {
  display: grid;
  gap: 8px;
}

.cuenta-chat__item {
  width: 100%;
  text-align: left;
  color: inherit;
  cursor: pointer;
  font: inherit;
}

.cuenta-chat__item:hover {
  border-color: rgba(72, 180, 252, 0.45);
}

.cuenta-chat__thread {
  display: grid;
  gap: 12px;
  min-width: 0;
}

.cuenta-chat__messages {
  display: grid;
  gap: 8px;
  max-height: 420px;
  overflow-y: auto;
}

.cuenta-chat__attach summary {
  cursor: pointer;
  font-size: 13px;
  color: var(--paola-cyan, #48b4fc);
}

.cuenta-chat__attach[open] {
  display: grid;
  gap: 8px;
}

@media (max-width: 767px) {
  .cuenta-chat {
    grid-template-columns: 1fr;
  }
}
</style>
