<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { SESSION_STORAGE_KEY } from '@app/constants/cuenta.ts'
import { FEED_COPY } from '@app/constants/kit.ts'
import { SOCIAL_COPY } from '@app/constants/social.ts'
import { SOCIAL_LIMITS } from '@app/socialRules.ts'
import { parsePublicPost, type PublicPost } from '@app/parsePublicPost.ts'
import {
  API,
  APP_PATHS,
  JSON_HEADERS,
  SESSION_HEADER,
  apiCommunityFollow,
  apiCommunityJoin,
  apiCommunityPosts,
  apiPostHide,
  apiPostPin,
  apiPostReactions,
  appParcero,
} from '@shared/http/constants.ts'
import { MASCOT } from '@shared/ui/mascot.ts'
import Alert from '@ui/Alert.vue'
import Button from '@ui/Button.vue'
import CommunityCard from '@ui/CommunityCard.vue'
import DualChannel from '@ui/DualChannel.vue'
import Empty from '@ui/Empty.vue'
import FeedPost from '@ui/FeedPost.vue'
import Field from '@ui/Field.vue'
import Follow from '@ui/Follow.vue'
import Select from '@ui/Select.vue'
import Textarea from '@ui/Textarea.vue'
import VoiceBadge from '@ui/VoiceBadge.vue'

type Community = {
  id: string
  slug: string
  name: string
  description: string
  rules: string
  whatsappGroupHref?: string
}

const sessionId = ref(localStorage.getItem(SESSION_STORAGE_KEY) ?? '')
const communities = ref<readonly Community[]>([])
const feed = ref<readonly PublicPost[]>([])
const postBody = ref('')
const postPhotos = ref('')
const replyFor = ref('')
const replyBody = ref('')
const selectedCommunity = ref('')
const error = ref('')
const notice = ref('')

onMounted(async () => {
  await Promise.all([loadCommunities(), loadFeed()])
})

function sessionHeaders(json = false): Record<string, string> {
  return json
    ? { ...JSON_HEADERS, [SESSION_HEADER]: sessionId.value }
    : { [SESSION_HEADER]: sessionId.value }
}

async function loadCommunities(): Promise<void> {
  try {
    const body = await (await fetch(API.COMMUNITIES)).json()
    communities.value = Array.isArray(body.communities) ? body.communities : []
    if (!selectedCommunity.value && communities.value[0]) {
      selectedCommunity.value = communities.value[0].id
    }
  } catch {
    communities.value = []
  }
}

async function loadFeed(): Promise<void> {
  const headers: Record<string, string> = {}
  if (sessionId.value) headers[SESSION_HEADER] = sessionId.value
  try {
    const response = await fetch(API.FEED, { headers })
    if (!response.ok) return
    const body = await response.json()
    const posts = Array.isArray(body.posts) ? body.posts : []
    feed.value = posts
      .map((row: unknown) => parsePublicPost(row))
      .filter((item: PublicPost | null): item is PublicPost => item !== null)
  } catch {
    feed.value = []
  }
}

async function join(id: string): Promise<void> {
  error.value = ''
  if (!sessionId.value) {
    error.value = FEED_COPY.joinNeedAccount
    return
  }
  const response = await fetch(apiCommunityJoin(id), {
    method: 'POST',
    headers: sessionHeaders(true),
    body: '{}',
  })
  if (!response.ok) {
    error.value = FEED_COPY.joinFail
    return
  }
  notice.value = FEED_COPY.joined
  await loadFeed()
}

async function follow(id: string): Promise<void> {
  error.value = ''
  if (!sessionId.value) {
    error.value = FEED_COPY.followNeedAccount
    return
  }
  const response = await fetch(apiCommunityFollow(id), {
    method: 'POST',
    headers: sessionHeaders(true),
    body: '{}',
  })
  if (!response.ok) {
    error.value = FEED_COPY.followFail
    return
  }
  notice.value = FEED_COPY.followed
  await loadFeed()
}

