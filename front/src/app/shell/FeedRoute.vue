<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { SESSION_STORAGE_KEY } from '@app/constants/cuenta.ts'
import { FEED_COPY, FEED_HERO_PHOTO } from '@app/constants/kit.ts'
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
import { usePageReveal } from '@shared/motion/usePageReveal.ts'
import { MASCOT } from '@shared/ui/mascot.ts'
import AficheHero from '@ui/AficheHero.vue'
import Button from '@ui/Button.vue'
import CommunityCard from '@ui/CommunityCard.vue'
import Empty from '@ui/Empty.vue'
import FeedPost from '@ui/FeedPost.vue'
import Field from '@ui/Field.vue'
import Follow from '@ui/Follow.vue'
import Select from '@ui/Select.vue'
import Textarea from '@ui/Textarea.vue'
import { showToast } from '@ui/toast.ts'

type Community = {
  id: string
  slug: string
  name: string
  description: string
  rules: string
  whatsappGroupHref?: string
}

const copy = FEED_COPY
const bindReveal = usePageReveal()
const sessionId = ref(localStorage.getItem(SESSION_STORAGE_KEY) ?? '')
const communities = ref<readonly Community[]>([])
const feed = ref<readonly PublicPost[]>([])
const postBody = ref('')
const postPhotos = ref('')
const replyFor = ref('')
const replyBody = ref('')
const selectedCommunity = ref('')

onMounted(async () => {
  await Promise.all([loadCommunities(), loadFeed()])
})

function sessionHeaders(): Record<string, string> {
  return { ...JSON_HEADERS, [SESSION_HEADER]: sessionId.value }
}

function needAccount(message: string): boolean {
  if (sessionId.value) return false
  showToast(message, 'warn')
  return true
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

async function postAction(url: string, fail: string, body: Record<string, unknown> = {}): Promise<boolean> {
  const response = await fetch(url, { method: 'POST', headers: sessionHeaders(), body: JSON.stringify(body) })
  if (!response.ok) {
    showToast(fail, 'bad')
    return false
  }
  return true
}

async function join(id: string): Promise<void> {
  if (needAccount(copy.joinNeedAccount)) return
  if (!(await postAction(apiCommunityJoin(id), copy.joinFail))) return
  showToast(copy.joined, 'ok')
  await loadFeed()
}

async function follow(id: string): Promise<void> {
  if (needAccount(copy.followNeedAccount)) return
  if (!(await postAction(apiCommunityFollow(id), copy.followFail))) return
  showToast(copy.followed, 'ok')
  await loadFeed()
}

async function publishPost(communityId: string, bodyText: string, parentId?: string, photosText = ''): Promise<boolean> {
  if (needAccount(copy.postNeedAccount)) return false
  if (!communityId) return false
  const photos = photosText
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, SOCIAL_LIMITS.POST_PHOTOS_MAX)
  return postAction(apiCommunityPosts(communityId), copy.postFail, {
    body: bodyText,
    parentId,
    photos: photos.length ? photos : undefined,
  })
}

async function createPost(): Promise<void> {
  if (!(await publishPost(selectedCommunity.value, postBody.value, undefined, postPhotos.value))) return
  postBody.value = ''
  postPhotos.value = ''
  await loadFeed()
}

async function sendReply(post: PublicPost): Promise<void> {
  const communityId = post.communityId ?? selectedCommunity.value
  if (!(await publishPost(communityId, replyBody.value, post.id))) return
  replyBody.value = ''
  replyFor.value = ''
  await loadFeed()
}

async function react(postId: string, reaction: string): Promise<void> {
  if (needAccount(copy.reactNeedAccount)) return
  if (await postAction(apiPostReactions(postId), copy.reactFail, { reaction })) await loadFeed()
}

async function hidePost(id: string): Promise<void> {
  if (await postAction(apiPostHide(id), copy.hideFail)) await loadFeed()
}

