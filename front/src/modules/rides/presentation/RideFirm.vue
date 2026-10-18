<script setup lang="ts">
import { ref } from 'vue'
import { RIDES_FIRM_COPY } from '@modules/rides/constants/copy.ts'
import type { RidesModule } from '@modules/rides/composition.ts'
import type { RideConfirmation } from '@modules/rides/domain/entities/Ticket.ts'
import Button from '@ui/Button.vue'
import { showToast } from '@ui/toast.ts'

/** `ask` abre el "¿Sigues firme?"; sin él solo muestra que está dentro y deja soltar el cupo. */
const props = defineProps<{
  module: RidesModule
  outingId: string
  confirmation?: RideConfirmation
  ask?: boolean
  compact?: boolean
}>()

const emit = defineEmits<{ confirmed: []; released: [] }>()

const copy = RIDES_FIRM_COPY
const busy = ref(false)
const armed = ref(false)

async function confirm(): Promise<void> {
  if (busy.value) return
  busy.value = true
  armed.value = false
  const result = await props.module.confirmSpot(props.outingId)
  busy.value = false
  if (!result.ok) {
    showToast(result.error.message || copy.fail, 'bad')
    return
  }
  showToast(copy.confirmed, 'ok')
  emit('confirmed')
}

async function release(): Promise<void> {
  if (busy.value) return
  if (!armed.value) {
    armed.value = true
    return
  }
  busy.value = true
  const result = await props.module.releaseSpot(props.outingId)
  busy.value = false
  armed.value = false
  if (!result.ok) {
    showToast(result.error.message || copy.fail, 'bad')
    return
  }
  showToast(props.ask ? copy.released : copy.left, 'ok')
  emit('released')
}
</script>

<template>
  <div v-if="ask && confirmation !== 'firme'" class="ride-firm ride-firm--ask">
    <strong class="ride-firm__title">{{ copy.title }}</strong>
    <p class="meta-text">{{ copy.lead }}</p>
    <div class="ride-firm__actions">
      <Button size="sm" :disabled="busy" @click="confirm">{{ copy.confirm }}</Button>
      <Button size="sm" :variant="armed ? 'danger' : 'ghost'" :disabled="busy" @click="release">
        {{ armed ? copy.releaseConfirm : copy.release }}
      </Button>
    </div>
  </div>
  <div v-else class="ride-firm" :class="{ 'ride-firm--compact': compact }">
    <span class="ride-firm__badge">
      <span class="ride-firm__dot" aria-hidden="true" />
      {{ copy.insideTitle }}
      <em v-if="confirmation === 'firme'" class="ride-firm__firm">{{ copy.insideFirm }}</em>
    </span>
    <p v-if="!compact && confirmation === 'firme'" class="meta-text">{{ copy.firm }}</p>
    <div class="ride-firm__actions">
      <slot />
      <button
        type="button"
        class="ride-firm__leave"
        :class="{ 'is-armed': armed }"
        :disabled="busy"
        @click="release"
      >
        {{ armed ? copy.leaveConfirm : copy.leave }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.ride-firm {
  display: grid;
  gap: 8px;
  justify-items: start;
}

.ride-firm--ask {
  justify-items: stretch;
  padding: 16px;
  border: 1px solid rgba(72, 180, 252, 0.55);
  border-radius: 10px;
  background: rgba(0, 136, 248, 0.1);
}

.ride-firm__title {
  font-family: Oswald, sans-serif;
  font-size: 1.125rem;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.ride-firm .meta-text {
  margin: 0;
}

.ride-firm__badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border: 1px solid rgba(72, 180, 252, 0.45);
  border-radius: 999px;
  background: rgba(0, 136, 248, 0.14);
  font-family: Oswald, sans-serif;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.ride-firm__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #3ddc84;
  box-shadow: 0 0 8px rgba(61, 220, 132, 0.8);
}

.ride-firm__firm {
  padding: 0 8px;
  border-radius: 999px;
  background: #3ddc84;
  color: #05070c;
  font-style: normal;
  font-size: 0.75rem;
}

.ride-firm__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 16px;
}

.ride-firm__leave {
  padding: 0;
  border: 0;
  background: none;
  font: inherit;
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.55);
  text-decoration: underline;
  cursor: pointer;
}

.ride-firm__leave:hover,
.ride-firm__leave.is-armed {
  color: #ff6b6b;
}

.ride-firm__leave:disabled {
  opacity: 0.5;
  cursor: default;
}
</style>
