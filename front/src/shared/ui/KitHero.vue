<script setup lang="ts">
import { computed, ref, useSlots } from 'vue'
import { prefersReducedMotion } from '@shared/motion/prefersReducedMotion.ts'
import Icon from '@ui/Icon.vue'
import BrushSplash from '@ui/BrushSplash.vue'
import BrushButton from '@ui/BrushButton.vue'

const chips = [
  { href: '#brocha', label: 'Brocha' },
  { href: '#producto', label: 'Parchese' },
  { href: '#comunidad', label: 'Comunidad' },
  { href: '#roadmap', label: 'Roadmap' },
  { href: '#motion', label: 'Motion' },
] as const

const props = withDefaults(
  defineProps<{
    heroId: string
    variant?: 'classic' | 'portal'
    scrollHref: string
    scrollLabel: string
    tagline?: string
    kicker?: string
    splashLabel?: string
    photoSrc?: string
    logoSrc?: string
  }>(),
  {
    variant: 'classic',
    tagline: 'Kit de UI · portal en construcción · placeholders honestos',
    kicker: 'por el parche',
    splashLabel: 'paolabiker.com',
    logoSrc: '/kit-assets/logo.png',
  },
)

const slots = useSlots()
const photoStyle = computed(() =>
  props.photoSrc ? { backgroundImage: `url("${props.photoSrc}")` } : undefined,
)

const TILT_MAX = 6
const panelTilting = ref(false)
const panelRotate = ref({ x: 0, y: 0 })
const panelShine = ref({ x: 50, y: 50 })
const panelTiltStyle = computed(() => ({
  transform: `rotateX(${panelRotate.value.x}deg) rotateY(${panelRotate.value.y}deg)`,
  '--tilt-mx': `${panelShine.value.x}%`,
  '--tilt-my': `${panelShine.value.y}%`,
}))

function onPanelMove(event: PointerEvent): void {
  if (event.pointerType === 'touch' || prefersReducedMotion()) return
  const el = event.currentTarget
  if (!(el instanceof HTMLElement)) return
  const box = el.getBoundingClientRect()
  if (box.width < 1 || box.height < 1) return
  const px = (event.clientX - box.left) / box.width
  const py = (event.clientY - box.top) / box.height
  const nx = px * 2 - 1
  const ny = py * 2 - 1
  panelTilting.value = true
  panelRotate.value = { x: -(ny * TILT_MAX), y: nx * TILT_MAX }
  panelShine.value = { x: px * 100, y: py * 100 }
}

function onPanelLeave(): void {
  panelTilting.value = false
  panelRotate.value = { x: 0, y: 0 }
  panelShine.value = { x: 50, y: 50 }
}
</script>

<template>
  <section
    :id="heroId"
    class="kit-hero"
    :class="variant === 'portal' ? 'kit-hero--portal' : 'kit-hero--classic'"
    :aria-label="variant === 'portal' ? 'Paola Biker — hero portal' : 'Paola Biker — hero clásico'"
  >
    <div class="kit-hero__bg" aria-hidden="true">
      <div class="kit-hero__photo" :style="photoStyle" />
      <div class="kit-hero__veil" />
    </div>
    <div class="kit-hero__glow" aria-hidden="true" />

    <template v-if="variant === 'classic'">
      <div class="kit-hero__deco kit-hero__deco--tl" aria-hidden="true">
        <Icon name="route" size="lg" tone="cyan" :circle="false" class="brush-icon--lg" />
        <Icon name="helmet" size="lg" :circle="false" class="brush-icon--lg" />
      </div>
      <div class="kit-hero__deco kit-hero__deco--br" aria-hidden="true">
        <Icon name="camera" size="lg" :circle="false" class="brush-icon--lg" />
        <Icon name="heart" size="lg" tone="cyan" :circle="false" class="brush-icon--lg" />
      </div>
    </template>

    <div class="kit-hero__inner">
      <div v-if="variant === 'portal'" class="kit-hero__voices kit-hero__anim" aria-label="Tríada de voces">
        <slot name="voices" />
      </div>

      <div :class="variant === 'portal' ? 'kit-hero__grid' : undefined">
        <div :class="variant === 'portal' ? 'kit-hero__main' : undefined">
          <div class="kit-hero__top">
            <img class="kit-hero__logo kit-hero__anim" :src="logoSrc" width="120" height="120" alt="Paola — Rodando con propósito" />
            <div class="kit-hero__titles">
              <p class="type-brush-script kit-hero__anim">{{ kicker }}</p>
              <div class="kit-hero__brush-line">
                <p class="type-brush-dry type-brush-dry--sm kit-hero__anim">Paola</p>
                <p class="type-brush-dry type-brush-dry--blue type-brush-dry--sm kit-hero__anim">Biker</p>
              </div>
              <p class="type-condensed type-condensed--blue kit-hero__anim" style="font-size:clamp(20px,4vw,32px);margin:4px 0 0">Rodando con propósito</p>
            </div>
          </div>

          <div class="brush-divider brush-divider--thin kit-hero__divider kit-hero__anim" aria-hidden="true">
            <svg viewBox="0 0 800 12" preserveAspectRatio="none">
              <g fill="none" stroke-linecap="round">
                <path stroke="#0088F8" stroke-width="2.8" d="M0,6 L32,5 M42,7 L78,4 M88,6 L124,5 M134,7 L170,4 M180,6 L216,5 M226,7 L262,4 M272,6 L308,5 M318,7 L354,4 M364,6 L400,5 M410,7 L446,4 M456,6 L492,5 M502,7 L538,4 M548,6 L584,5 M594,7 L630,4 M640,6 L676,5 M686,7 L722,4 M732,6 L768,5 M778,7 L800,4"/>
              </g>
            </svg>
          </div>

          <BrushSplash :label="splashLabel" class="kit-hero__url kit-hero__anim" />

          <div class="kit-hero__copy">
            <p class="kit-hero__tagline kit-hero__anim">{{ tagline }}</p>

            <template v-if="slots.actions">
              <div class="kit-hero__actions kit-hero__anim">
                <slot name="actions" />
              </div>
            </template>
            <template v-else>
              <nav class="kit-hero__chips kit-hero__anim" aria-label="Secciones del kit">
                <a v-for="chip in chips" :key="chip.href" class="kit-hero__chip" :href="chip.href">{{ chip.label }}</a>
              </nav>
              <div class="kit-hero__actions kit-hero__anim">
                <BrushButton href="#marca">Explorar marca</BrushButton>
                <a class="btn btn-ghost" href="#brocha">Capa afiche</a>
                <span class="label-brush">Ride · Respect · Enjoy</span>
              </div>
            </template>
          </div>
        </div>

        <div
          v-if="variant === 'portal'"
          class="kit-hero__panel-stage kit-hero__anim kit-hero__anim--panel"
        >
          <slot name="deck">
            <aside
              class="kit-hero__panel"
              :class="{ 'is-tilting': panelTilting }"
              :style="panelTiltStyle"
              aria-label="Hoy"
              @pointermove="onPanelMove"
              @pointerleave="onPanelLeave"
            >
              <slot name="panel" />
            </aside>
          </slot>
        </div>
      </div>

      <footer v-if="variant === 'portal'" class="kit-hero__footer kit-hero__anim">
        <slot name="footer" />
      </footer>
    </div>

    <a class="kit-hero__scroll" :href="scrollHref">
      <span>{{ scrollLabel }}</span>
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 5v14M6 13l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </a>
  </section>
</template>