async function pinPost(id: string): Promise<void> {
  if (await postAction(apiPostPin(id), copy.pinFail)) await loadFeed()
}

async function sharePost(): Promise<void> {
  try {
    await navigator.clipboard.writeText(window.location.href)
    showToast(copy.shareOk, 'ok')
  } catch {
    showToast(copy.shareFail, 'warn')
  }
}

const communityOptions = () =>
  communities.value.map((item) => ({ value: item.id, label: item.name }))
</script>

<template>
  <div :ref="bindReveal">
    <AficheHero :kicker="copy.kicker" :title="copy.title" :plate="copy.plate" :photo-src="FEED_HERO_PHOTO" data-reveal>
      <template #lead>{{ copy.lead }}</template>
      <template v-if="!sessionId" #actions>
        <Button variant="hero" :to="APP_PATHS.ENTRAR">{{ copy.accountCta }}</Button>
      </template>
    </AficheHero>

    <article class="paola-page paola-page--after-hero">
      <section v-if="communities.length && sessionId" class="feed-block" data-reveal>
        <header class="feed-block__head">
          <h2 class="paola-page__heading type-display">{{ copy.postHeading }}</h2>
          <p class="paola-page__copy paola-page__copy--muted">{{ copy.postLead }}</p>
        </header>
        <Field :label="copy.postCommunity">
          <Select v-model="selectedCommunity" :options="communityOptions()" />
        </Field>
        <Field :label="copy.postMessage">
          <Textarea v-model="postBody" />
        </Field>
        <Field :label="SOCIAL_COPY.postPhotos">
          <Textarea v-model="postPhotos" />
        </Field>
        <Button class="feed-block__submit" type="button" @click="createPost">{{ copy.postCta }}</Button>
      </section>

      <section class="feed-block" data-reveal>
        <h2 class="paola-page__heading type-display">{{ copy.activityHeading }}</h2>
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
            <router-link class="feed-link" :to="appParcero(item.authorAlias)">{{ copy.seeParcero }}</router-link>
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
          :title="copy.feedEmptyTitle"
          :copy="copy.feedEmpty"
          :mascot-src="MASCOT.EN_PIE"
        />
      </section>

      <section class="feed-block" data-reveal>
        <header class="feed-block__head">
          <h2 class="paola-page__heading type-display">{{ copy.communitiesHeading }}</h2>
          <p class="paola-page__copy paola-page__copy--muted">{{ copy.communitiesLead }}</p>
        </header>
        <div v-if="communities.length" class="feed-cards feed-cards--grid">
          <CommunityCard v-for="item in communities" :key="item.id" :title="item.name" :meta="item.rules">
            <p class="paola-page__copy">{{ item.description }}</p>
            <template #actions>
              <Button size="sm" type="button" @click="join(item.id)">{{ copy.joinCta }}</Button>
              <Follow v-if="sessionId" @click="follow(item.id)" />
              <Button v-if="item.whatsappGroupHref" size="sm" variant="ghost" :href="item.whatsappGroupHref" target="_blank">
                {{ copy.whatsappCta }}
              </Button>
            </template>
          </CommunityCard>
        </div>
        <Empty
          v-else
          compact
          hide-cta
          :title="copy.communitiesEmptyTitle"
          :copy="copy.communitiesEmpty"
          :mascot-src="MASCOT.TUMBADA"
        />
      </section>
    </article>
  </div>
</template>

<style scoped>
.feed-block,
.feed-cards,
.feed-actions {
  display: grid;
  gap: 16px;
}
.feed-block {
  padding-top: 32px;
}
.feed-block + .feed-block {
  border-top: 1px solid var(--paola-line);
}
.feed-block__head {
  display: grid;
  gap: 4px;
}
.feed-block__head > * {
  margin: 0;
}
.feed-block__submit {
  justify-self: start;
}
.feed-cards--grid {
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 20rem), 1fr));
}
.feed-link {
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
