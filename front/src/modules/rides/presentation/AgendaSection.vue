<script setup lang="ts">
import type { RidesModule } from '@modules/rides/index.ts'
import PaolaEmpty from '@ui/PaolaEmpty.vue'
import PaolaOutingCard from '@ui/PaolaOutingCard.vue'
import PaolaVoiceBadge from '@ui/PaolaVoiceBadge.vue'

const props = defineProps<{
  module: RidesModule
  joinHref?: string
}>()

const agenda = props.module.getAgenda()
const outings = props.module.listOutings()
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
        :what-to-bring="outing.whatToBring"
        :paid="outing.paid"
        :join-href="joinHref"
      />
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
