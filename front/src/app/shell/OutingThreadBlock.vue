<script setup lang="ts">
import { ref } from 'vue'
import { ALIAS_STORAGE_KEY, SESSION_STORAGE_KEY } from '@app/constants/cuenta.ts'
import { SOCIAL_COPY } from '@app/constants/social.ts'
import {
  JSON_HEADERS,
  SESSION_HEADER,
  apiOutingChat,
  apiOutingChatMessages,
} from '@shared/http/constants.ts'
import Alert from '@ui/Alert.vue'
import Button from '@ui/Button.vue'
import ChatBubble from '@ui/ChatBubble.vue'
import DualChannel from '@ui/DualChannel.vue'
import Field from '@ui/Field.vue'
import Input from '@ui/Input.vue'
import Textarea from '@ui/Textarea.vue'

type ChatLine = {
  id: string
  authorAlias: string
  body?: string
  photoSrc?: string
  voiceSrc?: string
  pinned?: boolean
}

const props = defineProps<{
  outingId: string
  compact?: boolean
}>()

const copy = SOCIAL_COPY
const sessionId = ref(localStorage.getItem(SESSION_STORAGE_KEY) ?? '')
const open = ref(false)
const loading = ref(false)
const error = ref('')
const outingTitle = ref('')
const readOnly = ref(false)
const messages = ref<ChatLine[]>([])
const draft = ref('')
const photoSrc = ref('')
const voiceSrc = ref('')
const myAlias = ref(localStorage.getItem(ALIAS_STORAGE_KEY) ?? '')

function headers(json = false): Record<string, string> {
  return json
    ? { ...JSON_HEADERS, [SESSION_HEADER]: sessionId.value }
    : { [SESSION_HEADER]: sessionId.value }
}

async function load(): Promise<void> {
  if (!sessionId.value) return
  loading.value = true
  error.value = ''
  try {
    const response = await fetch(apiOutingChat(props.outingId), { headers: headers() })
    const body = (await response.json()) as Record<string, unknown>
    if (!response.ok) {
      error.value = typeof body.detail === 'string' ? body.detail : copy.outingThreadForbidden
      return
    }
    outingTitle.value = typeof body.outingTitle === 'string' ? body.outingTitle : ''
    readOnly.value = body.readOnly === true
    messages.value = Array.isArray(body.messages) ? (body.messages as ChatLine[]) : []
    open.value = true
  } catch {
    error.value = copy.outingThreadForbidden
  } finally {
    loading.value = false
  }
}

async function send(): Promise<void> {
  if (!sessionId.value || readOnly.value) return
  error.value = ''
  const response = await fetch(apiOutingChatMessages(props.outingId), {
    method: 'POST',
    headers: headers(true),
    body: JSON.stringify({
      body: draft.value,
      photoSrc: photoSrc.value.trim() || undefined,
      voiceSrc: voiceSrc.value.trim() || undefined,
    }),
  })
  const body = (await response.json()) as Record<string, unknown>
  if (!response.ok) {
    error.value = typeof body.detail === 'string' ? body.detail : copy.outingThreadForbidden
    return
  }
  draft.value = ''
  photoSrc.value = ''
  voiceSrc.value = ''
  await load()
}
</script>

<template>
  <div v-if="sessionId" class="outing-thread">
    <p class="paola-page__copy paola-page__copy--muted">{{ copy.outingThreadLead }}</p>
    <Button size="sm" variant="ghost" type="button" :disabled="loading" @click="load">
      {{ copy.outingThread }}
    </Button>
    <Alert v-if="error" tone="bad">{{ error }}</Alert>
    <div v-if="open" class="outing-thread__box">
      <p v-if="outingTitle" class="paola-empty__kicker">{{ outingTitle }}</p>
      <Alert v-if="readOnly" tone="info">{{ copy.outingReadOnly }}</Alert>
      <ChatBubble
        v-for="line in messages"
        :key="line.id"
        :mine="line.authorAlias === myAlias"
        :body="line.body"
        :photo-src="line.photoSrc"
        :voice-src="line.voiceSrc"
        :pinned="line.pinned"
      />
      <p v-if="!messages.length" class="paola-page__copy paola-page__copy--muted">{{ copy.outingThreadEmpty }}</p>
      <form v-if="!readOnly" class="outing-thread__form" @submit.prevent="send">
        <Field label="Mensaje"><Textarea v-model="draft" /></Field>
        <Field :label="copy.photoUrl"><Input v-model="photoSrc" /></Field>
        <Field :label="copy.voiceUrl"><Input v-model="voiceSrc" /></Field>
        <Button type="submit" size="sm">{{ copy.outingSend }}</Button>
      </form>
      <DualChannel v-if="!compact" />
    </div>
  </div>
</template>

<style scoped>
.outing-thread,
.outing-thread__box,
.outing-thread__form {
  display: grid;
  gap: 8px;
}
.outing-thread__box {
  padding-top: 8px;
}
</style>
