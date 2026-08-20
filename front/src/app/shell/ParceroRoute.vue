<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { PARCERO_COPY, SESSION_STORAGE_KEY } from '@app/constants/cuenta.ts'
import { parsePublicParcero, type PublicParcero } from '@app/parsePublicParcero.ts'
import {
  API,
  APP_PATHS,
  JSON_HEADERS,
  SESSION_HEADER,
  apiParcero,
  apiUserFollow,
} from '@shared/http/constants.ts'
import { MASCOT } from '@shared/ui/mascot.ts'
import Alert from '@ui/Alert.vue'
import Button from '@ui/Button.vue'
import Empty from '@ui/Empty.vue'
import Follow from '@ui/Follow.vue'
import MemberCard from '@ui/MemberCard.vue'
import VoiceBadge from '@ui/VoiceBadge.vue'

const route = useRoute()
const copy = PARCERO_COPY
const parcero = ref<PublicParcero | null>(null)
const error = ref('')
const notice = ref('')
const sessionId = ref(typeof localStorage !== 'undefined' ? localStorage.getItem(SESSION_STORAGE_KEY) ?? '' : '')
const alias = computed(() => String(route.params.alias ?? ''))

onMounted(async () => {
  await load()
})

watch(alias, () => {
  void load()
})

async function load(): Promise<void> {
  error.value = ''
  parcero.value = null
  if (!alias.value) {
    error.value = copy.hidden
    return
  }
  try {
    const response = await fetch(apiParcero(alias.value))
    const body = await response.json()
    if (!response.ok) {
      error.value = typeof body.detail === 'string' ? body.detail : copy.hidden
      return
    }
    const parsed = parsePublicParcero(body.parcero)
    if (!parsed) {
      error.value = copy.hidden
      return
    }
    parcero.value = parsed
  } catch {
    error.value = copy.hidden
  }
}

async function follow(): Promise<void> {
  if (!parcero.value || !sessionId.value) {
    error.value = copy.followNeedAccount
    return
  }
  const response = await fetch(apiUserFollow(parcero.value.id), {
    method: 'POST',
    headers: { ...JSON_HEADERS, [SESSION_HEADER]: sessionId.value },
    body: '{}',
  })
  if (!response.ok) {
    error.value = 'No se pudo seguir.'
    return
  }
  notice.value = copy.followed
}

async function requestFriend(): Promise<void> {
  if (!parcero.value || !sessionId.value) {
    error.value = copy.friendNeedAccount
    return
  }
  const response = await fetch(API.FRIEND_REQUEST, {
    method: 'POST',
    headers: { ...JSON_HEADERS, [SESSION_HEADER]: sessionId.value },
    body: JSON.stringify({ receiverId: parcero.value.id }),
  })
  if (!response.ok) {
    const body = await response.json()
    error.value = body.detail ?? 'No se pudo agregar amigo.'
    return
  }
  notice.value = copy.friendSent
}
</script>

<template>
  <article class="paola-page">
    <VoiceBadge voice="incauta" />
    <h1 class="paola-afiche__title type-display">{{ copy.title }}</h1>
    <p class="paola-page__copy paola-page__copy--muted">{{ copy.lead }}</p>
    <p class="paola-page__copy">
      <router-link class="parcero-link" :to="APP_PATHS.CUENTA">Cuenta</router-link>
      ·
      <router-link class="parcero-link" :to="APP_PATHS.FEED">Feed</router-link>
    </p>
    <Alert v-if="error" tone="bad">{{ error }}</Alert>
    <Alert v-if="notice" tone="ok">{{ notice }}</Alert>

    <MemberCard
      v-if="parcero"
      :alias="parcero.alias"
      :photo-src="parcero.avatarSrc"
      :moto="parcero.moto"
    />
    <p v-if="parcero" class="paola-page__copy paola-page__copy--muted">
      {{ copy.km }}: {{ parcero.km || '—' }}
    </p>
    <div v-if="parcero" class="parcero-actions">
      <Follow @click="follow" />
      <Button size="sm" type="button" @click="requestFriend">{{ copy.friend }}</Button>
    </div>
    <p v-if="parcero" class="paola-page__copy paola-page__copy--muted">{{ copy.memberNote }}</p>
    <Empty
      v-else-if="!error"
      compact
      hide-cta
      :title="copy.title"
      :copy="copy.hidden"
      :mascot-src="MASCOT.TUMBADA"
    />
  </article>
</template>

<style scoped>
.parcero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.parcero-link {
  color: var(--paola-cyan, #48b4fc);
  text-decoration: underline;
  text-underline-offset: 2px;
}
</style>
