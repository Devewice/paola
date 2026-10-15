<script setup lang="ts">
import { computed } from 'vue'
import { RIDES_AGENDA_COPY, RIDES_CARD_COPY } from '@modules/rides/constants/copy.ts'
import type { RidesModule } from '@modules/rides/index.ts'
import { outingStatusCopy } from '@modules/rides/presentation/outingStatusCopy.ts'
import { appRodada } from '@shared/http/constants.ts'
import { MASCOT } from '@shared/ui/mascot.ts'
import Button from '@ui/Button.vue'
import Empty from '@ui/Empty.vue'
import OutingCard from '@ui/OutingCard.vue'

const props = defineProps<{
  module: RidesModule
}>()

const copy = RIDES_AGENDA_COPY
const cardCopy = RIDES_CARD_COPY
const agenda = computed(() => props.module.getAgenda())
const outings = computed(() => props.module.listOutings())

const groups = computed(() => {
  const [first, ...others] = outings.value
  const hasFeatured = first !== undefined && props.module.canClaim(first)
  return [
    { id: 'featured', items: hasFeatured ? [first] : [] },
    { id: 'grid', items: hasFeatured ? others : outings.value },
  ].filter((group) => group.items.length > 0)
})
</script>

<template>
  <section class="agenda" :aria-label="copy.aria">
    <div v-if="outings.length" class="agenda__dates">
      <div v-for="group in groups" :key="group.id" :class="`agenda__${group.id}`">
        <OutingCard
          v-for="outing in group.items"
          :key="outing.id"
          :class="{ 'paola-outing--featured': group.id === 'featured' }"
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
          <div class="agenda__cta">
            <template v-if="module.canClaim(outing)">
              <Button :to="appRodada(outing.id)">{{ cardCopy.signupCta }}</Button>
            </template>
            <template v-else>
              <p class="paola-outing__copy">{{ outingStatusCopy(outing.status) }}</p>
              <Button variant="ghost" size="sm" :to="appRodada(outing.id)">{{ cardCopy.detailCta }}</Button>
            </template>
            <slot name="hilo" :outing="outing" />
          </div>
        </OutingCard>
      </div>
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

.agenda__dates {
  display: grid;
  gap: 16px;
}

.agenda__grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr));
  align-items: start;
}

.agenda__cta {
  display: grid;
  gap: 12px;
  justify-items: start;
}
</style>
