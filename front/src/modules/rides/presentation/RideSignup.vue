<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RIDES_SIGNUP_COPY } from '@modules/rides/constants/copy.ts'
import type { Outing } from '@modules/rides/domain/entities/Outing.ts'
import type { ClaimedSpot, OutingCrew } from '@modules/rides/domain/entities/Ticket.ts'
import type { RidesModule } from '@modules/rides/composition.ts'
import { outingStatusCopy } from '@modules/rides/presentation/outingStatusCopy.ts'
import Alert from '@ui/Alert.vue'
import Button from '@ui/Button.vue'
import Field from '@ui/Field.vue'
import Input from '@ui/Input.vue'
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

const emit = defineEmits<{ inscribed: [spot: ClaimedSpot] }>()

const copy = RIDES_SIGNUP_COPY
const whatsapp = ref('')
const moto = ref('')
const sending = ref(false)

const garage = computed(() => props.crew?.motorcycles ?? [])
const motoOptions = computed(() => [
  ...garage.value.map((label) => ({ value: label, label })),
  { value: NO_MOTO, label: copy.motoNone, muted: true },
])

watch(
  garage,
  (list) => {
    if (list.length && !moto.value) moto.value = list[0] ?? ''
  },
  { immediate: true },
)

const open = computed(() => props.module.canClaim(props.outing))
const notice = computed(() =>
  props.crew?.inscribed && props.crew.alias ? props.module.noticeFor(props.outing, props.crew.alias) : null,
)

async function submit(): Promise<void> {
  if (sending.value) return
  sending.value = true
  const noMoto = moto.value === NO_MOTO
  const result = await props.module.claimSpot(props.outing.id, {
    whatsapp: props.crew?.needsWhatsapp ? whatsapp.value : undefined,
    moto: !noMoto && moto.value ? moto.value : undefined,
    noMoto: noMoto || undefined,
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
      <Alert tone="ok">
        <strong>{{ copy.insideTitle }}.</strong> {{ copy.insideCopy }}
      </Alert>
      <div v-if="notice" class="ride-signup__actions">
        <Button size="sm" :href="notice.whatsappHref" target="_blank">{{ copy.insideWhatsapp }}</Button>
        <Button size="sm" variant="ghost" :href="notice.mailtoHref">{{ copy.insideMail }}</Button>
      </div>
    </template>

    <template v-else-if="open">
      <Alert v-if="outing.paid" tone="info">{{ copy.paidNotice }}</Alert>

      <template v-if="!crew.signedIn">
        <p class="meta-text">{{ copy.guestLead }}</p>
        <Button :to="enterTo">{{ copy.guestCta }}</Button>
      </template>

      <form v-else class="ride-signup__form" @submit.prevent="submit">
        <p class="meta-text">
          {{ copy.asAlias }} <strong>{{ crew.alias }}</strong>
        </p>
        <template v-if="crew.needsWhatsapp">
          <p class="meta-text">{{ copy.firstTimeLead }}</p>
          <Field :label="copy.whatsappLabel">
            <Input v-model="whatsapp" :placeholder="copy.whatsappPlaceholder" type="tel" autocomplete="tel" />
          </Field>
        </template>
        <template v-if="garage.length">
          <Select v-model="moto" :label="copy.motoPick" :options="motoOptions" />
          <RouterLink :to="garageTo" class="meta-text ride-signup__garage">{{ copy.garageEdit }}</RouterLink>
        </template>
        <template v-else>
          <Field :label="copy.motoLabel">
            <Input v-model="moto" :placeholder="copy.motoPlaceholder" />
          </Field>
          <RouterLink :to="garageTo" class="meta-text ride-signup__garage">{{ copy.garageCta }}</RouterLink>
        </template>
        <Button type="submit" :disabled="sending">{{ sending ? copy.sending : copy.submit }}</Button>
      </form>
    </template>

    <p v-else class="paola-outing__copy">{{ outingStatusCopy(outing.status) }}</p>
  </div>
</template>

<style scoped>
.ride-signup,
.ride-signup__form,
.ride-signup__actions {
  display: grid;
  gap: 12px;
}

.ride-signup__garage {
  justify-self: start;
  margin-top: -4px;
  color: var(--paola-cyan, #48b4fc);
}

.ride-signup__actions {
  grid-auto-flow: column;
  justify-content: start;
}

@media (max-width: 479px) {
  .ride-signup__actions {
    grid-auto-flow: row;
  }
}
</style>
