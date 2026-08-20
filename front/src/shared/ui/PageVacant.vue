<script setup lang="ts">
import { computed } from 'vue'
import { PAGE_VACANT_COPY } from '@app/constants/copy.ts'
import { APP_PATHS } from '@shared/http/constants.ts'
import { usePageReveal } from '@shared/motion/usePageReveal.ts'
import { asymmetricRoundedRectPath } from '@ui/roundedRectPath.ts'
import Mascot3d from '@ui/Mascot3d.vue'
import Button from '@ui/Button.vue'

/** Mismo blob que `.page-vacant__mascot-frame`. */
const MASCOT_RING = asymmetricRoundedRectPath(
  100,
  100,
  [0.46, 0.54, 0.42, 0.58],
  [0.48, 0.42, 0.58, 0.52],
)

const props = withDefaults(
  defineProps<{
    title: string
    kicker?: string
    copy?: string
  }>(),
  {
    kicker: PAGE_VACANT_COPY.kicker,
    copy: PAGE_VACANT_COPY.lead,
  },
)

const bindReveal = usePageReveal()
const contactHref = `mailto:${PAGE_VACANT_COPY.contactMail}`

const titleParts = computed(() => {
  const parts = props.title.trim().split(/\s+/)
  if (parts.length === 2) return { main: parts[0], accent: parts[1] }
  return { main: props.title, accent: '' }
})
</script>

<template>
  <article :ref="bindReveal" class="page-vacant">
    <div class="page-vacant__col" data-reveal>
      <div class="page-vacant__titles">
        <p class="type-brush-script page-vacant__kicker">{{ kicker }}</p>
        <div class="page-vacant__brush">
          <p class="type-brush-dry type-brush-dry--sm">{{ titleParts.main }}</p>
          <p
            v-if="titleParts.accent"
            class="type-brush-dry type-brush-dry--blue type-brush-dry--sm"
          >
            {{ titleParts.accent }}
          </p>
        </div>
      </div>
      <div class="page-vacant__mascot">
        <svg
          class="page-vacant__mascot-ring"
          viewBox="0 0 100 100"
          aria-hidden="true"
        >
          <path class="page-vacant__mascot-ring-halo" :d="MASCOT_RING" />
          <path class="page-vacant__mascot-ring-blur" :d="MASCOT_RING" />
          <path class="page-vacant__mascot-ring-main" :d="MASCOT_RING" />
        </svg>
        <div class="page-vacant__mascot-frame">
          <Mascot3d />
        </div>
      </div>
      <h1 class="page-vacant__heading">{{ title }} · {{ kicker }}</h1>
      <div class="page-vacant__cta">
        <p class="page-vacant__copy">{{ copy }}</p>
        <div class="page-vacant__actions">
          <Button :to="APP_PATHS.INICIO">{{ PAGE_VACANT_COPY.ctaHome }}</Button>
          <Button variant="ghost" :href="contactHref">{{ PAGE_VACANT_COPY.ctaContact }}</Button>
        </div>
      </div>
    </div>
  </article>
</template>
