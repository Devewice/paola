<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import type { ShopModule } from '@modules/shop/index.ts'
import {
  PAYMENT_CATALOG,
  PAYMENT_COPY,
  PAYMENT_MODE,
  PAYMENT_WIZARD_STEP,
  type PaymentProviderId,
} from '@modules/shop/constants/payments.ts'
import type { GatewayTest, OperatorGateway } from '@modules/shop/domain/entities/Payment.ts'
import Alert from '@ui/Alert.vue'
import Button from '@ui/Button.vue'
import CheckoutSteps from '@ui/CheckoutSteps.vue'
import Choice from '@ui/Choice.vue'
import Field from '@ui/Field.vue'
import Input from '@ui/Input.vue'
import PasswordField from '@ui/PasswordField.vue'
import ProgressBar from '@ui/ProgressBar.vue'
import Select from '@ui/Select.vue'

const props = defineProps<{
  module: ShopModule
  clave: string
}>()

const copy = PAYMENT_COPY
const step = ref(PAYMENT_WIZARD_STEP.CHANNELS)
const notice = ref('')
const error = ref('')
const testing = ref<PaymentProviderId | null>(null)
const saving = ref(false)
const selected = reactive<Record<string, boolean>>({})
const enabled = reactive<Record<string, boolean>>({})
const mode = reactive<Record<string, string>>({})
const credentials = reactive<Record<string, Record<string, string>>>({})
const filled = reactive<Record<string, readonly string[]>>({})
const tests = reactive<Record<string, GatewayTest>>({})

const modeOptions = [
  { value: PAYMENT_MODE.SANDBOX, label: copy.modeSandbox },
  { value: PAYMENT_MODE.LIVE, label: copy.modeLive },
]

for (const item of PAYMENT_CATALOG) {
  selected[item.id] = false
  enabled[item.id] = false
  mode[item.id] = PAYMENT_MODE.SANDBOX
  credentials[item.id] = Object.fromEntries(item.fields.map((field) => [field.key, '']))
}

const selectedCatalog = computed(() => PAYMENT_CATALOG.filter((item) => selected[item.id]))

const wizardSteps = computed(() => [
  {
    label: copy.stepChannels,
    meta: copy.stepChannelsMeta,
    state: stepState(PAYMENT_WIZARD_STEP.CHANNELS),
  },
  {
    label: copy.stepKeys,
    meta: copy.stepKeysMeta,
    state: stepState(PAYMENT_WIZARD_STEP.KEYS),
  },
  {
    label: copy.stepTest,
    meta: copy.stepTestMeta,
    state: stepState(PAYMENT_WIZARD_STEP.TEST),
  },
  {
    label: copy.stepActivate,
    meta: copy.stepActivateMeta,
    state: stepState(PAYMENT_WIZARD_STEP.ACTIVATE),
  },
])

function stepState(index: number): 'done' | 'active' | 'idle' {
  if (step.value > index) return 'done'
  if (step.value === index) return 'active'
  return 'idle'
}

function applyGateways(rows: readonly OperatorGateway[]) {
  for (const row of rows) {
    selected[row.provider] = true
    enabled[row.provider] = row.enabled
    mode[row.provider] = row.mode
    filled[row.provider] = row.filled
  }
}

async function load() {
  error.value = ''
  const result = await props.module.listOperatorGateways(props.clave)
  if (!result.ok) {
    error.value = result.error.message
    return
  }
  applyGateways(result.value)
}

async function save(): Promise<boolean> {
  saving.value = true
  notice.value = ''
  error.value = ''
  const gateways = selectedCatalog.value.map((item) => ({
    provider: item.id,
    mode: mode[item.id] === PAYMENT_MODE.LIVE ? PAYMENT_MODE.LIVE : PAYMENT_MODE.SANDBOX,
    enabled: Boolean(enabled[item.id]),
    credentials: { ...credentials[item.id] },
  }))
  const result = await props.module.savePaymentWizard(gateways, props.clave)
  saving.value = false
  if (!result.ok) {
    error.value = result.error.message
    return false
  }
  applyGateways(result.value)
  notice.value = copy.saveOk
  for (const item of selectedCatalog.value) {
    const bag = credentials[item.id]
    if (!bag) continue
    for (const field of item.fields) {
      if (field.secret) bag[field.key] = ''
    }
  }
  return true
}

function toggleSelected(id: string, value: boolean) {
  selected[id] = value
}

function toggleEnabled(id: string, value: boolean) {
  enabled[id] = value
}

function setMode(id: string, value: string) {
  mode[id] = value
}

function credValue(id: string, key: string): string {
  return credentials[id]?.[key] ?? ''
}

function setCred(id: string, key: string, value: string) {
  const bag = credentials[id] ?? (credentials[id] = {})
  bag[key] = value
}

