<script setup lang="ts">
import { NOT_FOUND_COPY } from '@app/constants/copy.ts'
import { APP_PATHS } from '@shared/http/constants.ts'
import { usePageReveal } from '@shared/motion/usePageReveal.ts'
import { MASCOT } from '@shared/ui/mascot.ts'
import AficheHero from '@ui/AficheHero.vue'
import Empty from '@ui/Empty.vue'

const copy = NOT_FOUND_COPY
const bindReveal = usePageReveal()
</script>

<template>
  <article :ref="bindReveal" class="paola-page">
    <AficheHero :kicker="copy.kicker" :title="copy.title" plate="Loigca" data-reveal>
      <template #lead>{{ copy.lead }}</template>
    </AficheHero>
    <Empty
      compact
      data-reveal
      :title="copy.title"
      :copy="copy.lead"
      :mascot-src="MASCOT.LENTE"
      :cta-href="APP_PATHS.INICIO"
      :cta-label="copy.cta"
    />
  </article>
</template>
