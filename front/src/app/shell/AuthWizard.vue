<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { OPERAR_COPY } from '@app/constants/operar.ts'
import { API, JSON_HEADERS, OPERADOR_CLAVE_HEADER } from '@shared/http/constants.ts'
import Alert from '@ui/Alert.vue'
import Button from '@ui/Button.vue'
import CheckoutSteps from '@ui/CheckoutSteps.vue'
import Choice from '@ui/Choice.vue'
import Field from '@ui/Field.vue'
import Input from '@ui/Input.vue'
import PasswordField from '@ui/PasswordField.vue'

const props = defineProps<{
  clave: string
}>()

const copy = OPERAR_COPY
const step = ref(0)
const enabled = ref(false)
const clientId = ref('')
const clientSecret = ref('')
const redirectUri = ref('')
const filled = ref<readonly string[]>([])
const error = ref('')
const notice = ref('')
const saving = ref(false)

const wizardSteps = computed(() => [
  {
    label: copy.authStepEnable,
    meta: copy.authStepEnableMeta,
    state: stepState(0),
  },
  {
    label: copy.authStepKeys,
    meta: copy.authStepKeysMeta,
    state: stepState(1),
  },
  {
    label: copy.authStepActivate,
    meta: copy.authStepActivateMeta,
    state: stepState(2),
  },
])

function stepState(index: number): 'done' | 'active' | 'idle' {
  if (step.value > index) return 'done'
  if (step.value === index) return 'active'
  return 'idle'
}

function headers(json = false): Record<string, string> {
  return json
    ? { ...JSON_HEADERS, [OPERADOR_CLAVE_HEADER]: props.clave }
    : { [OPERADOR_CLAVE_HEADER]: props.clave }
}

async function load(): Promise<void> {
  error.value = ''
  try {
    const response = await fetch(API.OPERAR_AUTH, { headers: headers() })
    const body = (await response.json().catch(() => ({}))) as {
      config?: {
        enabled?: boolean
        filled?: string[]
        redirectUri?: string
      }
      detail?: string
    }
    if (!response.ok) {
      error.value = typeof body.detail === 'string' ? body.detail : copy.authLoadFail
      return
    }
    enabled.value = Boolean(body.config?.enabled)
    filled.value = Array.isArray(body.config?.filled) ? body.config.filled : []
    if (typeof body.config?.redirectUri === 'string' && body.config.redirectUri) {
      redirectUri.value = body.config.redirectUri
    } else if (typeof window !== 'undefined') {
      redirectUri.value = `${window.location.origin}/api/auth/google/callback`
    }
  } catch {
    error.value = copy.authLoadFail
  }
}

async function save(): Promise<void> {
  error.value = ''
  notice.value = ''
  saving.value = true
  try {
    const response = await fetch(API.OPERAR_AUTH, {
      method: 'POST',
      headers: headers(true),
      body: JSON.stringify({
        enabled: enabled.value,
        credentials: {
          clientId: clientId.value,
          clientSecret: clientSecret.value,
          redirectUri: redirectUri.value,
        },
      }),
    })
    const body = (await response.json().catch(() => ({}))) as {
      config?: { enabled?: boolean; filled?: string[] }
      detail?: string
    }
    if (!response.ok) {
      error.value = typeof body.detail === 'string' ? body.detail : copy.authFail
      return
    }
    enabled.value = Boolean(body.config?.enabled)
    filled.value = Array.isArray(body.config?.filled) ? body.config.filled : filled.value
    notice.value = copy.authSaved
    clientSecret.value = ''
  } catch {
    error.value = copy.authFail
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  void load()
})
</script>

<template>
  <section class="auth-wizard stack">
    <header class="stack" style="gap: 4px">
      <h2 class="auth-wizard__title">{{ copy.authTitle }}</h2>
      <p class="meta-text">{{ copy.authLead }}</p>
    </header>

    <CheckoutSteps :steps="wizardSteps" />

    <Alert v-if="error" tone="bad">{{ error }}</Alert>
    <Alert v-if="notice" tone="ok">{{ notice }}</Alert>

    <div v-if="step === 0" class="stack">
      <Choice v-model="enabled" :label="copy.authEnable" />
      <Button size="sm" @click="step = 1">{{ copy.authNext }}</Button>
    </div>

    <div v-else-if="step === 1" class="stack">
      <p v-if="filled.length" class="meta-text">{{ copy.authFilled }}: {{ filled.join(', ') }}</p>
      <Field :label="copy.authClientId"><Input v-model="clientId" autocomplete="off" /></Field>
      <PasswordField id="auth-google-secret" v-model="clientSecret" :label="copy.authClientSecret" />
      <Field :label="copy.authRedirect">
        <Input v-model="redirectUri" autocomplete="off" />
      </Field>
      <p class="meta-text">{{ copy.authRedirectHint }}</p>
      <div class="row">
        <Button size="sm" variant="ghost" @click="step = 0">{{ copy.authBack }}</Button>
        <Button size="sm" @click="step = 2">{{ copy.authNext }}</Button>
      </div>
    </div>

    <div v-else class="stack">
      <Choice v-model="enabled" :label="copy.authEnable" />
      <div class="row">
        <Button size="sm" variant="ghost" @click="step = 1">{{ copy.authBack }}</Button>
        <Button size="sm" :disabled="saving" @click="save">{{ copy.authSave }}</Button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.auth-wizard__title {
  margin: 0;
  font-family: var(--paola-font-display);
  font-size: 22px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
</style>