async function testProvider(id: PaymentProviderId) {
  testing.value = id
  error.value = ''
  const saved = await save()
  if (!saved) {
    testing.value = null
    return
  }
  const result = await props.module.testPaymentGateway(id, props.clave)
  testing.value = null
  if (!result.ok) {
    error.value = result.error.message
    return
  }
  tests[id] = result.value
  notice.value = result.value.detail
}

onMounted(() => {
  void load()
})

watch(
  () => props.clave,
  () => {
    void load()
  },
)
</script>

<template>
  <section class="pay-wizard stack" aria-label="Asistente de pasarela">
    <header class="stack">
      <p class="meta" style="margin: 0">{{ copy.wizardKicker }}</p>
      <h2 class="pay-wizard__title">{{ copy.wizardTitle }}</h2>
      <p class="meta" style="margin: 0">{{ copy.wizardLead }}</p>
    </header>

    <ProgressBar :pct="((step + 1) / 4) * 100" />
    <CheckoutSteps :steps="wizardSteps" />

    <Alert v-if="notice" tone="ok">{{ notice }}</Alert>
    <Alert v-if="error" tone="bad">{{ error }}</Alert>

    <div v-if="step === PAYMENT_WIZARD_STEP.CHANNELS" class="stack">
      <Alert tone="info">
        <strong>{{ copy.humanLockTitle }}</strong>
        {{ copy.humanLockCopy }}
      </Alert>
      <Choice
        v-for="item in PAYMENT_CATALOG"
        :key="item.id"
        kind="switch"
        :label="`${item.title} · ${item.copy}`"
        :model-value="Boolean(selected[item.id])"
        @update:model-value="toggleSelected(item.id, $event)"
      />
    </div>

    <div v-else-if="step === PAYMENT_WIZARD_STEP.KEYS" class="stack">
      <p v-if="!selectedCatalog.length" class="meta" style="margin: 0">{{ copy.emptyKeys }}</p>
      <article v-for="item in selectedCatalog" :key="item.id" class="pay-wizard__card stack">
        <h3>{{ item.title }}</h3>
        <Field :label="copy.modeLabel">
          <Select :model-value="mode[item.id] ?? PAYMENT_MODE.SANDBOX" :options="modeOptions" @update:model-value="setMode(item.id, $event)" />
        </Field>
        <template v-for="field in item.fields" :key="field.key">
          <PasswordField
            v-if="field.secret"
            :id="`${item.id}-${field.key}`"
            :model-value="credValue(item.id, field.key)"
            :label="field.label"
            @update:model-value="setCred(item.id, field.key, $event)"
          />
          <Field v-else :label="field.label" :hint="filled[item.id]?.includes(field.key) ? copy.keepHint : field.hint">
            <Input
              :model-value="credValue(item.id, field.key)"
              :placeholder="field.hint"
              @update:model-value="setCred(item.id, field.key, $event)"
            />
          </Field>
        </template>
        <p v-if="filled[item.id]?.length" class="meta" style="margin: 0">{{ copy.keepHint }}</p>
      </article>
    </div>

    <div v-else-if="step === PAYMENT_WIZARD_STEP.TEST" class="stack">
      <p v-if="!selectedCatalog.length" class="meta" style="margin: 0">{{ copy.emptyKeys }}</p>
      <article v-for="item in selectedCatalog" :key="item.id" class="pay-wizard__card stack">
        <h3>{{ item.title }}</h3>
        <p class="meta" style="margin: 0">{{ item.copy }}</p>
        <p v-if="tests[item.id]" class="meta" style="margin: 0">{{ tests[item.id]?.detail }}</p>
        <Button size="sm" :disabled="testing === item.id" @click="testProvider(item.id)">{{ copy.test }}</Button>
      </article>
    </div>

    <div v-else class="stack">
      <p v-if="!selectedCatalog.length" class="meta" style="margin: 0">{{ copy.emptyKeys }}</p>
      <Choice
        v-for="item in selectedCatalog"
        :key="item.id"
        kind="switch"
        :label="`${copy.enable} · ${item.title}`"
        :model-value="Boolean(enabled[item.id])"
        @update:model-value="toggleEnabled(item.id, $event)"
      />
    </div>

    <div class="row">
      <Button v-if="step > PAYMENT_WIZARD_STEP.CHANNELS" variant="ghost" size="sm" @click="step -= 1">
        {{ copy.back }}
      </Button>
      <Button
        v-if="step < PAYMENT_WIZARD_STEP.ACTIVATE"
        size="sm"
        @click="step += 1"
      >
        {{ copy.next }}
      </Button>
      <Button v-else size="sm" :disabled="saving" @click="save">{{ copy.save }}</Button>
    </div>
  </section>
</template>
