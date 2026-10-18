<script setup lang="ts">
import { ref } from 'vue'
import { RIDES_FIRM_COPY } from '@modules/rides/constants/copy.ts'
import type { RidesModule } from '@modules/rides/composition.ts'
import type { RideConfirmation } from '@modules/rides/domain/entities/Ticket.ts'
import Alert from '@ui/Alert.vue'
import Button from '@ui/Button.vue'
import { showToast } from '@ui/toast.ts'

const props = defineProps<{
  module: RidesModule
  outingId: string
  confirmation?: RideConfirmation
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
  showToast(copy.released, 'ok')
  emit('released')
}
</script>

<template>
  <Alert v-if="confirmation === 'firme'" tone="ok">{{ copy.firm }}</Alert>
  <div v-else class="ride-firm">
    <strong class="ride-firm__title">{{ copy.title }}</strong>
    <p class="meta-text">{{ copy.lead }}</p>
    <div class="ride-firm__actions">
      <Button size="sm" :disabled="busy" @click="confirm">{{ copy.confirm }}</Button>
      <Button size="sm" :variant="armed ? 'danger' : 'ghost'" :disabled="busy" @click="release">
        {{ armed ? copy.releaseConfirm : copy.release }}
      </Button>
    </div>
  </div>
</template>

<style scoped>
.ride-firm {
  display: grid;
  gap: 8px;
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

.ride-firm__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
