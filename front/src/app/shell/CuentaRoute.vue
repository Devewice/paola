<script setup lang="ts">
import { computed, onMounted, provide, ref, watch } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { getAppDependencies } from '@app/bootstrap.ts'
import { CUENTA_COPY, CUENTA_FIGURE, CUENTA_NAV, CUENTA_NAV_COPY } from '@app/constants/cuenta.ts'
import {
  CUENTA_CONTEXT,
  type FriendRow,
  type PanelData,
} from '@app/shell/cuenta/context.ts'
import { useCuentaAccount } from '@app/shell/cuenta/useCuentaAccount.ts'
import { appSession, clearSession, rememberAlias } from '@app/shell/session.ts'
import { useOperarAccess } from '@app/shell/useOperarAccess.ts'
import { API, APP_PATHS, JSON_HEADERS, SESSION_HEADER } from '@shared/http/constants.ts'
import { usePageReveal } from '@shared/motion/usePageReveal.ts'
import Button from '@ui/Button.vue'
import SectionTabs from '@ui/SectionTabs.vue'

const copy = CUENTA_COPY
const bindReveal = usePageReveal()
const router = useRouter()
const operar = useOperarAccess()

const sessionId = ref(appSession.sessionId.value)
const myAlias = ref(appSession.alias.value)
const account = useCuentaAccount(sessionId)
const accountProfile = account.profile
const panel = ref<PanelData | null>(null)
const loading = ref(true)
const pending = ref<FriendRow[]>([])
const outgoing = ref<FriendRow[]>([])
const accepted = ref<FriendRow[]>([])
const rideVotes = ref<ReadonlyMap<string, number>>(new Map())

const heroName = computed(() => accountProfile.value?.alias || myAlias.value || copy.title)
const heroStats = computed(() => [
  { value: panel.value?.tickets.length ?? 0, label: CUENTA_NAV_COPY.rides, to: APP_PATHS.CUENTA_RODADAS },
  { value: panel.value?.orders.length ?? 0, label: CUENTA_NAV_COPY.orders, to: APP_PATHS.CUENTA_PEDIDOS },
  { value: accepted.value.length, label: CUENTA_NAV_COPY.friends, to: APP_PATHS.CUENTA_AMIGOS },
  { value: account.motorcycles.value.length, label: copy.motorcycles, to: APP_PATHS.CUENTA },
])

watch(accountProfile, (profile) => {
  if (!profile?.alias || profile.alias === myAlias.value) return
  myAlias.value = profile.alias
  rememberAlias(profile.alias)
})

function sessionHeaders(json = false): Record<string, string> {
  return json
    ? { ...JSON_HEADERS, [SESSION_HEADER]: sessionId.value }
    : { [SESSION_HEADER]: sessionId.value }
}

async function loadPanel(): Promise<void> {
  try {
    const response = await fetch(API.ME_PANEL, { headers: sessionHeaders() })
    const body = (await response.json().catch(() => ({}))) as Record<string, unknown>
    if (!response.ok) return
    panel.value = body.panel as PanelData
    const user = body.user as { alias?: string } | undefined
    if (typeof user?.alias === 'string' && user.alias) {
      myAlias.value = user.alias
      rememberAlias(user.alias)
    }
  } catch {
    /* panel vacío */
  }
}

async function reloadFriends(): Promise<void> {
  try {
    const response = await fetch(API.FRIENDS, { headers: sessionHeaders() })
    if (!response.ok) return
    const body = (await response.json()) as Record<string, unknown>
    pending.value = Array.isArray(body.pending) ? (body.pending as FriendRow[]) : []
    outgoing.value = Array.isArray(body.outgoing) ? (body.outgoing as FriendRow[]) : []
    accepted.value = Array.isArray(body.accepted) ? (body.accepted as FriendRow[]) : []
  } catch {
    pending.value = []
    outgoing.value = []
    accepted.value = []
  }
}

