<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { RIDES_RULES_COPY, RIDES_SIGNUP_COPY } from '@modules/rides/constants/copy.ts'
import type { Outing } from '@modules/rides/domain/entities/Outing.ts'
import type { ClaimedSpot, OutingCrew, RideLevel } from '@modules/rides/domain/entities/Ticket.ts'
import type { RidesModule } from '@modules/rides/composition.ts'
import RideFirm from '@modules/rides/presentation/RideFirm.vue'
import { outingStatusCopy } from '@modules/rides/presentation/outingStatusCopy.ts'
import Alert from '@ui/Alert.vue'
import Button from '@ui/Button.vue'
import Choice from '@ui/Choice.vue'
import Field from '@ui/Field.vue'
import Input from '@ui/Input.vue'
import Segmented from '@ui/Segmented.vue'
import Select from '@ui/Select.vue'
import { showToast } from '@ui/toast.ts'

const NO_MOTO = '__sin_moto__'
const SOLO = 'solo'
const WITH_PASSENGER = 'parrillero'

const props = defineProps<{
  module: RidesModule
  outing: Outing
  crew: OutingCrew | null
  failed?: boolean
  enterTo: string
  garageTo: string
}>()

const emit = defineEmits<{ inscribed: [spot: ClaimedSpot]; changed: [] }>()

const copy = RIDES_SIGNUP_COPY
const rules = RIDES_RULES_COPY
const form = reactive({
  moto: '',
  level: '' as RideLevel | '',
  passenger: SOLO,
  passengerName: '',
  docsOk: false,
  rulesOk: false,
  emergencyName: '',
  emergencyPhone: '',
})
const sending = ref(false)
const problem = ref('')

const garage = computed(() => props.crew?.motorcycles ?? [])
const motoOptions = computed(() => [
  ...garage.value.map((label) => ({ value: label, label })),
  { value: NO_MOTO, label: copy.motoNone, muted: true },
])
const levelOptions = computed(() => [
  { value: '', label: copy.levelPlaceholder, muted: true },
  ...copy.levels.map((level) => ({ value: level.value, label: level.label })),
])
const passengerOptions = [
  { value: SOLO, label: copy.passengerNo },
  { value: WITH_PASSENGER, label: copy.passengerYes },
]
const withPassenger = computed(() => form.passenger === WITH_PASSENGER)

watch(
  garage,
  (list) => {
    if (list.length && !form.moto) form.moto = list[0] ?? ''
  },
  { immediate: true },
)

const open = computed(() => props.module.canClaim(props.outing))
const notice = computed(() =>
  props.crew?.inscribed && props.crew.alias ? props.module.noticeFor(props.outing, props.crew.alias) : null,
)

function missing(): string {
  if (props.crew?.needsEmergency && (!form.emergencyName.trim() || !form.emergencyPhone.trim())) {
    return copy.missingEmergency
  }
  if (!form.level) return copy.missingLevel
  if (withPassenger.value && !form.passengerName.trim()) return copy.missingPassenger
  if (!form.docsOk) return copy.missingDocs
  if (!form.rulesOk) return copy.missingRules
  return ''
}

async function submit(): Promise<void> {
  if (sending.value) return
  problem.value = missing()
  if (problem.value) return
  sending.value = true
  const noMoto = form.moto === NO_MOTO
  const result = await props.module.claimSpot(props.outing.id, {
    moto: !noMoto && form.moto ? form.moto : undefined,
    noMoto: noMoto || undefined,
    passenger: withPassenger.value,
    passengerName: withPassenger.value ? form.passengerName : undefined,
    level: form.level,
    docsOk: form.docsOk,
    rulesOk: form.rulesOk,
    emergencyName: props.crew?.needsEmergency ? form.emergencyName : undefined,
    emergencyPhone: props.crew?.needsEmergency ? form.emergencyPhone : undefined,
  })
  sending.value = false
  if (!result.ok) {
    showToast(result.error.message, 'bad')
    return
  }
  emit('inscribed', result.value)
}
</script>

