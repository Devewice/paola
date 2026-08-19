<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { LEGAL_COPY } from '@app/constants/legal.ts'
import { ALIAS_STORAGE_KEY, CUENTA_COPY, SESSION_STORAGE_KEY } from '@app/constants/cuenta.ts'
import OutingThreadBlock from '@app/shell/OutingThreadBlock.vue'
import { parseAccountRegister } from '@app/parseAccountRegister.ts'
import {
  API,
  APP_PATHS,
  JSON_HEADERS,
  SESSION_HEADER,
  apiChatMessages,
  apiFriendAccept,
  apiFriendBlock,
} from '@shared/http/constants.ts'
import { MASCOT } from '@shared/ui/mascot.ts'
import Alert from '@ui/Alert.vue'
import Button from '@ui/Button.vue'
import ChatBubble from '@ui/ChatBubble.vue'
import Choice from '@ui/Choice.vue'
import DualChannel from '@ui/DualChannel.vue'
import Empty from '@ui/Empty.vue'
import Field from '@ui/Field.vue'
import Input from '@ui/Input.vue'
import PrivacyCheck from '@ui/PrivacyCheck.vue'
import Textarea from '@ui/Textarea.vue'

type TicketRow = { id: string; outing_id?: string; outingId?: string; name: string }
type OrderRow = { id: string; item_title?: string; itemTitle?: string; status: string }
type NoteRow = { id: string; kind: string; message: string }
type FriendRow = { id: string; alias: string; userId: string }
type ChatRow = { id: string; kind: string; title?: string; peerAlias?: string; peerId?: string; silenced: boolean }
type ChatLine = { id: string; authorAlias: string; body?: string; photoSrc?: string; voiceSrc?: string; pinned?: boolean }

const copy = CUENTA_COPY
const email = ref('')
const alias = ref('')
const password = ref('')
const loginEmail = ref('')
const loginPassword = ref('')
const privacyAccepted = ref(false)
const sessionId = ref(localStorage.getItem(SESSION_STORAGE_KEY) ?? '')
const myAlias = ref(localStorage.getItem(ALIAS_STORAGE_KEY) ?? '')
const panel = ref<{ tickets: TicketRow[]; orders: OrderRow[]; notifications: NoteRow[] } | null>(null)
const error = ref('')
const legal = LEGAL_COPY
const privacyPath = APP_PATHS.PRIVACIDAD
const profilePublic = ref(false)
const friendAlias = ref('')
const pending = ref<FriendRow[]>([])
const outgoing = ref<FriendRow[]>([])
const accepted = ref<FriendRow[]>([])
const chats = ref<ChatRow[]>([])
const activeChatId = ref('')
const messages = ref<ChatLine[]>([])
const chatDraft = ref('')
const chatPhoto = ref('')
const chatVoice = ref('')
const outingThreadId = ref('')

onMounted(async () => {
  if (sessionId.value) await loadSession()
})

function sessionHeaders(json = false): Record<string, string> {
  return json
    ? { ...JSON_HEADERS, [SESSION_HEADER]: sessionId.value }
    : { [SESSION_HEADER]: sessionId.value }
}

function rememberSession(id: string, nextAlias: string): void {
  sessionId.value = id
  myAlias.value = nextAlias
  localStorage.setItem(SESSION_STORAGE_KEY, id)
  if (nextAlias) localStorage.setItem(ALIAS_STORAGE_KEY, nextAlias)
}

async function register(): Promise<void> {
  error.value = ''
  const parsed = parseAccountRegister({ privacyAccepted: privacyAccepted.value })
  if (!parsed.ok) {
    error.value = parsed.error.message
    return
  }
  const response = await fetch(API.USERS_REGISTER, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({
      email: email.value,
      alias: alias.value,
      password: password.value,
      privacyAccepted: privacyAccepted.value,
    }),
  })
  const body = await response.json()
  if (!response.ok) {
    error.value = body.detail ?? copy.failRegister
    return
  }
  rememberSession(body.sessionId, typeof body.user?.alias === 'string' ? body.user.alias : alias.value)
  await loadSession()
}

async function login(): Promise<void> {
  error.value = ''
  const response = await fetch(API.USERS_LOGIN, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ email: loginEmail.value, password: loginPassword.value }),
  })
  const body = await response.json()
  if (!response.ok) {
    error.value = body.detail ?? copy.failLogin
    return
  }
  rememberSession(body.sessionId, typeof body.user?.alias === 'string' ? body.user.alias : '')
  await loadSession()
}

