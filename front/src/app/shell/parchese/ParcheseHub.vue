<script setup lang="ts">
import { computed } from 'vue'
import { PARCHESE_COPY, PARCHESE_HUB } from '@app/constants/parchese.ts'
import { shortDate, useParchese } from '@app/shell/parchese/context.ts'
import { remainingSpots } from '@modules/rides/index.ts'
import { usePageReveal } from '@shared/motion/usePageReveal.ts'
import { APP_PATHS } from '@shared/http/constants.ts'
import { MASCOT } from '@shared/ui/mascot.ts'
import AvatarStack from '@ui/AvatarStack.vue'
import HubTile from '@ui/HubTile.vue'

const copy = PARCHESE_COPY
const bindReveal = usePageReveal()
const { deps } = useParchese()

const rides = computed(() => deps.value.rides)
const next = computed(() => rides.value.nextOpenOuting())
const upcoming = computed(() => rides.value.getAgenda().items.filter((item) => item.when === 'proxima'))
const dates = computed(() => upcoming.value.slice(0, PARCHESE_HUB.DATES))

const memories = computed(() => rides.value.getMemories())
const latest = computed(() => memories.value.items[0] ?? null)
const photoCount = computed(() => memories.value.items.reduce((sum, item) => sum + item.photos.length, 0))

const members = computed(() => deps.value.club.getMembers().items)
const allies = computed(() => deps.value.club.getAlliances().items)
const initials = computed(() =>
  members.value.slice(0, PARCHESE_HUB.AVATARS).map((member) => member.alias.slice(0, 2).toUpperCase()),
)
const moreMembers = computed(() =>
  members.value.length > PARCHESE_HUB.AVATARS ? `+${members.value.length - PARCHESE_HUB.AVATARS}` : undefined,
)
</script>

<template>
  <div :ref="bindReveal" class="board">
    <div class="hub-bento">
      <HubTile
        size="hero"
        index="02"
        voice="loigca"
        :to="APP_PATHS.PARCHESE_RODADAS"
        :mascot-src="PARCHESE_HUB.RIDES_FIGURE"
        :kicker="copy.tileRidesKicker"
        :title="next ? next.title : copy.navAgenda"
        :cta="copy.tileRidesCta"
        data-reveal
      >
        <template v-if="next">
          <p class="hub-meta">{{ shortDate(next.date) }} · {{ next.meetingPoint }}</p>
          <span class="hub-stats">
            <span class="hub-stat">
              <strong>{{ remainingSpots(next) }}</strong>
              <span>{{ copy.tileRidesSpots }}</span>
            </span>
            <span class="hub-stat">
              <strong>{{ upcoming.length }}</strong>
              <span>{{ copy.tileRidesDates }}</span>
            </span>
          </span>
          <span v-if="dates.length > 1" class="hub-dates">
            <span v-for="item in dates" :key="item.id" class="hub-date">
              <strong>{{ shortDate(item.date) }}</strong>
              <span>{{ item.title }}</span>
            </span>
          </span>
        </template>
        <p v-else class="hub-meta">{{ copy.tileRidesEmpty }}</p>
      </HubTile>

      <HubTile
        index="03"
        voice="incauta"
        :to="APP_PATHS.PARCHESE_MEMORIAS"
        tone="blue"
        :image-src="latest?.photos[0]?.src"
        :mascot-src="latest?.photos[0] ? undefined : MASCOT.LENTE"
        :kicker="latest ? copy.tileMemoriesKicker : undefined"
        :title="latest ? latest.title : copy.navMemories"
        :cta="copy.tileMemoriesCta"
        data-reveal
      >
        <span v-if="latest" class="hub-stats">
          <span class="hub-stat">
            <strong>{{ memories.totalKm }}</strong>
            <span>{{ copy.tileMemoriesKm }}</span>
          </span>
          <span class="hub-stat">
            <strong>{{ photoCount }}</strong>
            <span>{{ copy.tileMemoriesPhotos }}</span>
          </span>
        </span>
        <p v-else class="hub-meta">{{ copy.tileMemoriesEmpty }}</p>
      </HubTile>

      <HubTile
        index="04"
        :to="APP_PATHS.PARCHESE_EL_PARCHE"
        :mascot-src="MASCOT.EN_PIE"
        :title="copy.navMembers"
        :cta="copy.tileRosterCta"
        data-reveal
      >
        <p class="hub-meta">{{ copy.tileRosterLead }}</p>
        <span class="hub-stats">
          <span class="hub-stat">
            <strong>{{ members.length }}</strong>
            <span>{{ copy.tileRosterMembers }}</span>
          </span>
          <span class="hub-stat">
            <strong>{{ allies.length }}</strong>
            <span>{{ copy.tileRosterAllies }}</span>
          </span>
        </span>
        <span v-if="initials.length" class="hub-avatars">
          <AvatarStack :initials="initials" :more="moreMembers" />
        </span>
      </HubTile>

      <HubTile
        size="wide"
        tone="blue"
        :to="APP_PATHS.FEED"
        :mascot-src="MASCOT.X5"
        :kicker="copy.tileFeedKicker"
        :title="copy.tileFeedTitle"
        :cta="copy.railFeed"
        data-reveal
      >
        <p class="hub-meta">{{ copy.tileFeedLead }}</p>
      </HubTile>
    </div>
  </div>
</template>

<style scoped>
.hub-avatars {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
</style>
