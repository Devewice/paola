<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { CUENTA_EMERGENCIA_COPY } from '@app/constants/cuenta.ts'
import type { CuentaAccount } from '@app/shell/cuenta/useCuentaAccount.ts'
import Alert from '@ui/Alert.vue'
import Button from '@ui/Button.vue'
import Field from '@ui/Field.vue'
import Input from '@ui/Input.vue'
import Select from '@ui/Select.vue'
import './cuenta-card.css'

const props = defineProps<{ account: CuentaAccount }>()

const copy = CUENTA_EMERGENCIA_COPY
const { profile, busy } = props.account

const editing = ref(false)
const error = ref('')
const notice = ref('')
const draft = reactive({ emergencyName: '', emergencyPhone: '', bloodType: '', medicalNotes: '' })

const safety = computed(() => profile.value?.safety ?? {})
const complete = computed(() => Boolean(safety.value.emergencyName && safety.value.emergencyPhone))
const bloodOptions = [
  { value: '', label: copy.bloodNone, muted: true },
  ...copy.bloodTypes.map((type) => ({ value: type, label: type })),
]

const rows = computed(() => [
  {
    label: copy.name,
    value: safety.value.emergencyName
      ? [safety.value.emergencyName, safety.value.emergencyPhone].filter(Boolean).join(' · ')
      : '',
  },
  { label: copy.blood, value: safety.value.bloodType ?? '' },
  { label: copy.medical, value: safety.value.medicalNotes ?? '' },
])

function startEdit(): void {
  draft.emergencyName = safety.value.emergencyName ?? ''
  draft.emergencyPhone = safety.value.emergencyPhone ?? ''
  draft.bloodType = safety.value.bloodType ?? ''
  draft.medicalNotes = safety.value.medicalNotes ?? ''
  error.value = ''
  notice.value = ''
  editing.value = true
}

async function save(): Promise<void> {
  error.value = ''
  const result = await props.account.saveSafety({ ...draft })
  if (!result.ok) {
    error.value = result.detail
    return
  }
  editing.value = false
  notice.value = copy.saved
}
</script>

<template>
  <section class="cuenta-card" aria-labelledby="cuenta-emergencia-title">
    <header class="cuenta-card__head">
      <span class="board-kicker">{{ copy.kicker }}</span>
      <h2 id="cuenta-emergencia-title" class="cuenta-card__title">{{ copy.title }}</h2>
      <p class="meta-text">{{ copy.lead }}</p>
    </header>

    <Alert v-if="error" tone="bad">{{ error }}</Alert>
    <Alert v-else-if="notice" tone="ok">{{ notice }}</Alert>
    <Alert v-else-if="profile && !complete && !editing" tone="info">{{ copy.missingNote }}</Alert>

    <template v-if="profile">
      <form v-if="editing" class="cuenta-card__form" @submit.prevent="save">
        <div class="cuenta-card__inline">
          <Field :label="copy.name" :hint="copy.nameHint">
            <Input v-model="draft.emergencyName" :placeholder="copy.namePlaceholder" autocomplete="off" />
          </Field>
          <Field :label="copy.phone">
            <Input v-model="draft.emergencyPhone" type="tel" :placeholder="copy.phonePlaceholder" autocomplete="off" />
          </Field>
        </div>
        <Select v-model="draft.bloodType" :label="copy.blood" :options="bloodOptions" />
        <Field :label="copy.medical" :hint="copy.medicalHint">
          <Input v-model="draft.medicalNotes" />
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
          <Button size="sm" :variant="complete ? 'ghost' : 'primary'" @click="startEdit">
            {{ complete ? copy.edit : copy.fill }}
          </Button>
        </div>
      </template>
    </template>
  </section>
</template>