async function loadSession(): Promise<void> {
  await Promise.all([loadPanel(), loadFriends(), loadChats()])
}

async function loadPanel(): Promise<void> {
  const response = await fetch(API.ME_PANEL, { headers: sessionHeaders() })
  const body = await response.json()
  if (!response.ok) return
  panel.value = body.panel
  if (typeof body.user?.alias === 'string' && body.user.alias) {
    myAlias.value = body.user.alias
    localStorage.setItem(ALIAS_STORAGE_KEY, body.user.alias)
  }
}

async function loadFriends(): Promise<void> {
  try {
    const response = await fetch(API.FRIENDS, { headers: sessionHeaders() })
    if (!response.ok) return
    const body = await response.json()
    pending.value = Array.isArray(body.pending) ? body.pending : []
    outgoing.value = Array.isArray(body.outgoing) ? body.outgoing : []
    accepted.value = Array.isArray(body.accepted) ? body.accepted : []
  } catch {
    pending.value = []
    outgoing.value = []
    accepted.value = []
  }
}

async function loadChats(): Promise<void> {
  try {
    const response = await fetch(API.CHATS, { headers: sessionHeaders() })
    if (!response.ok) return
    const body = await response.json()
    chats.value = Array.isArray(body.chats) ? body.chats : []
  } catch {
    chats.value = []
  }
}

async function requestFriend(): Promise<void> {
  error.value = ''
  const response = await fetch(API.FRIEND_REQUEST, {
    method: 'POST',
    headers: sessionHeaders(true),
    body: JSON.stringify({ alias: friendAlias.value }),
  })
  if (!response.ok) {
    const body = await response.json()
    error.value = body.detail ?? copy.failGeneric
    return
  }
  friendAlias.value = ''
  await loadFriends()
}

async function acceptFriend(id: string): Promise<void> {
  error.value = ''
  const response = await fetch(apiFriendAccept(id), {
    method: 'POST',
    headers: sessionHeaders(true),
    body: '{}',
  })
  if (!response.ok) {
    const body = await response.json()
    error.value = body.detail ?? copy.failGeneric
    return
  }
  await loadFriends()
}

async function blockFriend(id: string): Promise<void> {
  error.value = ''
  const response = await fetch(apiFriendBlock(id), {
    method: 'POST',
    headers: sessionHeaders(true),
    body: '{}',
  })
  if (!response.ok) {
    const body = await response.json()
    error.value = body.detail ?? copy.failGeneric
    return
  }
  await loadFriends()
}

async function openChat(id: string): Promise<void> {
  activeChatId.value = id
  const response = await fetch(apiChatMessages(id), { headers: sessionHeaders() })
  if (!response.ok) return
  const body = await response.json()
  messages.value = Array.isArray(body.messages) ? body.messages : []
}

async function startChat(peerUserId: string): Promise<void> {
  error.value = ''
  const response = await fetch(API.CHATS, {
    method: 'POST',
    headers: sessionHeaders(true),
    body: JSON.stringify({ peerUserId }),
  })
  const body = await response.json()
  if (!response.ok) {
    error.value = body.detail ?? copy.failGeneric
    return
  }
  await loadChats()
  if (typeof body.chatId === 'string') await openChat(body.chatId)
}

async function sendChat(): Promise<void> {
  if (!activeChatId.value) return
  error.value = ''
  const response = await fetch(apiChatMessages(activeChatId.value), {
    method: 'POST',
    headers: sessionHeaders(true),
    body: JSON.stringify({
      body: chatDraft.value,
      photoSrc: chatPhoto.value.trim() || undefined,
      voiceSrc: chatVoice.value.trim() || undefined,
    }),
  })
  if (!response.ok) {
    const body = await response.json()
    error.value = body.detail ?? copy.failGeneric
    return
  }
  chatDraft.value = ''
  chatPhoto.value = ''
  chatVoice.value = ''
  await openChat(activeChatId.value)
}

function ticketOutingId(ticket: TicketRow): string {
  if (typeof ticket.outingId === 'string' && ticket.outingId) return ticket.outingId
  if (typeof ticket.outing_id === 'string' && ticket.outing_id) return ticket.outing_id
  return ''
}

function openOutingThread(ticket: TicketRow): void {
  outingThreadId.value = ticketOutingId(ticket)
}

