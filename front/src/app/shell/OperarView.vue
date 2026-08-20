<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { getAppDependencies } from '@app/bootstrap.ts'
import { OPERAR_CLAVE_STORAGE_KEY, OPERAR_COPY } from '@app/constants/operar.ts'
import { ADMIN_COPY } from '@app/constants/kit.ts'
import PaymentWizard from '@modules/shop/presentation/PaymentWizard.vue'
import MysteryDeckAdmin from '@modules/shop/presentation/MysteryDeckAdmin.vue'
import { APP_PATHS } from '@shared/http/constants.ts'
import { usePageReveal } from '@shared/motion/usePageReveal.ts'
import Alert from '@ui/Alert.vue'
import Button from '@ui/Button.vue'
import PasswordField from '@ui/PasswordField.vue'

const bindReveal = usePageReveal()
const copy = OPERAR_COPY
const clave = ref('')
const unlocked = ref(false)
const error = ref('')
const module = computed(() => getAppDependencies().shop)

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
  const result = await module.value.listOperatorGateways(clave.value.trim())
  if (!result.ok) {
    unlocked.value = false
    error.value = result.error.message || copy.unlockFail
    return
  }
  unlocked.value = true
  try {
    sessionStorage.setItem(OPERAR_CLAVE_STORAGE_KEY, clave.value.trim())
  } catch {
    /* sin storage */
  }
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
      <section id="mazo" class="operar-page__section" data-reveal>
        <MysteryDeckAdmin :module="module" :clave="clave.trim()" />
      </section>
      <section id="pasarela" class="operar-page__section" data-reveal>
        <PaymentWizard :module="module" :clave="clave.trim()" />
      </section>
      <div class="row" data-reveal>
        <Button variant="ghost" size="sm" :to="APP_PATHS.ADMIN_UI">{{ ADMIN_COPY.kitCta }}</Button>
      </div>
    </template>
  </article>
</template>
