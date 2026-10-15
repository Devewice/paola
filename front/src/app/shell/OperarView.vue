<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { getAppDependencies, refreshInventory } from '@app/bootstrap.ts'
import AuthWizard from '@app/shell/AuthWizard.vue'
import RolesAdmin from '@app/shell/RolesAdmin.vue'
import { SESSION_STORAGE_KEY } from '@app/constants/cuenta.ts'
import { OPERAR_COPY, OPERAR_TABS, type OperarPermission } from '@app/constants/operar.ts'
import { ADMIN_COPY } from '@app/constants/kit.ts'
import ClubAdmin from '@modules/club/presentation/ClubAdmin.vue'
import PollsAdmin from '@modules/polls/presentation/PollsAdmin.vue'
import RidesAdmin from '@modules/rides/presentation/RidesAdmin.vue'
import PaymentWizard from '@modules/shop/presentation/PaymentWizard.vue'
import MysteryDeckAdmin from '@modules/shop/presentation/MysteryDeckAdmin.vue'
import ShopAdmin from '@modules/shop/presentation/ShopAdmin.vue'
import VoiceAdmin from '@modules/voice/presentation/VoiceAdmin.vue'
import { API, API_FAIL_FALLBACK, APP_PATHS, SESSION_HEADER, appEntrarYVolver } from '@shared/http/constants.ts'
import { usePageReveal } from '@shared/motion/usePageReveal.ts'
import Alert from '@ui/Alert.vue'
import Button from '@ui/Button.vue'
import Empty from '@ui/Empty.vue'
import FilterPills from '@ui/FilterPills.vue'

type Access = {
  readonly alias: string
  readonly role: { readonly id: string; readonly name: string }
  readonly permissions: readonly OperarPermission[]
}

type GateState = 'loading' | 'guest' | 'denied' | 'failed' | 'ready'

const bindReveal = usePageReveal()
const copy = OPERAR_COPY
const state = ref<GateState>('loading')
const access = ref<Access | null>(null)
const error = ref('')
const session = ref('')
const tab = ref('')
const stamp = ref(0)
const deps = computed(() => {
  void stamp.value
  return getAppDependencies()
})
const key = computed(() => session.value)
const enterTo = appEntrarYVolver(APP_PATHS.OPERAR)
const tabs = computed(() => OPERAR_TABS.filter((item) => can(item.permission)))
const outingOptions = computed(() =>
  deps.value.rides.listOutings().map((outing) => ({ value: outing.id, label: `${outing.title} · ${outing.date}` })),
)

function can(permission: OperarPermission): boolean {
  return Boolean(access.value?.permissions.includes(permission))
}

function readSession(): string {
  try {
    return localStorage.getItem(SESSION_STORAGE_KEY) ?? ''
  } catch {
    return ''
  }
}

async function loadAccess(): Promise<void> {
  error.value = ''
  session.value = readSession()
  if (!session.value) {
    state.value = 'guest'
    return
  }
  state.value = 'loading'
  try {
    const response = await fetch(API.OPERAR_ACCESS, { headers: { [SESSION_HEADER]: session.value } })
    const body = (await response.json().catch(() => ({}))) as { access?: Access; detail?: string }
    if (response.status === 403) {
      state.value = 'guest'
      return
    }
    if (!response.ok || !body.access) {
      error.value = typeof body.detail === 'string' ? body.detail : API_FAIL_FALLBACK
      state.value = 'failed'
      return
    }
    access.value = body.access
    state.value = body.access.permissions.length ? 'ready' : 'denied'
  } catch {
    error.value = API_FAIL_FALLBACK
    state.value = 'failed'
  }
}

watch(tabs, (list) => {
  if (!list.some((item) => item.id === tab.value)) tab.value = list[0]?.id ?? ''
})

onMounted(loadAccess)

async function onPublished() {
  await refreshInventory()
  stamp.value += 1
}
</script>

<template>
  <article :ref="bindReveal" class="wrap operar-page">
    <header class="stack operar-page__intro" data-reveal>
      <p class="meta" style="margin: 0">{{ copy.kicker }}</p>
      <h1 class="operar-page__title">{{ copy.title }}</h1>
      <p class="meta-text">{{ copy.lead }}</p>
    </header>

    <section v-if="state === 'loading'" class="operar-page__gate stack" data-reveal>
      <p class="meta-text">{{ copy.loading }}</p>
    </section>

    <section v-else-if="state === 'guest'" class="operar-page__gate stack" data-reveal>
      <h2 class="operar-page__gate-title">{{ copy.guestTitle }}</h2>
      <p class="meta-text">{{ copy.guestLead }}</p>
      <div class="row">
        <Button :to="enterTo">{{ copy.guestCta }}</Button>
      </div>
    </section>

    <section v-else-if="state === 'denied'" class="operar-page__gate" data-reveal>
      <Empty :title="copy.deniedTitle" :copy="copy.deniedLead" glyph="🔒" compact hide-cta />
      <div class="row" style="justify-content: center; margin-top: 16px">
        <Button variant="ghost" size="sm" :to="APP_PATHS.CUENTA">{{ copy.logout }}</Button>
      </div>
    </section>

    <section v-else-if="state === 'failed'" class="operar-page__gate stack" data-reveal>
      <h2 class="operar-page__gate-title">{{ copy.failTitle }}</h2>
      <Alert tone="bad">{{ error }}</Alert>
      <div class="row">
        <Button size="sm" @click="loadAccess">{{ copy.retry }}</Button>
      </div>
    </section>

    <template v-else-if="access">
      <div class="operar-page__tabs">
        <FilterPills v-model="tab" :pills="tabs" />
        <div class="operar-page__who">
          <span class="meta-text">{{ copy.roleTag(access.alias, access.role.name) }}</span>
          <Button variant="ghost" size="sm" :to="APP_PATHS.CUENTA">{{ copy.logout }}</Button>
        </div>
      </div>

      <section v-if="tab === 'rodadas'" class="operar-page__section">
        <RidesAdmin :key="stamp" :module="deps.rides" :clave="key" @published="onPublished" />
      </section>

      <section v-else-if="tab === 'voz'" class="operar-page__section">
        <VoiceAdmin :module="deps.voice" :clave="key" @published="onPublished" />
      </section>

      <section v-else-if="tab === 'encuestas'" class="operar-page__section">
        <PollsAdmin :module="deps.polls" :clave="key" :outings="outingOptions" @published="onPublished" />
      </section>

      <template v-else-if="tab === 'tienda'">
        <section class="operar-page__section">
          <ShopAdmin :module="deps.shop" :clave="key" @published="onPublished" />
        </section>
        <section id="mazo" class="operar-page__section operar-page__section--narrow">
          <MysteryDeckAdmin :module="deps.shop" :clave="key" />
        </section>
      </template>

      <section v-else-if="tab === 'parche'" class="operar-page__section">
        <ClubAdmin :module="deps.club" :clave="key" :stamp="stamp" @published="onPublished" />
      </section>

      <section v-else-if="tab === 'roles'" class="operar-page__section">
        <RolesAdmin :session="key" />
      </section>

      <template v-else-if="tab === 'ajustes'">
        <section id="pasarela" class="operar-page__section operar-page__section--narrow">
          <PaymentWizard :module="deps.shop" :clave="key" />
        </section>
        <section id="login" class="operar-page__section operar-page__section--narrow">
          <AuthWizard :clave="key" />
        </section>
        <div class="row">
          <Button variant="ghost" size="sm" :to="APP_PATHS.ADMIN_UI">{{ ADMIN_COPY.kitCta }}</Button>
        </div>
      </template>
    </template>
  </article>
</template>
