<script setup lang="ts">
import { ref } from 'vue'
import type { Outing } from '@modules/rides/domain/entities/Outing.ts'
import type { ClaimedSpot, RidesModule } from '@modules/rides/index.ts'
import OutingClaimForm from '@modules/rides/presentation/OutingClaimForm.vue'
import PaolaEmpty from '@ui/PaolaEmpty.vue'
import PaolaOutingCard from '@ui/PaolaOutingCard.vue'
import PaolaVoiceBadge from '@ui/PaolaVoiceBadge.vue'

const props = defineProps<{
  module: RidesModule
}>()

const agenda = props.module.getAgenda()
const outings = ref<Outing[]>([...props.module.listOutings()])

function onClaimed(spot: ClaimedSpot): void {
  outings.value = outings.value.map((item) => (item.id === spot.outing.id ? spot.outing : item))
}

function statusCopy(status: Outing['status']): string {
  if (status === 'lleno') return 'Cupo lleno. Ya no se anota más gente.'
  if (status === 'cerrado') return 'Inscripción cerrada.'
  if (status === 'realizado') return 'Ya se rodó. Esta salida pasa a memorias cuando haya recuento.'
  return ''
}
</script>

<template>
  <section class="parchese-page__agenda" aria-label="Agenda">
    <PaolaVoiceBadge voice="loigca" />
    <h2 class="paola-page__heading type-display">Agenda</h2>
    <div v-if="outings.length" class="parchese-page__dates">
      <PaolaOutingCard
        v-for="(outing, index) in outings"
        :key="outing.id"
        :class="{ 'paola-outing--featured': index === 0 && outing.status !== 'realizado' }"
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
          v-if="outing.status === 'abierto'"
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
      title="Sin fecha"
      :copy="agenda.emptyCopy"
      mascot-src="/mascota/tumbada.png"
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
