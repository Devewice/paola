<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RIDES_AGENDA_COPY, RIDES_CARD_COPY } from '@modules/rides/constants/copy.ts'
import { daysUntil, remainingSpots, type Outing } from '@modules/rides/domain/entities/Outing.ts'
import type { OutingCrew } from '@modules/rides/domain/entities/Ticket.ts'
import type { RidesModule } from '@modules/rides/index.ts'
import RideFirm from '@modules/rides/presentation/RideFirm.vue'
import { outingStatusCopy } from '@modules/rides/presentation/outingStatusCopy.ts'
import { appRodada } from '@shared/http/constants.ts'
import { MASCOT } from '@shared/ui/mascot.ts'
import Button from '@ui/Button.vue'
import Empty from '@ui/Empty.vue'
import OutingCard from '@ui/OutingCard.vue'

const props = defineProps<{
  module: RidesModule
}>()

const emit = defineEmits<{ changed: [] }>()

const copy = RIDES_AGENDA_COPY
const cardCopy = RIDES_CARD_COPY
const agenda = computed(() => props.module.getAgenda())
const outings = computed(() => props.module.listOutings())
const today = new Date().toISOString().slice(0, 10)
const crews = ref<ReadonlyMap<string, OutingCrew>>(new Map())

const groups = computed(() => {
  const [first, ...others] = outings.value
  const hasFeatured = first !== undefined && props.module.canClaim(first)
  return [
    { id: 'featured', items: hasFeatured ? [first] : [] },
    { id: 'grid', items: hasFeatured ? others : outings.value },
  ].filter((group) => group.items.length > 0)
})

function upcoming(outing: Outing): boolean {
  return outing.status !== 'realizado' && outing.date >= today
}

async function loadCrews(): Promise<void> {
  const next = new Map<string, OutingCrew>()
  await Promise.all(
    outings.value.filter(upcoming).map(async (outing) => {
      const result = await props.module.loadCrew(outing.id)
      if (result.ok) next.set(outing.id, result.value)
    }),
  )
  crews.value = next
}

watch(outings, () => void loadCrews(), { immediate: true })

function inscribed(outing: Outing): OutingCrew | null {
  const crew = crews.value.get(outing.id)
  return crew?.inscribed ? crew : null
}

function countdown(outing: Outing): { value: string; unit: string } {
  const days = daysUntil(outing.date, today)
  if (days <= 0) return { value: cardCopy.today, unit: '' }
  if (days === 1) return { value: cardCopy.tomorrow, unit: '' }
  return { value: cardCopy.daysLeft(days), unit: cardCopy.daysUnit }
}

function fill(outing: Outing): number {
  if (!outing.capacity) return 0
  return Math.min(100, Math.round((outing.taken / outing.capacity) * 100))
}

async function onChanged(): Promise<void> {
  emit('changed')
  await loadCrews()
}
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
            <div v-if="upcoming(outing)" class="agenda__count">
              <strong class="agenda__count-value">{{ countdown(outing).value }}</strong>
              <span v-if="countdown(outing).unit" class="agenda__count-unit">{{ countdown(outing).unit }}</span>
            </div>

            <div v-if="upcoming(outing)" class="agenda__spots">
              <div class="agenda__bar" role="presentation">
                <span class="agenda__bar-fill" :style="{ width: `${fill(outing)}%` }" />
              </div>
              <span class="agenda__spots-text">
                {{
                  remainingSpots(outing)
                    ? cardCopy.spotsFree(remainingSpots(outing), outing.capacity)
                    : cardCopy.spotsFull
                }}
              </span>
            </div>

            <RideFirm
              v-if="inscribed(outing)"
              :module="module"
              :outing-id="outing.id"
              :confirmation="inscribed(outing)?.confirmation"
              :ask="inscribed(outing)?.confirmOpen"
              compact
              @confirmed="onChanged"
              @released="onChanged"
            >
              <Button size="sm" variant="ghost" :to="appRodada(outing.id)">{{ cardCopy.myCta }}</Button>
            </RideFirm>
            <template v-else-if="module.canClaim(outing)">
              <Button :to="appRodada(outing.id)">{{ cardCopy.signupCta }}</Button>
              <p class="agenda__note">{{ cardCopy.quickNote }}</p>
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
  gap: 16px;
  justify-items: start;
}

.agenda__count {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.agenda__count-value {
  font-family: Oswald, sans-serif;
  font-size: 3rem;
  line-height: 1;
  color: var(--paola-cyan, #48b4fc);
  text-shadow: 0 0 24px rgba(72, 180, 252, 0.35);
}

.agenda__count-unit {
  font-family: Oswald, sans-serif;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.7);
}

.agenda__spots {
  display: grid;
  gap: 8px;
  width: 100%;
  max-width: 320px;
}

.agenda__bar {
  height: 8px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(72, 180, 252, 0.14);
}

.agenda__bar-fill {
  display: block;
  height: 100%;
  min-width: 4px;
  border-radius: inherit;
  background: linear-gradient(90deg, #0088f8, #48b4fc);
  box-shadow: 0 0 12px rgba(72, 180, 252, 0.6);
}

.agenda__spots-text {
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.7);
}

.agenda__note {
  margin: -8px 0 0;
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.55);
}
</style>
