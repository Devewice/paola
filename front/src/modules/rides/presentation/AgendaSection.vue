<script setup lang="ts">
import { ref } from 'vue'
import { RIDES_AGENDA_COPY, RIDES_STATUS } from '@modules/rides/constants/copy.ts'
import type { Outing } from '@modules/rides/domain/entities/Outing.ts'
import type { ClaimedSpot, RidesModule } from '@modules/rides/index.ts'
import OutingClaimForm from '@modules/rides/presentation/OutingClaimForm.vue'
import { MASCOT } from '@shared/ui/mascot.ts'
import PaolaEmpty from '@ui/PaolaEmpty.vue'
import PaolaOutingCard from '@ui/PaolaOutingCard.vue'
import PaolaVoiceBadge from '@ui/PaolaVoiceBadge.vue'

const props = defineProps<{
  module: RidesModule
}>()

const agenda = props.module.getAgenda()
const outings = ref<Outing[]>([...props.module.listOutings()])
const copy = RIDES_AGENDA_COPY

function onClaimed(spot: ClaimedSpot): void {
  outings.value = outings.value.map((item) => (item.id === spot.outing.id ? spot.outing : item))
}

function statusCopy(status: Outing['status']): string {
  if (status === RIDES_STATUS.LLENO) return copy.full
  if (status === RIDES_STATUS.CERRADO) return copy.closed
  if (status === RIDES_STATUS.REALIZADO) return copy.done
  return ''
}
</script>

<template>
  <section class="parchese-page__agenda" :aria-label="copy.aria">
    <PaolaVoiceBadge voice="loigca" />
    <h2 class="paola-page__heading type-display">{{ copy.heading }}</h2>
    <div v-if="outings.length" class="parchese-page__dates">
      <PaolaOutingCard
        v-for="(outing, index) in outings"
        :key="outing.id"
        :class="{ 'paola-outing--featured': index === 0 && outing.status !== RIDES_STATUS.REALIZADO }"
        :title="outing.title"
        :date="outing.date"
        :kind="outing.kind"
        :status="outing.status"
        :meeting-point="outing.meetingPoint"
        :route-text="outing.routeText"
        :capacity="outing.capacity"
        :taken="outing.taken"
        :what-to-bring="outing.whatToBring"
        :paid="outing.paid"
      >
        <OutingClaimForm
          v-if="outing.status === RIDES_STATUS.ABIERTO"
          :paid="outing.paid"
          :claim="(draft) => module.claimSpot(outing.id, draft)"
          @claimed="onClaimed"
        />
        <p v-else class="paola-outing__copy">{{ statusCopy(outing.status) }}</p>
      </PaolaOutingCard>
    </div>
    <PaolaEmpty
      v-else
      compact
      hide-cta
      :title="copy.emptyTitle"
      :copy="agenda.emptyCopy"
      :mascot-src="MASCOT.TUMBADA"
    />
  </section>
</template>

<style scoped>
.parchese-page__agenda {
  display: grid;
  gap: 12px;
}

.parchese-page__dates {
  display: grid;
  gap: 16px;
}

@media (min-width: 640px) {
  .parchese-page__dates {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
