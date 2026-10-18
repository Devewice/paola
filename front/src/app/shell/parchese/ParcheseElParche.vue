<script setup lang="ts">
import { computed } from 'vue'
import { PARCHESE_COPY, PARCHESE_FIGURES } from '@app/constants/parchese.ts'
import { useAdminEdit } from '@app/shell/adminMode.ts'
import { shortDate, useParchese } from '@app/shell/parchese/context.ts'
import ClubRoster from '@modules/club/presentation/ClubRoster.vue'
import { usePageReveal } from '@shared/motion/usePageReveal.ts'
import { APP_PATHS } from '@shared/http/constants.ts'
import BoardHead from '@ui/BoardHead.vue'
import HubTile from '@ui/HubTile.vue'
import StatBand from '@ui/StatBand.vue'

const copy = PARCHESE_COPY
const bindReveal = usePageReveal()
const { deps, reloadInventory } = useParchese()
const { claveFor } = useAdminEdit()
const members = computed(() => deps.value.club.getMembers().items)
const next = computed(() => deps.value.rides.nextOpenOuting())
const memories = computed(() => deps.value.rides.getMemories())
const band = computed(() => [
  { value: members.value.length, label: copy.tileRosterMembers },
  { value: deps.value.club.getAlliances().items.length, label: copy.tileRosterAllies },
  {
    value: new Set(members.value.map((member) => member.moto?.trim().toLowerCase()).filter(Boolean)).size,
    label: copy.bandRosterMotos,
  },
])
</script>

<template>
  <div :ref="bindReveal" class="board">
    <StatBand
      :kicker="copy.bandRosterKicker"
      :title="copy.bandRosterTitle"
      :lead="members.length ? undefined : copy.bandRosterEmpty"
      :items="band"
      :mascot-src="PARCHESE_FIGURES.ROSTER_BAND"
      data-reveal
    />
    <div class="board-section" data-reveal>
      <ClubRoster :module="deps.club" :edit-clave="claveFor('parche')" @changed="reloadInventory" />
    </div>
    <section class="board-section" :aria-label="copy.moreTitle" data-reveal>
      <BoardHead :title="copy.moreTitle" :lead="copy.moreLead" />
      <div class="tile-strip">
        <HubTile
          size="compact"
          tone="blue"
          :to="APP_PATHS.PARCHESE_RODADAS"
          :kicker="next ? `${copy.tileRidesKicker} · ${shortDate(next.date)}` : copy.tileRidesKicker"
          :title="next?.title ?? copy.navAgenda"
          :cta="copy.tileRidesCta"
          :mascot-src="PARCHESE_FIGURES.MORE_RIDES"
        />
        <HubTile
          size="compact"
          tone="navy"
          :to="APP_PATHS.PARCHESE_MEMORIAS"
          :kicker="copy.tileMemoriesKicker"
          :title="memories.items[0]?.title ?? copy.navMemories"
          :image-src="memories.items[0]?.photos[0]?.src"
          :mascot-src="memories.items[0]?.photos[0] ? undefined : PARCHESE_FIGURES.MORE_MEMORIES"
          :cta="copy.tileMemoriesCta"
        />
        <HubTile
          size="compact"
          tone="armargura"
          :to="APP_PATHS.FEED"
          :kicker="copy.tileFeedKicker"
          :title="copy.tileFeedTitle"
          :cta="copy.railFeed"
          :mascot-src="PARCHESE_FIGURES.MORE_FEED"
        />
      </div>
    </section>
  </div>
</template>