<template>
  <div class="ride-signup">
    <p class="paola-empty__kicker">{{ copy.kicker }}</p>

    <p v-if="failed" class="meta-text">{{ copy.loadFail }}</p>
    <p v-else-if="!crew" class="meta-text">{{ copy.loading }}</p>

    <template v-else-if="crew.inscribed">
      <RideFirm
        v-if="crew.confirmOpen"
        :module="module"
        :outing-id="outing.id"
        :confirmation="crew.confirmation"
        @confirmed="emit('changed')"
        @released="emit('changed')"
      />
      <Alert v-else tone="ok">
        <strong>{{ copy.insideTitle }}.</strong> {{ copy.insideCopy }}
      </Alert>
      <div v-if="notice" class="ride-signup__actions">
        <Button size="sm" variant="ghost" :href="notice.whatsappHref" target="_blank">{{ copy.insideWhatsapp }}</Button>
        <Button size="sm" variant="ghost" :href="notice.mailtoHref">{{ copy.insideMail }}</Button>
      </div>
    </template>

    <template v-else-if="open">
      <Alert v-if="outing.paid" tone="info">{{ copy.paidNotice }}</Alert>

      <template v-if="!crew.signedIn">
        <p class="meta-text">{{ copy.guestLead }}</p>
        <Button :to="enterTo">{{ copy.guestCta }}</Button>
      </template>

      <form v-else class="ride-signup__form" novalidate @submit.prevent="submit">
        <p class="meta-text">
          {{ copy.asAlias }} <strong>{{ crew.alias }}</strong>
        </p>

        <fieldset v-if="crew.needsEmergency" class="ride-signup__group">
          <legend class="ride-signup__legend">{{ copy.emergencyTitle }}</legend>
          <p class="meta-text">{{ copy.emergencyLead }}</p>
          <div class="ride-signup__pair">
            <Field :label="copy.emergencyName">
              <Input v-model="form.emergencyName" :placeholder="copy.emergencyNamePlaceholder" autocomplete="off" />
            </Field>
            <Field :label="copy.emergencyPhone">
              <Input
                v-model="form.emergencyPhone"
                type="tel"
                :placeholder="copy.emergencyPhonePlaceholder"
                autocomplete="off"
              />
            </Field>
          </div>
        </fieldset>

        <template v-if="garage.length">
          <Select v-model="form.moto" :label="copy.motoPick" :options="motoOptions" />
          <RouterLink :to="garageTo" class="meta-text ride-signup__garage">{{ copy.garageEdit }}</RouterLink>
        </template>
        <template v-else>
          <Field :label="copy.motoLabel">
            <Input v-model="form.moto" :placeholder="copy.motoPlaceholder" />
          </Field>
          <RouterLink :to="garageTo" class="meta-text ride-signup__garage">{{ copy.garageCta }}</RouterLink>
        </template>

        <Select v-model="form.level" :label="copy.levelLabel" :options="levelOptions" />

        <div class="ride-signup__group">
          <span class="ride-signup__legend">{{ copy.passengerLabel }}</span>
          <Segmented v-model="form.passenger" :options="passengerOptions" />
          <template v-if="withPassenger">
            <Field :label="copy.passengerName" :hint="copy.passengerNote">
              <Input v-model="form.passengerName" autocomplete="off" />
            </Field>
          </template>
        </div>

        <div class="ride-signup__checks">
          <Choice v-model="form.docsOk" :label="copy.docsLabel" />
          <Choice v-model="form.rulesOk" :label="copy.rulesLabel" />
          <details class="ride-signup__rules">
            <summary>{{ copy.rulesToggle }}</summary>
            <strong class="ride-signup__legend">{{ rules.title }}</strong>
            <ol>
              <li v-for="item in rules.items" :key="item">{{ item }}</li>
            </ol>
          </details>
        </div>

        <Alert v-if="problem" tone="bad">{{ problem }}</Alert>
        <Button type="submit" :disabled="sending">{{ sending ? copy.sending : copy.submit }}</Button>
      </form>
    </template>

    <p v-else class="paola-outing__copy">{{ outingStatusCopy(outing.status) }}</p>
  </div>
</template>

<style scoped>
.ride-signup,
.ride-signup__form,
.ride-signup__actions,
.ride-signup__group,
.ride-signup__checks {
  display: grid;
  gap: 12px;
}

.ride-signup__group {
  margin: 0;
  padding: 0;
  border: 0;
  min-width: 0;
}

.ride-signup__group .meta-text {
  margin: 0;
}

.ride-signup__legend {
  padding: 0;
  font-family: Oswald, sans-serif;
  font-size: 0.9375rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.ride-signup__pair {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.ride-signup__garage {
  justify-self: start;
  margin-top: -4px;
  color: var(--paola-cyan, #48b4fc);
}

.ride-signup__checks {
  gap: 8px;
}

.ride-signup__rules {
  padding: 8px 16px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
}

.ride-signup__rules summary {
  cursor: pointer;
  color: var(--paola-cyan, #48b4fc);
}

.ride-signup__rules ol {
  display: grid;
  gap: 8px;
  margin: 8px 0 0;
  padding-left: 24px;
}

.ride-signup__actions {
  grid-auto-flow: column;
  justify-content: start;
}

@media (max-width: 479px) {
  .ride-signup__actions {
    grid-auto-flow: row;
  }

  .ride-signup__pair {
    grid-template-columns: 1fr;
  }
}
</style>
