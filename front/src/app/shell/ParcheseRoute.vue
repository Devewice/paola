<script setup lang="ts">
import { computed, onMounted, provide, ref, watch } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { getAppDependencies, inventoryVersion, refreshInventory } from '@app/bootstrap.ts'
import { PARCHESE_COPY, PARCHESE_HERO_PHOTO, PARCHESE_NAV } from '@app/constants/parchese.ts'
import { PARCHESE_CONTEXT, shortDate } from '@app/shell/parchese/context.ts'
import type { Poll } from '@modules/polls/index.ts'
import { RIDES_KIND_LABEL } from '@modules/rides/index.ts'
import { usePageReveal } from '@shared/motion/usePageReveal.ts'
import AficheHero from '@ui/AficheHero.vue'
import Button from '@ui/Button.vue'
import Icon from '@ui/Icon.vue'
import SectionTabs from '@ui/SectionTabs.vue'

const copy = PARCHESE_COPY
const route = useRoute()
const bindReveal = usePageReveal()

onMounted(async () => {
  await refreshInventory()
})

const deps = computed(() => {
  void inventoryVersion.value
  return getAppDependencies()
})

const rides = computed(() => deps.value.rides)
const join = computed(() => deps.value.club.getJoinChannel())

const SUBPAGE_HEROES: Record<string, { title: string; plate: string; lead: string }> = {
  'parchese-rodadas': { title: copy.navAgenda, ...copy.heroRides },
  'parchese-memorias': { title: copy.navMemories, ...copy.heroMemories },
  'parchese-el-parche': { title: copy.navMembers, ...copy.heroRoster },
}
const rideHero = computed(() => {
  if (route.name !== 'parchese-rodada') return null
  const outing = rides.value.getOuting(String(route.params.id ?? ''))
  if (!outing) return { title: copy.navAgenda, ...copy.heroRides }
  const done = outing.status === 'realizado'
  const tintada = outing.kind === 'tintada'
  const plate = tintada
    ? done ? copy.heroTintadaDonePlate : copy.heroTintadaPlate
    : done ? copy.heroRideDonePlate : copy.heroRidePlate
  return {
    title: outing.title,
    plate,
    lead: `${RIDES_KIND_LABEL[outing.kind]} · ${shortDate(outing.date)}`,
    photo: outing.cover?.src,
  }
})
const subpage = computed(() => rideHero.value ?? SUBPAGE_HEROES[String(route.name)] ?? null)

const polls = ref<readonly Poll[]>([])
const rideIds = computed(() => new Set(rides.value.listOutings().map((outing) => outing.id)))

async function reloadPolls(): Promise<void> {
  const result = await deps.value.polls.list()
  polls.value = result.ok ? result.value.filter((poll) => poll.outingId) : []
}

watch(() => deps.value.polls, () => void reloadPolls(), { immediate: true })

function pollsFor(outingId: string): readonly Poll[] {
  return polls.value.filter((poll) => poll.outingId === outingId)
}

function onVoted(poll: Poll) {
  polls.value = polls.value.map((item) => (item.id === poll.id ? poll : item))
}

const orphanPolls = computed(() => polls.value.filter((poll) => poll.outingId && !rideIds.value.has(poll.outingId)))

async function reloadInventory(): Promise<void> {
  await refreshInventory()
}

provide(PARCHESE_CONTEXT, { deps, pollsFor, orphanPolls, onVoted, reloadPolls, reloadInventory })
</script>

<template>
  <div :ref="bindReveal" class="parchese-page">
    <AficheHero
      v-if="subpage"
      compact
      :kicker="copy.title"
      :title="subpage.title"
      :plate="subpage.plate"
      :photo-src="rideHero?.photo ?? PARCHESE_HERO_PHOTO"
    >
      <template #lead>{{ subpage.lead }}</template>
    </AficheHero>
    <AficheHero
      v-else
      :kicker="copy.kicker"
      :title="copy.title"
      :plate="copy.plate"
      :photo-src="PARCHESE_HERO_PHOTO"
      data-reveal
    >
      <template #lead>{{ copy.lead }}</template>
      <template #actions>
        <Button variant="hero" :href="join.href" target="_blank">
          {{ join.cta }}
          <Icon name="whatsapp" size="sm" tone="white" :circle="false" />
        </Button>
      </template>
    </AficheHero>

    <main class="wrap board-shell">
      <SectionTabs :label="copy.navAria" :items="PARCHESE_NAV" />
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.parchese-page {
  width: 100%;
}
</style>
