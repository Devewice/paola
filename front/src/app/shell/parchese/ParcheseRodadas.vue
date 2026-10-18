<script setup lang="ts">
import { computed } from 'vue'
import { PARCHESE_COPY, PARCHESE_FIGURES } from '@app/constants/parchese.ts'
import { useAdminEdit } from '@app/shell/adminMode.ts'
import ParcheseRail from '@app/shell/parchese/ParcheseRail.vue'
import { shortDate, useParchese } from '@app/shell/parchese/context.ts'
import { POLLS_COPY } from '@modules/polls/index.ts'
import PollCard from '@modules/polls/presentation/PollCard.vue'
import { RIDES_CARD_COPY, remainingSpots } from '@modules/rides/index.ts'
import AgendaSection from '@modules/rides/presentation/AgendaSection.vue'
import { usePageReveal } from '@shared/motion/usePageReveal.ts'
import { APP_PATHS } from '@shared/http/constants.ts'
import StatBand from '@ui/StatBand.vue'

const copy = PARCHESE_COPY
const bindReveal = usePageReveal()
const { deps, pollsFor, orphanPolls, onVoted, reloadInventory } = useParchese()
const { claveFor } = useAdminEdit()
const rides = computed(() => deps.value.rides)
const next = computed(() => rides.value.nextOpenOuting())
const upcoming = computed(() => rides.value.listOutings().filter((item) => rides.value.canClaim(item)))
const band = computed(() => [
  { value: upcoming.value.length, label: copy.tileRidesDates },
  {
    value: upcoming.value.reduce((sum, item) => sum + remainingSpots(item), 0),
    label: copy.tileRidesSpots,
  },
  { value: next.value ? shortDate(next.value.date) : copy.bandEmptyValue, label: copy.bandRidesNext },
])
</script>

<template>
  <div :ref="bindReveal" class="board">
    <StatBand
      :kicker="copy.bandRidesKicker"
      :title="copy.bandRidesTitle"
      :lead="next ? undefined : copy.tileRidesEmpty"
      :items="band"
      :mascot-src="PARCHESE_FIGURES.RIDES_BAND"
      data-reveal
    />
    <div class="board-split" data-reveal>
      <div class="board-main">
        <AgendaSection :module="rides" :edit-clave="claveFor('rodadas')" @changed="reloadInventory">
          <template #hilo="{ outing }">
            <p v-if="pollsFor(outing.id).length" class="ride-polls-count">
              <strong>{{ pollsFor(outing.id).length }}</strong>
              {{ pollsFor(outing.id).length === 1 ? RIDES_CARD_COPY.pollsOne : RIDES_CARD_COPY.pollsMany }}
            </p>
          </template>
        </AgendaSection>

        <section v-if="orphanPolls.length" class="ride-polls ride-polls--orphan">
          <h3 class="board-kicker">{{ POLLS_COPY.rideHeading }}</h3>
          <PollCard
            v-for="poll in orphanPolls"
            :key="poll.id"
            :module="deps.polls"
            :poll="poll"
            :account-to="APP_PATHS.ENTRAR"
            @voted="onVoted"
          />
        </section>
      </div>

      <ParcheseRail />
    </div>
  </div>
</template>

<style scoped>
.ride-polls {
  display: grid;
  gap: 12px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(72, 180, 252, 0.18);
}

.ride-polls-count {
  margin: 0;
  font-size: 12px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--paola-cyan, #48b4fc);
}

.ride-polls-count strong {
  font-family: var(--display, Oswald, sans-serif);
  font-size: 18px;
}
</style>
