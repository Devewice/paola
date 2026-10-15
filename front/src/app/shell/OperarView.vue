<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { getAppDependencies, refreshInventory } from '@app/bootstrap.ts'
import AuthWizard from '@app/shell/AuthWizard.vue'
import NotFoundView from '@app/shell/NotFoundView.vue'
import RolesAdmin from '@app/shell/RolesAdmin.vue'
import { useOperarAccess } from '@app/shell/useOperarAccess.ts'
import { OPERAR_COPY, OPERAR_TABS } from '@app/constants/operar.ts'
import { ROUTE_TITLES } from '@app/constants/copy.ts'
import { ADMIN_COPY } from '@app/constants/kit.ts'
import ClubAdmin from '@modules/club/presentation/ClubAdmin.vue'
import PollsAdmin from '@modules/polls/presentation/PollsAdmin.vue'
import RidesAdmin from '@modules/rides/presentation/RidesAdmin.vue'
import PaymentWizard from '@modules/shop/presentation/PaymentWizard.vue'
import MysteryDeckAdmin from '@modules/shop/presentation/MysteryDeckAdmin.vue'
import ShopAdmin from '@modules/shop/presentation/ShopAdmin.vue'
import VoiceAdmin from '@modules/voice/presentation/VoiceAdmin.vue'
import { APP_PATHS } from '@shared/http/constants.ts'
import { usePageReveal } from '@shared/motion/usePageReveal.ts'
import Button from '@ui/Button.vue'
import FilterPills from '@ui/FilterPills.vue'

const bindReveal = usePageReveal()
const copy = OPERAR_COPY
const { gate, access, session, can } = useOperarAccess(ROUTE_TITLES.ADMIN)
const tab = ref('')
const stamp = ref(0)
const deps = computed(() => {
  void stamp.value
  return getAppDependencies()
})
const key = computed(() => session.value)
const tabs = computed(() => OPERAR_TABS.filter((item) => can(item.permission)))
const outingOptions = computed(() =>
  deps.value.rides.listOutings().map((outing) => ({ value: outing.id, label: `${outing.title} · ${outing.date}` })),
)

watch(tabs, (list) => {
  if (!list.some((item) => item.id === tab.value)) tab.value = list[0]?.id ?? ''
})

async function onPublished() {
  await refreshInventory()
  stamp.value += 1
}
</script>

<template>
  <NotFoundView v-if="gate === 'hidden'" />
  <div v-else-if="gate === 'loading'" class="wrap operar-page" aria-busy="true" />
  <article v-else :ref="bindReveal" class="wrap operar-page">
    <header class="stack operar-page__intro" data-reveal>
      <p class="meta" style="margin: 0">{{ copy.kicker }}</p>
      <h1 class="operar-page__title">{{ copy.title }}</h1>
      <p class="meta-text">{{ copy.lead }}</p>
    </header>

    <template v-if="access">
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
