<script setup lang="ts">
import { PAGE_VACANT_COPY } from '@app/constants/copy.ts'
import { APP_PATHS } from '@shared/http/constants.ts'
import { usePageReveal } from '@shared/motion/usePageReveal.ts'
import { MASCOT } from '@shared/ui/mascot.ts'
import Button from '@ui/Button.vue'

withDefaults(
  defineProps<{
    title: string
    kicker?: string
    copy?: string
    mascotSrc?: string
  }>(),
  {
    kicker: PAGE_VACANT_COPY.kicker,
    copy: PAGE_VACANT_COPY.lead,
    mascotSrc: MASCOT.TUMBADA,
  },
)

const bindReveal = usePageReveal()
const contactHref = `mailto:${PAGE_VACANT_COPY.contactMail}`
</script>

<template>
  <article :ref="bindReveal" class="paola-page page-vacant">
    <section class="paola-empty" data-reveal>
      <div class="paola-empty__mascot-hole" aria-hidden="true">
        <img class="paola-empty__mascot" :src="mascotSrc" alt="" width="150" height="150" />
      </div>
      <p class="paola-empty__kicker">{{ kicker }}</p>
      <h1 class="paola-empty__title type-display">{{ title }}</h1>
      <p class="paola-empty__copy">{{ copy }}</p>
      <div class="page-vacant__actions row">
        <Button :to="APP_PATHS.INICIO">{{ PAGE_VACANT_COPY.ctaHome }}</Button>
        <Button variant="ghost" :href="contactHref">{{ PAGE_VACANT_COPY.ctaContact }}</Button>
      </div>
    </section>
  </article>
</template>
