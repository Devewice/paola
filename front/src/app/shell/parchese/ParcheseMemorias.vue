<script setup lang="ts">
import { computed } from 'vue'
import { PARCHESE_COPY, PARCHESE_FIGURES } from '@app/constants/parchese.ts'
import { useAdminEdit } from '@app/shell/adminMode.ts'
import { shortDate, useParchese } from '@app/shell/parchese/context.ts'
import MemoriasSection from '@modules/rides/presentation/MemoriasSection.vue'
import { usePageReveal } from '@shared/motion/usePageReveal.ts'
import { APP_PATHS } from '@shared/http/constants.ts'
import BoardHead from '@ui/BoardHead.vue'
import HubTile from '@ui/HubTile.vue'

const copy = PARCHESE_COPY
const bindReveal = usePageReveal()
const { deps, reloadInventory } = useParchese()
const { claveFor } = useAdminEdit()
const empty = computed(() => !deps.value.rides.getMemories().items.length)
const next = computed(() => deps.value.rides.nextOpenOuting())
</script>

<template>
  <div :ref="bindReveal" class="board">
    <div class="board-section" data-reveal>
      <MemoriasSection :module="deps.rides" :edit-clave="claveFor('rodadas')" @changed="reloadInventory" />
    </div>
    <section v-if="empty" class="board-section" :aria-label="copy.memoriesWhileTitle" data-reveal>
      <BoardHead :title="copy.memoriesWhileTitle" :lead="copy.memoriesWhileLead" />
      <div class="tile-strip">
        <HubTile
          tone="navy"
          :to="APP_PATHS.PARCHESE_RODADAS"
          :kicker="next ? `${copy.tileRidesKicker} · ${shortDate(next.date)}` : copy.tileRidesKicker"
          :title="next?.title ?? copy.navAgenda"
          :cta="copy.tileRidesCta"
          :mascot-src="PARCHESE_FIGURES.MORE_RIDES"
        >
          <p class="hub-meta">{{ next ? next.meetingPoint : copy.tileRidesEmpty }}</p>
        </HubTile>
        <HubTile
          tone="armargura"
          :to="APP_PATHS.FEED"
          :kicker="copy.tileFeedKicker"
          :title="copy.tileFeedTitle"
          :cta="copy.railFeed"
          :mascot-src="PARCHESE_FIGURES.MORE_FEED"
        >
          <p class="hub-meta">{{ copy.tileFeedLead }}</p>
        </HubTile>
      </div>
    </section>
  </div>
</template>
