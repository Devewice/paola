<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { PARCERO_COPY, SESSION_STORAGE_KEY } from '@app/constants/cuenta.ts'
import { parsePublicParcero, type PublicParcero } from '@app/parsePublicParcero.ts'
import { API, APP_PATHS, JSON_HEADERS, SESSION_HEADER, apiParcero, apiUserFollow } from '@shared/http/constants.ts'
import { usePageReveal } from '@shared/motion/usePageReveal.ts'
import AficheHero from '@ui/AficheHero.vue'
import Button from '@ui/Button.vue'
import Follow from '@ui/Follow.vue'
import MemberCard from '@ui/MemberCard.vue'
import PageVacant from '@ui/PageVacant.vue'
import { showToast } from '@ui/toast.ts'

const route = useRoute()
const copy = PARCERO_COPY
const bindReveal = usePageReveal()
const parcero = ref<PublicParcero | null>(null)
const status = ref<'loading' | 'ok' | 'hidden'>('loading')
const sessionId = ref(typeof localStorage !== 'undefined' ? (localStorage.getItem(SESSION_STORAGE_KEY) ?? '') : '')
const alias = computed(() => String(route.params.alias ?? ''))

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

    <article v-if="parcero" class="paola-page paola-page--after-hero">
      <section class="parcero-card" data-reveal>
        <MemberCard :alias="parcero.alias" :photo-src="parcero.avatarSrc" :moto="parcero.moto" />
        <dl class="parcero-stats">
          <div>
            <dt>{{ copy.km }}</dt>
            <dd>{{ parcero.km || '—' }}</dd>
          </div>
          <div v-if="parcero.moto">
            <dt>{{ copy.moto }}</dt>
            <dd>{{ parcero.moto }}</dd>
          </div>
        </dl>
        <div class="parcero-actions">
          <Follow @click="follow" />
          <Button size="sm" type="button" @click="requestFriend">{{ copy.friend }}</Button>
          <Button size="sm" variant="ghost" :to="APP_PATHS.FEED">{{ copy.feedCta }}</Button>
        </div>
        <p class="paola-page__copy paola-page__copy--muted">{{ copy.memberNote }}</p>
      </section>
    </article>
  </div>
</template>

<style scoped>
.parcero-card {
  display: grid;
  gap: 24px;
  max-width: 40rem;
}
.parcero-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
  margin: 0;
}
.parcero-stats dt {
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--paola-muted, #8b9bb0);
}
.parcero-stats dd {
  margin: 4px 0 0;
  font-family: var(--display, 'Oswald', sans-serif);
  font-size: 28px;
}
.parcero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.parcero-actions + p {
  margin: 0;
}
</style>