function messageBody(line: ChatLine): string {
  if (line.body) return line.body
  if (line.photoSrc) return copy.photoFallback
  if (line.voiceSrc) return copy.voiceFallback
  return ''
}

function chatLabel(row: ChatRow): string {
  return row.title || row.peerAlias || row.kind
}

async function saveVisibility(): Promise<void> {
  error.value = ''
  const response = await fetch(API.ME_VISIBILITY, {
    method: 'POST',
    headers: sessionHeaders(true),
    body: JSON.stringify({ isPublic: profilePublic.value }),
  })
  if (!response.ok) {
    const body = await response.json()
    error.value = body.detail ?? copy.failGeneric
  }
}

function logout(): void {
  sessionId.value = ''
  myAlias.value = ''
  panel.value = null
  pending.value = []
  outgoing.value = []
  accepted.value = []
  chats.value = []
  messages.value = []
  activeChatId.value = ''
  outingThreadId.value = ''
  localStorage.removeItem(SESSION_STORAGE_KEY)
  localStorage.removeItem(ALIAS_STORAGE_KEY)
}
</script>

<template>
  <article class="paola-page">
    <h1 class="paola-afiche__title type-display">{{ copy.title }}</h1>
    <p class="paola-page__copy paola-page__copy--muted">{{ copy.lead }}</p>
    <DualChannel />
    <p class="paola-page__copy">
      <router-link class="cuenta-legal" :to="privacyPath">{{ legal.checkboxLink }}</router-link>
      ·
      <router-link class="cuenta-legal" :to="APP_PATHS.FEED">{{ copy.feed }}</router-link>
    </p>
    <Alert v-if="error" tone="bad">{{ error }}</Alert>

    <section v-if="!panel" class="cuenta-grid">
      <form class="cuenta-card" @submit.prevent="register">
        <h2 class="paola-page__heading type-display">{{ copy.register }}</h2>
        <PrivacyCheck
          v-model="privacyAccepted"
          :label="legal.checkboxLabel"
          :to="privacyPath"
          :link-label="legal.checkboxLink"
        />
        <Field label="Correo"><Input v-model="email" type="email" /></Field>
        <Field label="Alias"><Input v-model="alias" /></Field>
        <Field label="Clave"><Input v-model="password" type="password" /></Field>
        <Button type="submit" :disabled="!privacyAccepted">Crear cuenta</Button>
      </form>
      <form class="cuenta-card" @submit.prevent="login">
        <h2 class="paola-page__heading type-display">{{ copy.login }}</h2>
        <Field label="Correo"><Input v-model="loginEmail" type="email" /></Field>
        <Field label="Clave"><Input v-model="loginPassword" type="password" /></Field>
        <Button type="submit">Iniciar sesión</Button>
      </form>
    </section>

    <section v-else class="cuenta-card">
      <h2 class="paola-page__heading type-display">{{ copy.panel }}</h2>
      <Button size="sm" variant="ghost" type="button" @click="logout">{{ copy.logout }}</Button>

      <h3 class="paola-page__heading">{{ copy.visibility }}</h3>
      <p class="paola-page__copy paola-page__copy--muted">{{ copy.visibilityLead }}</p>
      <Choice v-model="profilePublic" :label="copy.visibilityCta" />
      <Button size="sm" type="button" @click="saveVisibility">
        {{ profilePublic ? copy.visibilityCta : copy.visibilityOff }}
      </Button>

      <h3 class="paola-page__heading">{{ copy.tickets }}</h3>
      <ul v-if="panel.tickets.length" class="cuenta-list">
        <li v-for="ticket in panel.tickets" :key="ticket.id">
          {{ ticket.name }}
          <Button
            v-if="ticketOutingId(ticket)"
            size="sm"
            variant="ghost"
            type="button"
            @click="openOutingThread(ticket)"
          >
            {{ copy.outingThread }}
          </Button>
        </li>
      </ul>
      <OutingThreadBlock v-if="outingThreadId" :outing-id="outingThreadId" compact />
      <Empty v-else compact hide-cta :title="copy.ticketsEmptyTitle" :copy="copy.ticketsEmpty" :mascot-src="MASCOT.TUMBADA" />

      <h3 class="paola-page__heading">{{ copy.orders }}</h3>
      <ul v-if="panel.orders.length" class="cuenta-list">
        <li v-for="order in panel.orders" :key="order.id">
          {{ order.itemTitle ?? order.item_title }} · {{ order.status }}
        </li>
      </ul>
      <Empty v-else compact hide-cta :title="copy.ordersEmptyTitle" :copy="copy.ordersEmpty" :mascot-src="MASCOT.EN_PIE" />

      <h3 class="paola-page__heading">{{ copy.notices }}</h3>
      <ul v-if="panel.notifications.length" class="cuenta-list">
        <li v-for="note in panel.notifications" :key="note.id">{{ note.message }}</li>
      </ul>
      <p v-else class="paola-page__copy paola-page__copy--muted">{{ copy.noticesEmpty }}</p>

      <h3 class="paola-page__heading">{{ copy.friends }}</h3>
      <p class="paola-page__copy paola-page__copy--muted">{{ copy.friendsLead }}</p>
      <form class="cuenta-inline" @submit.prevent="requestFriend">
        <Field label="Alias"><Input v-model="friendAlias" :placeholder="copy.aliasPlaceholder" /></Field>
        <Button type="submit" size="sm">{{ copy.request }}</Button>
      </form>
      <h4 class="paola-page__heading">{{ copy.pending }}</h4>
      <ul v-if="pending.length" class="cuenta-list">
        <li v-for="row in pending" :key="row.id">
          {{ row.alias }}
          <Button size="sm" type="button" @click="acceptFriend(row.id)">{{ copy.accept }}</Button>
          <Button size="sm" variant="ghost" type="button" @click="blockFriend(row.id)">{{ copy.block }}</Button>
        </li>
      </ul>
      <p v-else class="paola-page__copy paola-page__copy--muted">{{ copy.pendingEmpty }}</p>
      <h4 class="paola-page__heading">{{ copy.outgoing }}</h4>
      <ul v-if="outgoing.length" class="cuenta-list">
        <li v-for="row in outgoing" :key="row.id">{{ row.alias }}</li>
      </ul>
      <ul v-if="accepted.length" class="cuenta-list">
        <li v-for="row in accepted" :key="row.id">
          <router-link class="cuenta-legal" :to="`${APP_PATHS.PARCERO}/${encodeURIComponent(row.alias)}`">{{ row.alias }}</router-link>
          <Button size="sm" variant="ghost" type="button" @click="startChat(row.userId)">{{ copy.chatOpen }}</Button>
        </li>
      </ul>
      <Empty v-else-if="!pending.length && !outgoing.length" compact hide-cta :title="copy.friends" :copy="copy.friendsEmpty" :mascot-src="MASCOT.TUMBADA" />

      <h3 class="paola-page__heading">{{ copy.chat }}</h3>
      <p class="paola-page__copy paola-page__copy--muted">{{ copy.chatLead }}</p>
      <ul v-if="chats.length" class="cuenta-list">
        <li v-for="row in chats" :key="row.id">
          <Button size="sm" variant="ghost" type="button" @click="openChat(row.id)">{{ chatLabel(row) }}</Button>
        </li>
      </ul>
      <p v-else class="paola-page__copy paola-page__copy--muted">{{ copy.chatEmpty }}</p>
      <div v-if="activeChatId" class="cuenta-chat">
        <ChatBubble
          v-for="line in messages"
          :key="line.id"
          :mine="line.authorAlias === myAlias"
          :body="line.body ?? messageBody(line)"
          :photo-src="line.photoSrc"
          :voice-src="line.voiceSrc"
          :pinned="line.pinned"
        />
        <form class="cuenta-inline" @submit.prevent="sendChat">
          <Field label="Mensaje"><Textarea v-model="chatDraft" /></Field>
          <Field :label="copy.photoUrl"><Input v-model="chatPhoto" /></Field>
          <Field :label="copy.voiceUrl"><Input v-model="chatVoice" /></Field>
          <Button type="submit" size="sm">{{ copy.chatSend }}</Button>
        </form>
      </div>

      <Alert tone="info">{{ copy.membership }}</Alert>
    </section>
  </article>
</template>

<style scoped>
.cuenta-grid { display: grid; gap: 16px; }
.cuenta-card { display: grid; gap: 12px; padding-top: 16px; border-top: 1px solid var(--paola-line); }
.cuenta-list { margin: 0; padding-left: 1.2rem; display: grid; gap: 6px; }
.cuenta-inline { display: grid; gap: 8px; }
.cuenta-chat { display: grid; gap: 8px; }
.cuenta-legal {
  color: var(--paola-cyan, #48b4fc);
  text-decoration: underline;
  text-underline-offset: 2px;
}
</style>
