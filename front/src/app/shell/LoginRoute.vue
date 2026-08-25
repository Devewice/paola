<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { LEGAL_COPY } from '@app/constants/legal.ts'
import { ALIAS_STORAGE_KEY, CUENTA_COPY, LOGIN_COPY, SESSION_STORAGE_KEY } from '@app/constants/cuenta.ts'
import { parseAccountRegister } from '@app/parseAccountRegister.ts'
import { runLoginNeon, stopLoginNeonFlicker, flashLoginNeonAlert, stopLoginNeonAlert } from '@shared/motion/runLoginNeon.ts'
import { API, APP_PATHS, JSON_HEADERS } from '@shared/http/constants.ts'
import Button from '@ui/Button.vue'
import Field from '@ui/Field.vue'
import Input from '@ui/Input.vue'
import PasswordField from '@ui/PasswordField.vue'
import PrivacyCheck from '@ui/PrivacyCheck.vue'
import { showToast } from '@ui/toast.ts'

const copy = LOGIN_COPY
const cuenta = CUENTA_COPY
const legal = LEGAL_COPY
const route = useRoute()
const router = useRouter()
const screenEl = ref<HTMLElement | null>(null)
let neonTl: ReturnType<typeof runLoginNeon> = null

const mode = ref<'login' | 'register'>('login')
const email = ref('')
const alias = ref('')
const password = ref('')
const loginEmail = ref('')
const loginPassword = ref('')
const privacyAccepted = ref(false)
const busy = ref(false)
const sessionId = ref(
  typeof localStorage !== 'undefined' ? localStorage.getItem(SESSION_STORAGE_KEY) ?? '' : '',
)

const nextPath = computed(() => {
  const raw = route.query.next
  return typeof raw === 'string' && raw.startsWith('/') ? raw : APP_PATHS.CUENTA
})

const titleMiChars = computed(() => [...copy.titleMi])
const titleCuentaChars = computed(() => [...copy.titleCuenta])
const registerTitleChars = computed(() => [...copy.registerTitle])
const registerAccentChars = computed(() => [...copy.registerAccent])

const benefitIndex = ref(0)
const activeBenefit = computed(() => copy.benefits[benefitIndex.value] ?? copy.benefits[0])
let benefitTimer: ReturnType<typeof setInterval> | undefined

function startBenefitTicker(): void {
  stopBenefitTicker()
  benefitTimer = setInterval(() => {
    benefitIndex.value = (benefitIndex.value + 1) % copy.benefits.length
  }, 2600)
}

function stopBenefitTicker(): void {
  if (benefitTimer) clearInterval(benefitTimer)
  benefitTimer = undefined
}

async function igniteNeon(): Promise<void> {
  neonTl?.kill()
  stopLoginNeonAlert()
  stopLoginNeonFlicker()
  await nextTick()
  neonTl = runLoginNeon(screenEl.value)
}

onUnmounted(() => {
  neonTl?.kill()
  stopLoginNeonAlert()
  stopLoginNeonFlicker()
  stopBenefitTicker()
})

onMounted(async () => {
  if (sessionId.value) {
    await router.replace(nextPath.value)
    return
  }
  startBenefitTicker()
  await igniteNeon()
})

watch(mode, () => {
  screenEl.value?.classList.add('login-screen--cold')
  screenEl.value?.classList.remove('login-screen--lit')
  void igniteNeon()
})

function reportError(msg: string): void {
  showToast(msg, 'bad')
  void nextTick(() => flashLoginNeonAlert(screenEl.value, 'bad'))
}

function showLogin(): void {
  mode.value = 'login'
}

function showRegister(): void {
  mode.value = 'register'
}

function rememberSession(id: string, nextAlias: string): void {
  sessionId.value = id
  localStorage.setItem(SESSION_STORAGE_KEY, id)
  if (nextAlias) localStorage.setItem(ALIAS_STORAGE_KEY, nextAlias)
}

async function register(): Promise<void> {
  const parsed = parseAccountRegister({ privacyAccepted: privacyAccepted.value })
  if (!parsed.ok) {
    reportError(parsed.error.message)
    return
  }
  busy.value = true
  try {
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
    const body = (await response.json().catch(() => ({}))) as Record<string, unknown>
    if (!response.ok || typeof body.sessionId !== 'string') {
      reportError(typeof body.detail === 'string' ? body.detail : cuenta.failRegister)
      return
    }
    const user = body.user as { alias?: string } | undefined
    rememberSession(body.sessionId, typeof user?.alias === 'string' ? user.alias : alias.value)
    await router.replace(nextPath.value)
  } catch {
    reportError(cuenta.failRegister)
  } finally {
    busy.value = false
  }
}