async function loadRideVotes(): Promise<void> {
  const result = await getAppDependencies().polls.list()
  if (!result.ok) return
  const counts = new Map<string, number>()
  for (const poll of result.value) {
    if (!poll.outingId || !poll.isInscribed || !poll.isOpen || poll.hasVoted) continue
    counts.set(poll.outingId, (counts.get(poll.outingId) ?? 0) + 1)
  }
  rideVotes.value = counts
}

function logout(): void {
  clearSession()
  sessionId.value = ''
  panel.value = null
  void router.push(APP_PATHS.ENTRAR)
}

provide(CUENTA_CONTEXT, {
  sessionId,
  myAlias,
  account,
  panel,
  pending,
  outgoing,
  accepted,
  rideVotes,
  sessionHeaders,
  reloadFriends,
  reloadPanel: loadPanel,
  logout,
})

onMounted(async () => {
  if (!sessionId.value) {
    await router.replace({ path: APP_PATHS.ENTRAR, query: { next: router.currentRoute.value.fullPath } })
    return
  }
  await Promise.all([
    loadPanel(),
    reloadFriends(),
    loadRideVotes(),
    account.load(),
    account.loadCatalog(),
  ])
  loading.value = false
})
</script>

<template>
  <div :ref="bindReveal" class="cuenta-screen">
    <div class="wrap cuenta-screen__body">
      <section v-if="!loading && !panel" class="cuenta-screen__gate stack" data-reveal>
        <p class="paola-page__copy">{{ copy.needLogin }}</p>
        <Button :to="APP_PATHS.ENTRAR">{{ copy.goLogin }}</Button>
      </section>

      <template v-else-if="panel">
        <header class="poster poster--navy poster--profile has-mascot" data-reveal>
          <img class="poster__mascot" :src="CUENTA_FIGURE" alt="" aria-hidden="true" loading="lazy" />
          <span class="poster-avatar" aria-hidden="true">{{ heroName.charAt(0).toUpperCase() }}</span>
          <div class="poster__copy">
            <span class="board-kicker">{{ copy.profileMeta }}</span>
            <h1 class="type-brush-dry type-brush-dry--xs">{{ heroName }}</h1>
            <dl class="hub-stats hub-stats--dl">
              <div v-for="item in heroStats" :key="item.label" class="hub-stat cuenta-screen__stat">
                <dt><span>{{ item.label }}</span></dt>
                <dd>
                  <RouterLink :to="item.to" class="cuenta-screen__stat-link"><strong>{{ item.value }}</strong></RouterLink>
                </dd>
              </div>
            </dl>
            <div v-if="operar.gate.value === 'ready'" class="cuenta-screen__actions row">
              <Button size="sm" variant="dark" :to="APP_PATHS.ADMIN">{{ copy.adminPanel }}</Button>
            </div>
          </div>
        </header>

        <main class="board-shell cuenta-screen__shell">
          <SectionTabs :label="CUENTA_NAV_COPY.aria" :items="CUENTA_NAV" />
          <RouterView />
        </main>
      </template>
    </div>
  </div>
</template>

<style scoped>
.cuenta-screen__body {
  padding-top: 24px;
  padding-bottom: 32px;
  display: grid;
  gap: 20px;
}

.cuenta-screen__stat {
  position: relative;
  border-radius: 10px;
  transition: background 160ms ease;
}

.cuenta-screen__stat:hover,
.cuenta-screen__stat:focus-within {
  background: rgba(0, 136, 248, 0.14);
}

.cuenta-screen__stat-link {
  color: inherit;
  text-decoration: none;
}

.cuenta-screen__stat-link::after {
  content: '';
  position: absolute;
  inset: 0;
}

.cuenta-screen__actions {
  flex-wrap: wrap;
  gap: 8px;
}

.cuenta-screen__shell {
  padding: 0;
  display: grid;
  gap: 20px;
  min-width: 0;
}

@media (max-width: 639px) {
  .cuenta-screen__body {
    padding-top: 16px;
    padding-bottom: 24px;
    gap: 16px;
  }
}
</style>
