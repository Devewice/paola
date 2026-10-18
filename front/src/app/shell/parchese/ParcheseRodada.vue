<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getAppDependencies, refreshInventory } from '@app/bootstrap.ts'
import { PARCHESE_FIGURES } from '@app/constants/parchese.ts'
import { useAdminEdit } from '@app/shell/adminMode.ts'
import { useParchese } from '@app/shell/parchese/context.ts'
import PollCard from '@modules/polls/presentation/PollCard.vue'
import { RIDES_PAGE_COPY, type ClaimedSpot, type Outing, type OutingCrew } from '@modules/rides/index.ts'
import OutingAdminTools from '@modules/rides/presentation/OutingAdminTools.vue'
import RideSignup from '@modules/rides/presentation/RideSignup.vue'
import { usePageReveal } from '@shared/motion/usePageReveal.ts'
import { APP_PATHS, appEntrarYVolver, appRodada } from '@shared/http/constants.ts'
import { MASCOT } from '@shared/ui/mascot.ts'
import AdminSpot from '@ui/AdminSpot.vue'
import BoardHead from '@ui/BoardHead.vue'
import Button from '@ui/Button.vue'
import Empty from '@ui/Empty.vue'
import OutingCard from '@ui/OutingCard.vue'
import StepsPoster from '@ui/StepsPoster.vue'

const copy = RIDES_PAGE_COPY
const route = useRoute()
const router = useRouter()
const bindReveal = usePageReveal()
const { deps, pollsFor, onVoted, reloadPolls } = useParchese()
const { claveFor } = useAdminEdit()
const rideClave = computed(() => claveFor('rodadas'))

const outingId = computed(() => String(route.params.id ?? ''))
const fresh = ref<Outing | null>(null)
const outing = computed(() => {
  const stored = deps.value.rides.getOuting(outingId.value)
  return fresh.value?.id === outingId.value ? fresh.value : stored
})
const polls = computed(() => pollsFor(outingId.value))
const crew = ref<OutingCrew | null>(null)
const crewFailed = ref(false)
const enterTo = computed(() => appEntrarYVolver(appRodada(outingId.value)))

async function loadCrew(): Promise<void> {
  if (!outing.value) return
  crewFailed.value = false
  const result = await deps.value.rides.loadCrew(outingId.value)
  if (result.ok) crew.value = result.value
  else crewFailed.value = true
}

watch([outingId, () => deps.value.rides], () => {
  crew.value = null
  fresh.value = null
  void loadCrew()
}, { immediate: true })

async function onInscribed(spot: ClaimedSpot): Promise<void> {
  fresh.value = spot.outing
  await Promise.all([loadCrew(), reloadPolls()])
}

async function onSpotChanged(): Promise<void> {
  await refreshInventory()
  fresh.value = getAppDependencies().rides.getOuting(outingId.value)
  await loadCrew()
}

function initial(alias: string): string {
  return alias.trim().charAt(0).toUpperCase() || '·'
}
</script>

<template>
  <div :ref="bindReveal" class="board">
    <div class="ride-page__back">
      <Button variant="ghost" size="sm" :to="APP_PATHS.PARCHESE_RODADAS">{{ copy.back }}</Button>
    </div>

    <Empty
      v-if="!outing"
      compact
      hide-cta
      :title="copy.notFoundTitle"
      :copy="copy.notFoundCopy"
      :mascot-src="MASCOT.TUMBADA"
    />

    <template v-else>
      <AdminSpot id="inscripcion" class="ride-page__card" :active="Boolean(rideClave)" data-reveal>
        <template #tools>
          <OutingAdminTools
            :module="deps.rides"
            :clave="rideClave"
            :outing="outing"
            @changed="onSpotChanged"
            @removed="router.push(APP_PATHS.PARCHESE_RODADAS)"
          />
        </template>
        <OutingCard
          class="paola-outing--featured"
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
          <RideSignup
            :module="deps.rides"
            :outing="outing"
            :crew="crew"
            :failed="crewFailed"
            :enter-to="enterTo"
            :garage-to="APP_PATHS.CUENTA"
            @inscribed="onInscribed"
            @changed="onSpotChanged"
          />
        </OutingCard>
      </AdminSpot>

      <div class="board-split" data-reveal>
        <section class="board-main" :aria-label="copy.pollsTitle">
          <BoardHead voice="loigca" :title="copy.pollsTitle" :lead="copy.pollsLead" />
          <div v-if="polls.length" class="ride-page__polls">
            <PollCard
              v-for="poll in polls"
              :key="poll.id"
              :module="deps.polls"
              :poll="poll"
              :account-to="enterTo"
              @voted="onVoted"
            />
          </div>
          <p v-else class="meta-text">{{ copy.pollsEmpty }}</p>
        </section>

        <aside class="board-rail">
          <section v-if="crew?.inscribed" class="poster poster--blue ride-crew" :aria-label="copy.crewTitle">
            <h3 class="type-brush-dry type-brush-dry--xs">{{ copy.crewTitle }}</h3>
            <ul v-if="crew.riders.length" class="ride-crew__list">
              <li v-for="rider in crew.riders" :key="rider.alias" class="ride-crew__rider">
                <img v-if="rider.avatarSrc" class="ride-crew__avatar" :src="rider.avatarSrc" alt="" />
                <span v-else class="ride-crew__avatar" aria-hidden="true">{{ initial(rider.alias) }}</span>
                <span class="ride-crew__who">
                  <strong>{{ rider.alias }}</strong>
                  <span>{{ rider.moto || copy.crewNoMoto }}</span>
                </span>
              </li>
            </ul>
            <p v-else>{{ copy.crewEmpty }}</p>
            <Button size="sm" variant="ghost" :to="APP_PATHS.CUENTA">{{ copy.crewChat }}</Button>
          </section>
          <StepsPoster
            v-else
            tone="navy"
            :title="copy.crewLockedTitle"
            :steps="copy.crewLockedSteps"
            :mascot-src="PARCHESE_FIGURES.JOIN"
            class="poster--mascot-top"
          />
        </aside>
      </div>
    </template>
  </div>
</template>

<style scoped>
.ride-page__back {
  display: flex;
}

.ride-page__card {
  scroll-margin-top: 96px;
}

.ride-page__polls {
  display: grid;
  gap: 16px;
}

.ride-crew__list {
  display: grid;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.ride-crew__rider {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 12px;
  align-items: center;
  padding: 8px 10px;
  border: 1px solid rgba(72, 180, 252, 0.16);
  border-radius: 10px;
  background: rgba(5, 7, 12, 0.45);
}

.ride-crew__avatar {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border: 1px solid var(--paola-cyan, #48b4fc);
  border-radius: 50%;
  object-fit: cover;
  background: rgba(0, 16, 40, 0.8);
  font-family: var(--display, Oswald, sans-serif);
  font-size: 16px;
}

.ride-crew__who {
  display: grid;
  min-width: 0;
  font-size: 13px;
}

.ride-crew__who strong {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
}

.ride-crew__who span {
  color: rgba(234, 242, 255, 0.7);
}
</style>
