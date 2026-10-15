<script setup lang="ts">
import { computed, onMounted, provide, ref } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { getAppDependencies, refreshInventory } from '@app/bootstrap.ts'
import { TU_VOZ_CONTEXT } from '@app/shell/tu-voz/context.ts'
import {
  VOICE_COPY,
  VOICE_HERO_PHOTO,
  VOICE_NAV,
  VOICE_REPORT_ANCHOR,
} from '@modules/voice/constants/copy.ts'
import { usePageReveal } from '@shared/motion/usePageReveal.ts'
import { APP_PATHS } from '@shared/http/constants.ts'
import AficheHero from '@ui/AficheHero.vue'
import Button from '@ui/Button.vue'
import SectionTabs from '@ui/SectionTabs.vue'

const copy = VOICE_COPY
const route = useRoute()
const bindReveal = usePageReveal()
const stamp = ref(0)

onMounted(async () => {
  await refreshInventory()
  stamp.value += 1
})

const deps = computed(() => {
  stamp.value
  return getAppDependencies()
})

const whatsapp = computed(() => deps.value.paola.getPage().contact.whatsapp)

const SUBPAGE_HEROES: Record<string, { title: string; plate: string; lead: string }> = {
  'tu-voz-tips': { title: copy.tipsHeading, ...copy.heroTips },
  'tu-voz-comparendos': { title: copy.finesHeading, ...copy.heroFines },
  'tu-voz-reportes': { title: copy.navReports, ...copy.heroReports },
  'tu-voz-encuestas': { title: copy.navPolls, ...copy.heroPolls },
}
const subpage = computed(() => SUBPAGE_HEROES[String(route.name)] ?? null)

provide(TU_VOZ_CONTEXT, { deps, whatsapp })
</script>

<template>
  <div :ref="bindReveal" class="voice-page">
    <AficheHero
      v-if="subpage"
      compact
      :kicker="copy.title"
      :title="subpage.title"
      :plate="subpage.plate"
      :photo-src="VOICE_HERO_PHOTO"
    >
      <template #lead>{{ subpage.lead }}</template>
    </AficheHero>
    <AficheHero
      v-else
      :kicker="copy.kicker"
      :title="copy.title"
      :plate="copy.plate"
      :photo-src="VOICE_HERO_PHOTO"
      data-reveal
    >
      <template #lead>{{ copy.lead }}</template>
      <template #actions>
        <Button variant="hero" :to="`${APP_PATHS.TU_VOZ_REPORTES}#${VOICE_REPORT_ANCHOR}`">{{ copy.heroCta }}</Button>
      </template>
    </AficheHero>

    <main class="wrap board-shell">
      <SectionTabs :label="copy.navAria" :items="VOICE_NAV" />
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.voice-page {
  width: 100%;
}
</style>
