<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { COMING_SOON_DEFAULT_TITLE, COMING_SOON_FALLBACK, COMING_SOON_PLATE } from '@app/constants/copy.ts'
import { TIPS_EMPTY_COPY } from '@modules/voice/index.ts'
import { APP_PATHS } from '@shared/http/constants.ts'
import { usePageReveal } from '@shared/motion/usePageReveal.ts'
import { MASCOT } from '@shared/ui/mascot.ts'
import AficheHero from '@ui/AficheHero.vue'
import Empty from '@ui/Empty.vue'

const route = useRoute()
const bindReveal = usePageReveal()

const title = computed(() => String(route.meta.title ?? COMING_SOON_DEFAULT_TITLE))
const copy = computed(() => {
  if (route.path === APP_PATHS.TU_VOZ) return TIPS_EMPTY_COPY
  return COMING_SOON_FALLBACK
})
</script>

<template>
  <article :ref="bindReveal" class="paola-page">
    <AficheHero :kicker="title" :title="title" :plate="COMING_SOON_PLATE" data-reveal>
      <template #lead>{{ copy }}</template>
    </AficheHero>
    <Empty compact data-reveal :title="title" :copy="copy" :mascot-src="MASCOT.LENTE" />
  </article>
</template>
