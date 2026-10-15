<script setup lang="ts">
import { computed, ref } from 'vue'
import { RIDES_AGENDA_COPY, RIDES_STATUS } from '@modules/rides/constants/copy.ts'
import type { Outing } from '@modules/rides/domain/entities/Outing.ts'
import type { ClaimedSpot, RidesModule } from '@modules/rides/index.ts'
import OutingClaimForm from '@modules/rides/presentation/OutingClaimForm.vue'
import { MASCOT } from '@shared/ui/mascot.ts'
import Empty from '@ui/Empty.vue'
import OutingCard from '@ui/OutingCard.vue'
import VoiceBadge from '@ui/VoiceBadge.vue'

const props = defineProps<{
  module: RidesModule
}>()

const copy = RIDES_AGENDA_COPY
const claimed = ref<Record<string, Outing>>({})
const agenda = computed(() => props.module.getAgenda())
const outings = computed(() =>
  props.module.listOutings().map((item) => claimed.value[item.id] ?? item),
)

function onClaimed(spot: ClaimedSpot): void {
  claimed.value = { ...claimed.value, [spot.outing.id]: spot.outing }
}

function statusCopy(status: Outing['status']): string {
  if (status === RIDES_STATUS.LLENO) return copy.full
  if (status === RIDES_STATUS.CERRADO) return copy.closed
  if (status === RIDES_STATUS.REALIZADO) return copy.done
  return copy.past
}
</script>

<template>
  <section class="agenda" :aria-label="copy.aria">
    <header class="agenda__head">
      <VoiceBadge voice="loigca" />
      <h2 class="paola-page__heading type-display">{{ copy.heading }}</h2>
    </header>
    <div v-if="outings.length" class="agenda__dates">
      <OutingCard
        v-for="(outing, index) in outings"
        :key="outing.id"
        :class="{ 'paola-outing--featured': index === 0 && module.canClaim(outing) }"
        :title="outing.title"
        :date="outing.date"
        :kind="outing.kind"
        :status="outing.status"
        :meeting-point="outing.meetingPoint"
        :route-text="outing.routeText"
        :map-href="outing.mapHref"
        :capacity="outing.capacity"
        :taken="outing.taken"
        :what-to-bring="outing.whatToBring"
        :paid="outing.paid"
      >
        <OutingClaimForm
          v-if="module.canClaim(outing)"
          :paid="outing.paid"
          :claim="(draft) => module.claimSpot(outing.id, draft)"
          @claimed="onClaimed"
        />
        <p v-else class="paola-outing__copy">{{ statusCopy(outing.status) }}</p>
        <slot name="hilo" :outing="outing" />
      </OutingCard>
    </div>
    <Empty
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
.agenda {
  display: grid;
  gap: 16px;
  min-width: 0;
}

.agenda__head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.agenda__dates {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 18rem), 1fr));
}
</style>
