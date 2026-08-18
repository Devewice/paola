<script setup lang="ts">
import { ref } from 'vue'
import { LEGAL_COPY } from '@app/constants/legal.ts'
import { parseAccountRegister } from '@app/parseAccountRegister.ts'
import { API, APP_PATHS, JSON_HEADERS } from '@shared/http/constants.ts'
import PaolaAlert from '@ui/PaolaAlert.vue'
import PaolaButton from '@ui/PaolaButton.vue'
import PaolaField from '@ui/PaolaField.vue'
import PaolaInput from '@ui/PaolaInput.vue'
import PaolaPrivacyCheck from '@ui/PaolaPrivacyCheck.vue'

const email = ref('')
const alias = ref('')
const password = ref('')
const loginEmail = ref('')
const loginPassword = ref('')
const privacyAccepted = ref(false)
const sessionId = ref(localStorage.getItem('paola_session_id') ?? '')
const panel = ref<{ tickets: unknown[]; orders: unknown[]; notifications: unknown[] } | null>(null)
const error = ref('')
const legal = LEGAL_COPY
const privacyPath = APP_PATHS.PRIVACIDAD

async function register(): Promise<void> {
  error.value = ''
  const parsed = parseAccountRegister({ privacyAccepted: privacyAccepted.value })
  if (!parsed.ok) {
    error.value = parsed.error.message
    return
  }
  const response = await fetch(API.USERS_REGISTER, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({
      email: email.value,
      alias: alias.value,
      password: password.value,
      privacyAccepted: privacyAccepted.value,
    }),
  })
  const body = await response.json()
  if (!response.ok) {
    error.value = body.detail ?? 'No se pudo registrar.'
    return
  }
  sessionId.value = body.sessionId
  localStorage.setItem('paola_session_id', sessionId.value)
  await loadPanel()
}

async function login(): Promise<void> {
  const response = await fetch(API.USERS_LOGIN, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ email: loginEmail.value, password: loginPassword.value }),
  })
  const body = await response.json()
  if (!response.ok) {
    error.value = body.detail ?? 'No se pudo entrar.'
    return
  }
  sessionId.value = body.sessionId
  localStorage.setItem('paola_session_id', sessionId.value)
  await loadPanel()
}

async function loadPanel(): Promise<void> {
  const response = await fetch(API.ME_PANEL, { headers: { 'x-session-id': sessionId.value } })
  const body = await response.json()
  if (response.ok) panel.value = body.panel
}
</script>

<template>
  <article class="paola-page">
    <h1 class="paola-afiche__title type-display">Cuenta</h1>
    <p class="paola-page__copy paola-page__copy--muted">La web sigue pública; cuenta solo para historial y comunidad.</p>
    <p class="paola-page__copy">
      <router-link class="cuenta-legal" :to="privacyPath">{{ legal.checkboxLink }}</router-link>
    </p>
    <PaolaAlert v-if="error" tone="bad">{{ error }}</PaolaAlert>
    <section class="cuenta-grid">
      <form class="cuenta-card" @submit.prevent="register">
        <h2 class="paola-page__heading type-display">Registro</h2>
        <PaolaPrivacyCheck
          v-model="privacyAccepted"
          :label="legal.checkboxLabel"
          :to="privacyPath"
          :link-label="legal.checkboxLink"
        />
        <PaolaField label="Correo"><PaolaInput v-model="email" type="email" /></PaolaField>
        <PaolaField label="Alias"><PaolaInput v-model="alias" /></PaolaField>
        <PaolaField label="Clave"><PaolaInput v-model="password" type="password" /></PaolaField>
        <PaolaButton type="submit" :disabled="!privacyAccepted">Crear cuenta</PaolaButton>
      </form>
      <form class="cuenta-card" @submit.prevent="login">
        <h2 class="paola-page__heading type-display">Entrar</h2>
        <PaolaField label="Correo"><PaolaInput v-model="loginEmail" type="email" /></PaolaField>
        <PaolaField label="Clave"><PaolaInput v-model="loginPassword" type="password" /></PaolaField>
        <PaolaButton type="submit">Iniciar sesión</PaolaButton>
      </form>
    </section>
    <section v-if="panel" class="cuenta-card">
      <h2 class="paola-page__heading type-display">Panel</h2>
      <p>Tickets: {{ panel.tickets.length }} · Pedidos: {{ panel.orders.length }} · Notificaciones: {{ panel.notifications.length }}</p>
    </section>
  </article>
</template>

<style scoped>
.cuenta-grid { display: grid; gap: 16px; }
.cuenta-card { display: grid; gap: 12px; padding-top: 16px; border-top: 1px solid var(--paola-line); }
.cuenta-legal {
  color: var(--paola-cyan, #48b4fc);
  text-decoration: underline;
  text-underline-offset: 2px;
}
</style>
