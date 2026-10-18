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
import Input from '@ui/Input.vue'
import Segmented from '@ui/Segmented.vue'
import Select from '@ui/Select.vue'
import { showToast } from '@ui/toast.ts'

const NO_MOTO = '__sin_moto__'

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
  passenger: false,
  passengerName: '',
  docsOk: false,
  rulesOk: false,
  emergencyName: '',
  emergencyPhone: '',
})
const sending = ref(false)
const problem = ref('')
const showRules = ref(false)

const garage = computed(() => props.crew?.motorcycles ?? [])
const motoOptions = computed(() => [
  ...garage.value.map((label) => ({ value: label, label })),
  { value: NO_MOTO, label: copy.motoNone, muted: true },
])
const levelOptions = copy.levels.map((level) => ({ value: level.value, label: level.label }))

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
  if (form.passenger && !form.passengerName.trim()) return copy.missingPassenger
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
    passenger: form.passenger,
    passengerName: form.passenger ? form.passengerName : undefined,
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
    <p class="paola-empty__kicker">
      {{ copy.kicker }}
      <span v-if="crew?.signedIn && !crew.inscribed && open" class="ride-signup__as">
        {{ copy.asAlias }} <strong>{{ crew.alias }}</strong>
      </span>
    </p>

    <p v-if="failed" class="meta-text">{{ copy.loadFail }}</p>
    <p v-else-if="!crew" class="meta-text">{{ copy.loading }}</p>

    <template v-else-if="crew.inscribed">
      <RideFirm
        :module="module"
        :outing-id="outing.id"
        :confirmation="crew.confirmation"
        :ask="crew.confirmOpen"
        @confirmed="emit('changed')"
        @released="emit('changed')"
      />
      <p v-if="!crew.confirmOpen" class="meta-text">{{ copy.insideCopy }}</p>
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
        <section v-if="crew.needsEmergency" class="ride-signup__block ride-signup__block--sos">
          <header class="ride-signup__row-head">
            <span class="ride-signup__label">{{ copy.emergencyTitle }}</span>
            <span class="ride-signup__hint">{{ copy.emergencyNote }}</span>
          </header>
          <div class="ride-signup__pair">
            <Input
              v-model="form.emergencyName"
              :aria-label="copy.emergencyName"
              :placeholder="copy.emergencyNamePlaceholder"
              autocomplete="off"
            />
            <Input
              v-model="form.emergencyPhone"
              type="tel"
              :aria-label="copy.emergencyPhone"
              :placeholder="copy.emergencyPhonePlaceholder"
              autocomplete="off"
            />
          </div>
        </section>

        <section class="ride-signup__block">
          <header class="ride-signup__row-head">
            <span class="ride-signup__label">{{ copy.motoPick }}</span>
            <RouterLink :to="garageTo" class="ride-signup__link">
              {{ garage.length ? copy.garageEdit : copy.garageCta }}
            </RouterLink>
          </header>
          <div class="ride-signup__pair ride-signup__pair--moto">
            <Select v-if="garage.length" v-model="form.moto" :options="motoOptions" />
            <Input v-else v-model="form.moto" :aria-label="copy.motoLabel" :placeholder="copy.motoPlaceholder" />
            <Choice v-model="form.passenger" kind="switch" :label="copy.passengerYes" />
          </div>
          <div v-if="form.passenger" class="ride-signup__passenger">
            <Input v-model="form.passengerName" :aria-label="copy.passengerName" :placeholder="copy.passengerName" />
            <span class="ride-signup__hint">{{ copy.passengerNote }}</span>
          </div>
        </section>

        <section class="ride-signup__block">
          <span class="ride-signup__label">{{ copy.levelLabel }}</span>
          <Segmented v-model="form.level" :options="levelOptions" class="ride-signup__levels" />
        </section>

        <section class="ride-signup__block">
          <div class="ride-signup__checks">
            <Choice v-model="form.docsOk" :label="copy.docsLabel" />
            <span class="ride-signup__rules-check">
              <Choice v-model="form.rulesOk" :label="copy.rulesLabel" />
              <button type="button" class="ride-signup__link" @click="showRules = !showRules">
                {{ showRules ? copy.rulesHide : copy.rulesToggle }}
              </button>
            </span>
          </div>
          <ol v-if="showRules" class="ride-signup__rules" :aria-label="rules.title">
            <li v-for="item in rules.items" :key="item">{{ item }}</li>
          </ol>
        </section>

        <Alert v-if="problem" tone="bad">{{ problem }}</Alert>
        <Button type="submit" :disabled="sending">{{ sending ? copy.sending : copy.submit }}</Button>
      </form>
    </template>

    <p v-else class="paola-outing__copy">{{ outingStatusCopy(outing.status) }}</p>
  </div>
</template>

<style scoped>
.ride-signup,
.ride-signup__actions {
  display: grid;
  gap: 12px;
}

.ride-signup__as {
  margin-left: 4px;
  text-transform: none;
  letter-spacing: 0;
  color: rgba(255, 255, 255, 0.7);
}

.ride-signup__form {
  display: grid;
  gap: 8px;
}

.ride-signup__block {
  display: grid;
  gap: 8px;
  padding: 12px;
  border: 1px solid rgba(72, 180, 252, 0.14);
  border-radius: 10px;
  background: rgba(0, 16, 40, 0.45);
}

.ride-signup__block--sos {
  border-color: rgba(246, 178, 107, 0.35);
}

.ride-signup__row-head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 4px 12px;
}

.ride-signup__label {
  font-family: Oswald, sans-serif;
  font-size: 0.8125rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: rgba(255, 255, 255, 0.75);
}

.ride-signup__hint {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
}

.ride-signup__link {
  padding: 0;
  border: 0;
  background: none;
  font: inherit;
  font-size: 0.8125rem;
  color: var(--paola-cyan, #48b4fc);
  cursor: pointer;
  text-decoration: none;
}

.ride-signup__link:hover {
  text-decoration: underline;
}

.ride-signup__pair {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.ride-signup__pair--moto {
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
}

.ride-signup__pair :deep(.check--switch) {
  gap: 8px;
  white-space: nowrap;
  font-size: 0.875rem;
}

.ride-signup__passenger {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 8px;
}

.ride-signup__levels {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.ride-signup__checks {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 24px;
  font-size: 0.875rem;
}

.ride-signup__rules-check {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.ride-signup__rules {
  display: grid;
  gap: 4px;
  margin: 0;
  padding-left: 20px;
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.75);
}

.ride-signup__actions {
  grid-auto-flow: column;
  justify-content: start;
}

@media (max-width: 479px) {
  .ride-signup__actions {
    grid-auto-flow: row;
  }

  .ride-signup__pair,
  .ride-signup__pair--moto,
  .ride-signup__passenger {
    grid-template-columns: 1fr;
  }
}
</style>