async function publishPost(communityId: string, bodyText: string, parentId?: string, photosText = ''): Promise<boolean> {
  error.value = ''
  if (!sessionId.value) {
    error.value = 'Entra a tu cuenta para publicar.'
    return false
  }
  if (!communityId) return false
  const photos = photosText
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, SOCIAL_LIMITS.POST_PHOTOS_MAX)
  const response = await fetch(apiCommunityPosts(communityId), {
    method: 'POST',
    headers: sessionHeaders(true),
    body: JSON.stringify({
      body: bodyText,
      parentId,
      photos: photos.length ? photos : undefined,
    }),
  })
  if (!response.ok) {
    error.value = 'No se pudo publicar. Paola modera.'
    return false
  }
  return true
}

async function createPost(): Promise<void> {
  const ok = await publishPost(selectedCommunity.value, postBody.value, undefined, postPhotos.value)
  if (!ok) return
  postBody.value = ''
  postPhotos.value = ''
  await loadFeed()
}

async function sendReply(post: PublicPost): Promise<void> {
  const communityId = post.communityId ?? selectedCommunity.value
  const ok = await publishPost(communityId, replyBody.value, post.id)
  if (!ok) return
  replyBody.value = ''
  replyFor.value = ''
  await loadFeed()
}

async function react(postId: string, reaction: string): Promise<void> {
  if (!sessionId.value) {
    error.value = 'Entra a tu cuenta para reaccionar.'
    return
  }
  const response = await fetch(apiPostReactions(postId), {
    method: 'POST',
    headers: sessionHeaders(true),
    body: JSON.stringify({ reaction }),
  })
  if (!response.ok) {
    error.value = 'No se pudo reaccionar.'
    return
  }
  await loadFeed()
}

async function hidePost(id: string): Promise<void> {
  const response = await fetch(apiPostHide(id), {
    method: 'POST',
    headers: sessionHeaders(true),
    body: '{}',
  })
  if (!response.ok) {
    error.value = 'No se pudo ocultar.'
    return
  }
  await loadFeed()
}

async function pinPost(id: string): Promise<void> {
  const response = await fetch(apiPostPin(id), {
    method: 'POST',
    headers: sessionHeaders(true),
    body: '{}',
  })
  if (!response.ok) {
    error.value = 'No se pudo fijar.'
    return
  }
  await loadFeed()
}

async function sharePost(): Promise<void> {
  try {
    await navigator.clipboard.writeText(window.location.href)
    notice.value = 'Enlace copiado.'
  } catch {
    notice.value = 'No se pudo copiar. Copia el enlace a mano.'
  }
}

const communityOptions = () =>
  communities.value.map((item) => ({ value: item.id, label: item.name }))
</script>

