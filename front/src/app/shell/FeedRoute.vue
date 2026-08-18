<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { API, JSON_HEADERS } from '@shared/http/constants.ts'
import PaolaButton from '@ui/PaolaButton.vue'
import PaolaField from '@ui/PaolaField.vue'
import PaolaInput from '@ui/PaolaInput.vue'
import PaolaTextarea from '@ui/PaolaTextarea.vue'

type Community = { id: string; slug: string; name: string; description: string; rules: string; whatsappGroupHref?: string }
type Post = { id: string; communityId: string; authorAlias: string; body: string; createdAt: string }

const sessionId = ref(localStorage.getItem('paola_session_id') ?? '')
const communities = ref<readonly Community[]>([])
const feed = ref<readonly Post[]>([])
const name = ref('')
const description = ref('')
const rules = ref('')
const postBody = ref('')
const selectedCommunity = ref('')

onMounted(async () => {
  await Promise.all([loadCommunities(), loadFeed()])
})

async function loadCommunities(): Promise<void> {
  const body = await (await fetch(API.COMMUNITIES)).json()
  communities.value = Array.isArray(body.communities) ? body.communities : []
}

async function loadFeed(): Promise<void> {
  const response = await fetch(API.FEED, { headers: { 'x-session-id': sessionId.value } })
  if (!response.ok) return
  const body = await response.json()
  feed.value = Array.isArray(body.posts) ? body.posts : []
}

async function createCommunity(): Promise<void> {
  await fetch(API.COMMUNITIES, {
    method: 'POST',
    headers: { ...JSON_HEADERS, 'x-session-id': sessionId.value },
    body: JSON.stringify({ name: name.value, description: description.value, rules: rules.value }),
  })
  name.value = ''
  description.value = ''
  rules.value = ''
  await loadCommunities()
}

async function createPost(): Promise<void> {
  if (!selectedCommunity.value) return
  await fetch(`${API.COMMUNITIES}/${encodeURIComponent(selectedCommunity.value)}/posts`, {
    method: 'POST',
    headers: { ...JSON_HEADERS, 'x-session-id': sessionId.value },
    body: JSON.stringify({ body: postBody.value }),
  })
  postBody.value = ''
  await loadFeed()
}
</script>

<template>
  <article class="paola-page">
    <h1 class="paola-afiche__title type-display">Feed del parche</h1>
    <p class="paola-page__copy paola-page__copy--muted">Canal web + WhatsApp en paralelo: memoria en web, calor en WA.</p>

    <section class="feed-block">
      <h2 class="paola-page__heading type-display">Comunidades persistentes</h2>
      <form class="feed-form" @submit.prevent="createCommunity">
        <PaolaField label="Nombre"><PaolaInput v-model="name" /></PaolaField>
        <PaolaField label="Descripción"><PaolaTextarea v-model="description" /></PaolaField>
        <PaolaField label="Reglas"><PaolaTextarea v-model="rules" /></PaolaField>
        <PaolaButton type="submit">Crear comunidad</PaolaButton>
      </form>
      <ul class="feed-list">
        <li v-for="item in communities" :key="item.id">{{ item.name }} · {{ item.description }}</li>
      </ul>
    </section>

    <section class="feed-block">
      <h2 class="paola-page__heading type-display">Post en comunidad</h2>
      <PaolaField label="Comunidad (ID)">
        <PaolaInput v-model="selectedCommunity" placeholder="Pega el ID de comunidad" />
      </PaolaField>
      <PaolaField label="Mensaje">
        <PaolaTextarea v-model="postBody" />
      </PaolaField>
      <PaolaButton @click="createPost">Publicar post</PaolaButton>
    </section>

    <section class="feed-block">
      <h2 class="paola-page__heading type-display">Actividad</h2>
      <ul class="feed-list">
        <li v-for="item in feed" :key="item.id">
          <strong>{{ item.authorAlias }}</strong> · {{ item.body }} · {{ item.createdAt }}
        </li>
      </ul>
    </section>
  </article>
</template>

<style scoped>
.feed-block { padding-top: 24px; border-top: 1px solid var(--paola-line); display: grid; gap: 12px; }
.feed-form, .feed-list { display: grid; gap: 8px; }
.feed-list { margin: 0; padding-left: 1.2rem; }
</style>