async function login(): Promise<void> {
  busy.value = true
  try {
    const response = await fetch(API.USERS_LOGIN, {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify({ email: loginEmail.value, password: loginPassword.value }),
    })
    const body = (await response.json().catch(() => ({}))) as Record<string, unknown>
    if (!response.ok || typeof body.sessionId !== 'string') {
      reportError(typeof body.detail === 'string' ? body.detail : cuenta.failLogin)
      return
    }
    const user = body.user as { alias?: string } | undefined
    rememberSession(body.sessionId, typeof user?.alias === 'string' ? user.alias : '')
    await router.replace(nextPath.value)
  } catch {
    reportError(cuenta.failLogin)
  } finally {
    busy.value = false
  }
}

async function googleStart(): Promise<void> {
  busy.value = true
  try {
    const response = await fetch(API.AUTH_GOOGLE_START)
    const body = (await response.json().catch(() => ({}))) as Record<string, unknown>
    if (!response.ok || typeof body.url !== 'string') {
      reportError(typeof body.detail === 'string' ? body.detail : copy.googleFail)
      return
    }
    window.location.href = body.url
  } catch {
    reportError(copy.googleFail)
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <div
    ref="screenEl"
    class="login-screen login-screen--cold"
    :class="{ 'login-screen--register': mode === 'register' }"
  >
    <div class="login-screen__glow" data-neon="glow" aria-hidden="true" />

    <div class="login-stage">
      <template v-if="mode === 'login'">
        <header class="login-stage__head">
          <h1 class="login-stage__title" aria-label="Mi cuenta">
            <span class="login-stage__word type-brush-dry type-brush-dry--sm" aria-hidden="true">
              <span
                v-for="(ch, i) in titleMiChars"
                :key="`mi-${i}`"
                class="login-neon-char"
                data-neon="char"
              >{{ ch }}</span>
            </span>
            <span
              class="login-stage__word type-brush-dry type-brush-dry--blue type-brush-dry--sm"
              aria-hidden="true"
            >
              <span
                v-for="(ch, i) in titleCuentaChars"
                :key="`cu-${i}`"
                class="login-neon-char login-neon-char--cyan"
                data-neon="char"
              >{{ ch }}</span>
            </span>
          </h1>
        </header>

        <form class="login-stage__form" data-neon="block" @submit.prevent="login">
          <Field tone="electric" :label="cuenta.emailLabel">
            <Input tone="electric" v-model="loginEmail" type="email" />
          </Field>
          <PasswordField
            id="login-pass"
            tone="electric"
            v-model="loginPassword"
            :label="cuenta.passwordLabel"
          />
          <Button type="submit" variant="hero" :disabled="busy">{{ cuenta.loginCta }}</Button>
        </form>

        <div class="login-stage__google" data-neon="block">
          <p class="login-stage__hint" aria-hidden="true">{{ copy.orEmail }}</p>
          <Button
            type="button"
            variant="ghost"
            class="login-google-btn"
            :disabled="busy"
            @click="googleStart"
          >
            <span class="login-google-btn__row">
              <svg class="login-google-btn__icon" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>{{ copy.googleCta }}</span>
            </span>
          </Button>
        </div>

        <div class="login-stage__actions" data-neon="block">
          <Button type="button" variant="white" @click="showRegister">
            {{ copy.switchToRegister }}
          </Button>
        </div>
        <div class="login-stage__benefits" data-neon="block">
          <p class="login-stage__benefits-kicker">{{ copy.benefitsKicker }}</p>
          <Transition name="login-benefit" mode="out-in">
            <p :key="benefitIndex" class="login-stage__benefits-item">{{ activeBenefit }}</p>
          </Transition>
        </div>
      </template>

      <template v-else>
        <header class="login-stage__head login-stage__head--register">
          <p class="login-stage__kicker type-brush-script" data-neon="block">
            {{ copy.titleMi }} {{ copy.titleCuenta }}
          </p>
          <h1 class="login-stage__title login-stage__title--register" aria-label="Únete al parche">
            <span class="login-stage__word type-brush-dry" aria-hidden="true">
              <span
                v-for="(ch, i) in registerTitleChars"
                :key="`rt-${i}`"
                class="login-neon-char"
                data-neon="char"
              >{{ ch }}</span>
            </span>
            <span class="login-stage__word type-brush-dry type-brush-dry--blue" aria-hidden="true">
              <span
                v-for="(ch, i) in registerAccentChars"
                :key="`ra-${i}`"
                class="login-neon-char login-neon-char--cyan"
                data-neon="char"
              >{{ ch === ' ' ? '\u00a0' : ch }}</span>
            </span>
          </h1>
          <p class="login-stage__lead" data-neon="block">{{ copy.registerLead }}</p>
        </header>

        <form class="login-stage__form login-stage__form--register" data-neon="block" @submit.prevent="register">
          <PrivacyCheck
            v-model="privacyAccepted"
            :label="legal.checkboxLabel"
            :to="APP_PATHS.PRIVACIDAD"
            :link-label="legal.checkboxLink"
          />
          <Field tone="electric" :label="cuenta.emailLabel">
            <Input tone="electric" v-model="email" type="email" />
          </Field>
          <Field tone="electric" :label="cuenta.aliasLabel">
            <Input tone="electric" v-model="alias" />
          </Field>
          <PasswordField
            id="register-pass"
            tone="electric"
            v-model="password"
            :label="cuenta.passwordLabel"
          />
          <Button type="submit" variant="hero" :disabled="busy || !privacyAccepted">
            {{ cuenta.registerCta }}
          </Button>
        </form>

        <div class="login-stage__actions" data-neon="block">
          <Button type="button" variant="ghost" @click="showLogin">
            {{ copy.switchToLogin }}
          </Button>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.login-screen {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: min(72vh, 680px);
  padding: 40px 16px 56px;
  box-sizing: border-box;
  overflow-x: clip;
}

@media (max-width: 639px) {
  .login-screen {
    align-items: flex-start;
    min-height: 0;
    padding: 24px 16px 40px;
  }
}

.login-screen__glow {
  pointer-events: none;
  position: absolute;
  inset: 10% 20% auto;
  height: 40%;
  background: radial-gradient(ellipse at center, rgba(0, 136, 248, 0.14), transparent 70%);
  opacity: 0.08;
}

.login-screen--register .login-screen__glow {
  inset: 0;
  height: 100%;
  background:
    radial-gradient(ellipse 70% 50% at 50% 20%, rgba(0, 136, 248, 0.22), transparent 65%),
    radial-gradient(ellipse 50% 40% at 80% 80%, rgba(72, 180, 252, 0.08), transparent 60%);
}

.login-screen--lit .login-screen__glow {
  opacity: 0.55;
}

.login-screen--register.login-screen--lit .login-screen__glow {
  opacity: 0.85;
}

.login-stage {
  position: relative;
  z-index: 1;
  display: grid;
  gap: 20px;
  width: min(100%, 22rem);
  justify-items: stretch;
}

.login-stage__head {
  text-align: center;
}

.login-stage__title {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: baseline;
  gap: 0.2em 0.35em;
  margin: 0;
}

.login-stage__word {
  display: inline-flex;
  margin: 0;
}

.login-stage__title :deep(.type-brush-dry),
.login-stage__title .type-brush-dry {
  margin: 0;
}

.login-neon-char {
  display: inline-block;
  will-change: opacity, color;
}

/* Apagado desde el primer paint: no flash completo → off → on */
.login-screen--cold .login-neon-char,
.login-screen--cold [data-neon='block'] {
  opacity: 0.04;
}

.login-screen--cold .login-screen__glow {
  opacity: 0.06;
}

.login-screen--lit .login-neon-char,
.login-screen--lit [data-neon='block'] {
  opacity: 1;
}

.login-stage__title--register {
  flex-direction: column;
  gap: 0;
  margin-top: 4px;
}

.login-stage__title--register .type-brush-dry {
  font-size: clamp(36px, 9vw, 64px);
  line-height: 0.92;
}

.login-stage__kicker {
  margin: 0 0 4px;
  font-size: clamp(18px, 3vw, 24px);
}

.login-stage__lead {
  margin: 12px 0 0;
  font-family: var(--paola-font-ui, 'Montserrat', sans-serif);
  font-size: 14px;
  line-height: 1.5;
  color: var(--paola-muted, #9aa3b2);
}

.login-stage__form {
  display: grid;
  gap: 14px;
}

.login-stage__form--register {
  gap: 16px;
  padding-top: 4px;
}

.login-stage__google {
  display: grid;
  gap: 10px;
  justify-items: stretch;
}

.login-stage__hint {
  margin: 0;
  text-align: center;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--paola-muted, #9aa3b2);
}

.login-google-btn :deep(.login-google-btn__row),
.login-google-btn__row {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.login-google-btn__icon {
  width: 18px;
  height: 18px;
  flex: none;
  display: block;
}

.login-stage__actions {
  display: grid;
  justify-items: stretch;
}

.login-stage__benefits {
  display: grid;
  gap: 6px;
  justify-items: center;
  text-align: center;
  min-height: 2.8rem;
}

.login-stage__benefits-kicker {
  margin: 0;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--paola-muted, #9aa3b2);
}

.login-stage__benefits-item {
  margin: 0;
  font-family: var(--paola-font-ui, 'Montserrat', sans-serif);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: var(--paola-muted, #8b9bb0);
}

.login-benefit-enter-active,
.login-benefit-leave-active {
  transition: opacity 0.28s ease, transform 0.28s ease;
}

.login-benefit-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.login-benefit-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

@media (prefers-reduced-motion: reduce) {
  .login-screen--cold .login-neon-char,
  .login-screen--cold [data-neon='block'],
  .login-screen--cold .login-screen__glow {
    opacity: 1;
  }

  .login-neon-char {
    opacity: 1 !important;
  }
}
</style>
