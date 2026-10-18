<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { CUENTA_COPY, CUENTA_DATOS_COPY } from '@app/constants/cuenta.ts'
import type { CuentaAccount } from '@app/shell/cuenta/useCuentaAccount.ts'
import Alert from '@ui/Alert.vue'
import Button from '@ui/Button.vue'
import Choice from '@ui/Choice.vue'
import Field from '@ui/Field.vue'
import Input from '@ui/Input.vue'
import './cuenta-card.css'

const props = defineProps<{ account: CuentaAccount }>()
const emit = defineEmits<{ logout: [] }>()

const copy = CUENTA_DATOS_COPY
const shared = CUENTA_COPY
const { profile, busy } = props.account

const editing = ref(false)
const error = ref('')
const notice = ref('')
const draft = reactive({ alias: '', fullName: '', whatsapp: '' })

const since = computed(() => {
  const raw = profile.value?.createdAt
  if (!raw) return ''
  const date = new Date(raw)
  return Number.isNaN(date.valueOf())
    ? ''
    : date.toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })
})

const rows = computed(() => {
  const p = profile.value
  if (!p) return []
  return [
    { label: copy.alias, value: p.alias },
    { label: copy.fullName, value: p.fullName },
    { label: copy.whatsapp, value: p.whatsapp },
    { label: copy.email, value: p.email },
    { label: copy.since, value: since.value },
  ]
})

function startEdit(): void {
  const p = profile.value
  if (!p) return
  draft.alias = p.alias
  draft.fullName = p.fullName ?? ''
  draft.whatsapp = p.whatsapp ?? ''
  error.value = ''
  notice.value = ''
  editing.value = true
}

async function save(): Promise<void> {
  error.value = ''
  const result = await props.account.saveProfile({ ...draft })
  if (!result.ok) {
    error.value = result.detail
    return
  }
  editing.value = false
  notice.value = copy.saved
}

async function toggleVisibility(isPublic: boolean): Promise<void> {
  error.value = ''
  const result = await props.account.saveVisibility(isPublic)
  if (!result.ok) error.value = result.detail
}
</script>

<template>
  <section class="cuenta-card" aria-labelledby="cuenta-datos-title">
    <header class="cuenta-card__head">
      <span class="board-kicker">{{ copy.kicker }}</span>
      <h2 id="cuenta-datos-title" class="cuenta-card__title">{{ copy.title }}</h2>
      <p class="meta-text">{{ copy.lead }}</p>
    </header>

    <Alert v-if="error" tone="bad">{{ error }}</Alert>
    <Alert v-else-if="notice" tone="ok">{{ notice }}</Alert>

    <template v-if="profile">
      <form v-if="editing" class="cuenta-card__form" @submit.prevent="save">
        <Field :label="copy.email" :hint="copy.emailHint">
          <Input :model-value="profile.email" disabled />
        </Field>
        <Field :label="copy.alias" :hint="copy.aliasHint">
          <Input v-model="draft.alias" />
        </Field>
        <Field :label="copy.fullName" :hint="copy.fullNameHint">
          <Input v-model="draft.fullName" />
        </Field>
        <Field :label="copy.whatsapp" :hint="copy.whatsappHint">
          <Input v-model="draft.whatsapp" type="tel" :placeholder="copy.whatsappPlaceholder" />
        </Field>
        <div class="cuenta-card__actions">
          <Button type="submit" size="sm" :disabled="busy">{{ copy.save }}</Button>
          <Button variant="ghost" size="sm" :disabled="busy" @click="editing = false">{{ copy.cancel }}</Button>
        </div>
      </form>

      <template v-else>
        <dl class="cuenta-facts">
          <div v-for="row in rows" :key="row.label" class="cuenta-facts__row">
            <dt>{{ row.label }}</dt>
            <dd :class="{ 'is-empty': !row.value }">{{ row.value || copy.empty }}</dd>
          </div>
        </dl>
        <div class="cuenta-card__actions">
          <Button size="sm" @click="startEdit">{{ copy.edit }}</Button>
        </div>
      </template>

      <div class="cuenta-card__block">
        <h3 class="cuenta-card__subtitle">{{ copy.visibilityTitle }}</h3>
        <p class="meta-text">{{ shared.visibilityLead }}</p>
        <Choice
          kind="switch"
          :model-value="profile.isPublic"
          :label="shared.visibilityCta"
          @update:model-value="toggleVisibility"
        />
      </div>
    </template>

    <div class="cuenta-card__block cuenta-card__logout">
      <p class="meta-text">{{ copy.logoutLead }}</p>
      <Button variant="danger" size="sm" @click="emit('logout')">{{ shared.logout }}</Button>
    </div>
  </section>
</template>

<style scoped>
.cuenta-facts {
  margin: 0;
  display: grid;
  gap: 0;
}

.cuenta-facts__row {
  display: grid;
  grid-template-columns: minmax(120px, 38%) 1fr;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid rgba(72, 180, 252, 0.12);
}

.cuenta-facts__row:last-child {
  border-bottom: 0;
}

.cuenta-facts dt {
  font-size: 12px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.6);
}

.cuenta-facts dd {
  margin: 0;
  min-width: 0;
  overflow-wrap: anywhere;
  font-weight: 600;
}

.cuenta-facts dd.is-empty {
  font-weight: 400;
  font-style: italic;
  color: rgba(255, 255, 255, 0.45);
}

.cuenta-card__logout {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

@media (max-width: 480px) {
  .cuenta-facts__row {
    grid-template-columns: 1fr;
    gap: 2px;
  }
}
</style>
