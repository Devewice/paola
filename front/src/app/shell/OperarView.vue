<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getAppDependencies, inventoryVersion, refreshInventory } from '@app/bootstrap.ts'
import AuthWizard from '@app/shell/AuthWizard.vue'
import NotFoundView from '@app/shell/NotFoundView.vue'
import RolesAdmin from '@app/shell/RolesAdmin.vue'
import { useOperarAccess } from '@app/shell/useOperarAccess.ts'
import { ADMIN_BAR_COPY, OPERAR_COPY, OPERAR_PERMISSIONS, OPERAR_QUERY, OPERAR_TABS } from '@app/constants/operar.ts'
import { ROUTE_TITLES } from '@app/constants/copy.ts'
import { ADMIN_COPY } from '@app/constants/kit.ts'
import ClubAdmin from '@modules/club/presentation/ClubAdmin.vue'
import PollsAdmin from '@modules/polls/presentation/PollsAdmin.vue'
import RidesAdmin from '@modules/rides/presentation/RidesAdmin.vue'
import PaymentWizard from '@modules/shop/presentation/PaymentWizard.vue'
import ShopAdmin from '@modules/shop/presentation/ShopAdmin.vue'
import VoiceAdmin from '@modules/voice/presentation/VoiceAdmin.vue'
import { APP_PATHS } from '@shared/http/constants.ts'
import { usePageReveal } from '@shared/motion/usePageReveal.ts'
import AdminNav from '@ui/AdminNav.vue'
import Button from '@ui/Button.vue'

const bindReveal = usePageReveal()
const route = useRoute()
const router = useRouter()
const copy = OPERAR_COPY
const { gate, access, session, can } = useOperarAccess(ROUTE_TITLES.ADMIN)
const deps = computed(() => {
  void inventoryVersion.value
  return getAppDependencies()
})
const key = computed(() => session.value)
const tabs = computed(() => OPERAR_TABS.filter((item) => can(item.permission)))
const navItems = computed(() =>
  tabs.value.map((item) => ({
    id: item.id,
    label: item.label,
    hint: OPERAR_PERMISSIONS.find((permission) => permission.id === item.permission)?.hint,
  })),
)
const outingOptions = computed(() =>
  deps.value.rides.listOutings().map((outing) => ({ value: outing.id, label: `${outing.title} · ${outing.date}` })),
)

function queryValue(name: string): string {
  const value = route.query[name]
  return typeof value === 'string' ? value : ''
}

const create = computed(() => queryValue(OPERAR_QUERY.CREATE) || undefined)
const tab = computed({
  get() {
    const wanted = queryValue(OPERAR_QUERY.SECTION)
    return tabs.value.some((item) => item.id === wanted) ? wanted : (tabs.value[0]?.id ?? '')
  },
  set(value: string) {
    void router.replace({ query: { [OPERAR_QUERY.SECTION]: value } })
  },
})

watch(tab, () => {
  window.scrollTo({ top: 0 })
})

async function onPublished() {
  await refreshInventory()
}
</script>

<template>
  <NotFoundView v-if="gate === 'hidden'" />
  <div v-else-if="gate === 'loading'" class="wrap operar-page" aria-busy="true" />
  <article v-else :ref="bindReveal" class="wrap operar-page">
    <header class="operar-page__intro" data-reveal>
      <div class="stack">
        <p class="meta" style="margin: 0">{{ copy.kicker }}</p>
        <h1 class="operar-page__title">{{ copy.title }}</h1>
        <p class="meta-text">{{ copy.lead }}</p>
      </div>
      <div v-if="access" class="operar-page__who">
        <span class="meta-text">{{ copy.roleTag(access.alias, access.role.name) }}</span>
        <Button variant="ghost" size="sm" :to="APP_PATHS.CUENTA">{{ copy.logout }}</Button>
      </div>
    </header>

    <div v-if="access" class="operar-layout">
      <AdminNav v-model="tab" :label="ADMIN_BAR_COPY.navLabel" :items="navItems" />

      <div class="operar-layout__main">
        <RidesAdmin
          v-if="tab === 'rodadas'"
          :module="deps.rides"
          :clave="key"
          :create="create"
          :stamp="inventoryVersion"
          @published="onPublished"
        />

        <VoiceAdmin
          v-else-if="tab === 'voz'"
          :module="deps.voice"
          :clave="key"
          :create="create"
          :stamp="inventoryVersion"
          @published="onPublished"
        />

        <PollsAdmin
          v-else-if="tab === 'encuestas'"
          :module="deps.polls"
          :clave="key"
          :outings="outingOptions"
          @published="onPublished"
        />

        <ShopAdmin
          v-else-if="tab === 'tienda'"
          :module="deps.shop"
          :clave="key"
          :create="create"
          :stamp="inventoryVersion"
          @published="onPublished"
        />

        <ClubAdmin
          v-else-if="tab === 'parche'"
          :module="deps.club"
          :clave="key"
          :create="create"
          :stamp="inventoryVersion"
          @published="onPublished"
        />

        <RolesAdmin v-else-if="tab === 'roles'" :session="key" />

        <div v-else-if="tab === 'ajustes'" class="admin-stack operar-page__section--narrow">
          <section id="pasarela">
            <PaymentWizard :module="deps.shop" :clave="key" />
          </section>
          <section id="login">
            <AuthWizard :clave="key" />
          </section>
          <div class="row">
            <Button variant="ghost" size="sm" :to="APP_PATHS.ADMIN_UI">{{ ADMIN_COPY.kitCta }}</Button>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>
