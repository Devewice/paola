<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { getAppDependencies, refreshInventory } from '@app/bootstrap.ts'
import AuthWizard from '@app/shell/AuthWizard.vue'
import { OPERAR_CLAVE_STORAGE_KEY, OPERAR_COPY } from '@app/constants/operar.ts'
import { ADMIN_COPY } from '@app/constants/kit.ts'
import ClubAdmin from '@modules/club/presentation/ClubAdmin.vue'
import RidesAdmin from '@modules/rides/presentation/RidesAdmin.vue'
import PaymentWizard from '@modules/shop/presentation/PaymentWizard.vue'
import MysteryDeckAdmin from '@modules/shop/presentation/MysteryDeckAdmin.vue'
import ShopAdmin from '@modules/shop/presentation/ShopAdmin.vue'
import VoiceAdmin from '@modules/voice/presentation/VoiceAdmin.vue'
import { APP_PATHS } from '@shared/http/constants.ts'
import { usePageReveal } from '@shared/motion/usePageReveal.ts'
import Alert from '@ui/Alert.vue'
import Button from '@ui/Button.vue'
import FilterPills from '@ui/FilterPills.vue'
import PasswordField from '@ui/PasswordField.vue'

const bindReveal = usePageReveal()
const copy = OPERAR_COPY
const clave = ref('')
const unlocked = ref(false)
const error = ref('')
const tab = ref<string>(copy.tabs[0].id)
const stamp = ref(0)
const deps = computed(() => {
  void stamp.value
  return getAppDependencies()
})
const key = computed(() => clave.value.trim())

onMounted(() => {
  try {
    const stored = sessionStorage.getItem(OPERAR_CLAVE_STORAGE_KEY)
    if (stored) {
      clave.value = stored
      void unlock()
    }
  } catch {
    /* sin storage */
  }
})

async function unlock() {
  error.value = ''
  const result = await deps.value.shop.listOperatorGateways(key.value)
  if (!result.ok) {
    unlocked.value = false
    error.value = result.error.message || copy.unlockFail
    return
  }
  unlocked.value = true
  try {
    sessionStorage.setItem(OPERAR_CLAVE_STORAGE_KEY, key.value)
  } catch {
    /* sin storage */
  }
}

function logout() {
  unlocked.value = false
  clave.value = ''
  try {
    sessionStorage.removeItem(OPERAR_CLAVE_STORAGE_KEY)
  } catch {
    /* sin storage */
  }
}

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
      <p class="meta" style="margin: 0">{{ copy.lead }}</p>
    </header>

    <section v-if="!unlocked" class="operar-page__gate stack" data-reveal>
      <PasswordField id="operar-clave" v-model="clave" :label="copy.claveLabel" />
      <Alert v-if="error" tone="bad">{{ error }}</Alert>
      <Button size="sm" @click="unlock">{{ copy.enter }}</Button>
    </section>

    <template v-else>
      <div class="operar-page__tabs">
        <FilterPills v-model="tab" :pills="copy.tabs" />
        <Button variant="ghost" size="sm" @click="logout">{{ copy.logout }}</Button>
      </div>

      <section v-if="tab === 'rodadas'" class="operar-page__section">
        <RidesAdmin :key="stamp" :module="deps.rides" :clave="key" @published="onPublished" />
      </section>

      <section v-else-if="tab === 'voz'" class="operar-page__section">
        <VoiceAdmin :module="deps.voice" :clave="key" @published="onPublished" />
      </section>

      <section v-else-if="tab === 'tienda'" class="operar-page__section">
        <ShopAdmin :module="deps.shop" :clave="key" @published="onPublished" />
      </section>

      <section v-else-if="tab === 'parche'" class="operar-page__section">
        <ClubAdmin :module="deps.club" :clave="key" :stamp="stamp" @published="onPublished" />
      </section>

      <template v-else>
        <section id="mazo" class="operar-page__section operar-page__section--narrow">
          <MysteryDeckAdmin :module="deps.shop" :clave="key" />
        </section>
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