<template>
  <article class="paola-page">
    <h1 class="paola-afiche__title type-display">{{ FEED_COPY.title }}</h1>
    <p class="paola-page__copy paola-page__copy--muted">{{ FEED_COPY.lead }}</p>
    <DualChannel />
    <p class="paola-page__copy">
      <router-link class="feed-legal" :to="APP_PATHS.CUENTA">Cuenta</router-link>
      ·
      <router-link class="feed-legal" :to="APP_PATHS.PARCHESE">Parchese</router-link>
    </p>
    <Alert v-if="error" tone="bad">{{ error }}</Alert>
    <Alert v-if="notice" tone="ok">{{ notice }}</Alert>

    <section class="feed-block">
      <VoiceBadge voice="loigca" />
      <h2 class="paola-page__heading type-display">Comunidades</h2>
      <div v-if="communities.length" class="feed-cards">
        <CommunityCard
          v-for="item in communities"
          :key="item.id"
          :title="item.name"
          :meta="item.rules"
        >
          <p class="paola-page__copy">{{ item.description }}</p>
          <template #actions>
            <Button size="sm" type="button" @click="join(item.id)">Unirme</Button>
            <Follow v-if="sessionId" @click="follow(item.id)" />
            <Button
              v-if="item.whatsappGroupHref"
              size="sm"
              variant="ghost"
              :href="item.whatsappGroupHref"
              target="_blank"
            >Grupo WhatsApp</Button>
          </template>
        </CommunityCard>
      </div>
      <Empty
        v-else
        compact
        hide-cta
        title="Sin comunidades"
        :copy="FEED_COPY.communitiesEmpty"
        :mascot-src="MASCOT.TUMBADA"
      />
    </section>

    <section v-if="communities.length && sessionId" class="feed-block">
      <h2 class="paola-page__heading type-display">Post</h2>
      <Field label="Comunidad">
        <Select v-model="selectedCommunity" :options="communityOptions()" />
      </Field>
      <Field label="Mensaje">
        <Textarea v-model="postBody" />
      </Field>
      <Field :label="SOCIAL_COPY.postPhotos">
        <Textarea v-model="postPhotos" />
      </Field>
      <Button type="button" @click="createPost">Publicar</Button>
    </section>

    <section class="feed-block">
      <VoiceBadge voice="incauta" />
      <h2 class="paola-page__heading type-display">Actividad</h2>
      <div v-if="feed.length" class="feed-cards">
        <FeedPost
          v-for="item in feed"
          :key="item.id"
          :author="item.authorAlias"
          :body="item.body"
          :meta="item.createdAt"
          :photos="item.photos"
          :photo-alt="SOCIAL_COPY.photoFallback"
          :highlighted="item.isHighlighted"
          :pinned="item.isPinned"
          :can-moderate="item.canModerate"
          :hide-label="SOCIAL_COPY.hide"
          :pin-label="SOCIAL_COPY.pin"
          @react="react(item.id, $event)"
          @share="sharePost"
          @hide="hidePost(item.id)"
          @pin="pinPost(item.id)"
        >
          <router-link class="feed-legal" :to="appParcero(item.authorAlias)">Ver parcero</router-link>
          <Button v-if="sessionId" size="sm" variant="ghost" type="button" @click="replyFor = item.id">
            {{ SOCIAL_COPY.reply }}
          </Button>
          <form v-if="replyFor === item.id" class="feed-actions" @submit.prevent="sendReply(item)">
            <Field :label="SOCIAL_COPY.replyPlaceholder"><Textarea v-model="replyBody" /></Field>
            <Button type="submit" size="sm">{{ SOCIAL_COPY.reply }}</Button>
          </form>
          <div v-if="item.replies.length" class="feed-replies">
            <FeedPost
              v-for="reply in item.replies"
              :key="reply.id"
              :author="reply.authorAlias"
              :body="reply.body"
              :meta="reply.createdAt"
              :photos="reply.photos"
              :photo-alt="SOCIAL_COPY.photoFallback"
              :can-moderate="reply.canModerate"
              :hide-label="SOCIAL_COPY.hide"
              :pin-label="SOCIAL_COPY.pin"
              @react="react(reply.id, $event)"
              @share="sharePost"
              @hide="hidePost(reply.id)"
              @pin="pinPost(reply.id)"
            >
              <Button v-if="sessionId" size="sm" variant="ghost" type="button" @click="replyFor = reply.id">
                {{ SOCIAL_COPY.reply }}
              </Button>
              <form v-if="replyFor === reply.id" class="feed-actions" @submit.prevent="sendReply(reply)">
                <Field :label="SOCIAL_COPY.replyPlaceholder"><Textarea v-model="replyBody" /></Field>
                <Button type="submit" size="sm">{{ SOCIAL_COPY.reply }}</Button>
              </form>
            </FeedPost>
          </div>
        </FeedPost>
      </div>
      <Empty
        v-else
        compact
        hide-cta
        :title="FEED_COPY.feedEmptyTitle"
        :copy="FEED_COPY.feedEmpty"
        :mascot-src="MASCOT.EN_PIE"
      />
    </section>
  </article>
</template>

<style scoped>
.feed-block,
.feed-cards,
.feed-actions {
  display: grid;
  gap: 12px;
}
.feed-block { padding-top: 24px; border-top: 1px solid var(--paola-line); }
.feed-legal {
  color: var(--paola-cyan, #48b4fc);
  text-decoration: underline;
  text-underline-offset: 2px;
}
.feed-replies {
  display: grid;
  gap: 8px;
  padding-left: 12px;
  border-left: 2px solid var(--paola-line);
}
</style>
