<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { PARCERO_COPY, PARCERO_FIGURE, SESSION_STORAGE_KEY } from '@app/constants/cuenta.ts'
import { parsePublicParcero, type PublicParcero } from '@app/parsePublicParcero.ts'
import { API, APP_PATHS, JSON_HEADERS, SESSION_HEADER, apiParcero, apiUserFollow } from '@shared/http/constants.ts'
import { usePageReveal } from '@shared/motion/usePageReveal.ts'
import AficheHero from '@ui/AficheHero.vue'
import Button from '@ui/Button.vue'
import Follow from '@ui/Follow.vue'
import PageVacant from '@ui/PageVacant.vue'
import { showToast } from '@ui/toast.ts'

const route = useRoute()
const copy = PARCERO_COPY
const bindReveal = usePageReveal()
const parcero = ref<PublicParcero | null>(null)
const status = ref<'loading' | 'ok' | 'hidden'>('loading')
const sessionId = ref(typeof localStorage !== 'undefined' ? (localStorage.getItem(SESSION_STORAGE_KEY) ?? '') : '')
const alias = computed(() => String(route.params.alias ?? ''))
const initial = computed(() => (parcero.value?.alias ?? alias.value).trim().charAt(0).toUpperCase() || '?')

onMounted(() => {
  void load()
})

watch(alias, () => {
  void load()
})

async function load(): Promise<void> {
  status.value = 'loading'
  parcero.value = null
  if (!alias.value) {
    status.value = 'hidden'
    return
  }
  try {
    const response = await fetch(apiParcero(alias.value))
    const body = await response.json()
    const parsed = response.ok ? parsePublicParcero(body.parcero) : null
    parcero.value = parsed
    status.value = parsed ? 'ok' : 'hidden'
  } catch {
    status.value = 'hidden'
  }
}

async function post(url: string, body: Record<string, unknown>, fail: string, ok: string): Promise<void> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { ...JSON_HEADERS, [SESSION_HEADER]: sessionId.value },
    body: JSON.stringify(body),
  })
  if (!response.ok) {
    const detail = await response.json().catch(() => ({}))
    showToast(typeof detail.detail === 'string' ? detail.detail : fail, 'bad')
    return
  }
  showToast(ok, 'ok')
}

async function follow(): Promise<void> {
  if (!parcero.value) return
  if (!sessionId.value) {
    showToast(copy.followNeedAccount, 'warn')
    return
  }
  await post(apiUserFollow(parcero.value.id), {}, copy.followFail, copy.followed)
}

async function requestFriend(): Promise<void> {
  if (!parcero.value) return
  if (!sessionId.value) {
    showToast(copy.friendNeedAccount, 'warn')
    return
  }
  await post(API.FRIEND_REQUEST, { receiverId: parcero.value.id }, copy.friendFail, copy.friendSent)
}
</script>

<template>
  <PageVacant v-if="status === 'hidden'" :title="copy.hiddenTitle" :kicker="copy.kicker" :copy="copy.hidden" />

  <div v-else :ref="bindReveal">
    <AficheHero :kicker="copy.kicker" :title="parcero?.alias ?? alias" :plate="parcero?.moto" data-reveal>
      <template #lead>{{ status === 'loading' ? copy.loading : copy.lead }}</template>
    </AficheHero>

    <main v-if="parcero" class="wrap board-shell board">
      <section class="poster poster--armargura poster--profile has-mascot" :aria-label="parcero.alias" data-reveal>
        <img class="poster__mascot" :src="PARCERO_FIGURE" alt="" aria-hidden="true" loading="lazy" />
        <img
          v-if="parcero.avatarSrc"
          class="poster-avatar"
          :src="parcero.avatarSrc"
          :alt="parcero.alias"
          width="128"
          height="128"
        />
        <span v-else class="poster-avatar" aria-hidden="true">{{ initial }}</span>
        <div class="poster__copy">
          <span class="board-kicker">{{ copy.kicker }}</span>
          <h2 class="type-brush-dry type-brush-dry--xs">{{ parcero.alias }}</h2>
          <dl class="hub-stats hub-stats--dl">
            <div class="hub-stat">
              <dt><span>{{ copy.km }}</span></dt>
              <dd><strong>{{ parcero.km || '—' }}</strong></dd>
            </div>
            <div v-if="parcero.moto" class="hub-stat">
              <dt><span>{{ copy.moto }}</span></dt>
              <dd><strong class="parcero-stats__moto">{{ parcero.moto }}</strong></dd>
            </div>
          </dl>
          <div class="parcero-actions">
            <Follow @click="follow" />
            <Button size="sm" type="button" @click="requestFriend">{{ copy.friend }}</Button>
            <Button size="sm" variant="ghost" :to="APP_PATHS.FEED">{{ copy.feedCta }}</Button>
          </div>
        </div>
      </section>
      <p class="meta-text parcero-note">{{ copy.memberNote }}</p>
    </main>
  </div>
</template>

<style scoped>
.parcero-stats__moto {
  overflow-wrap: anywhere;
}
.parcero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.parcero-note {
  margin: 0;
}
</style>
