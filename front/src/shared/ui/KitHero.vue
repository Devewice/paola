<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useSlots, watch } from 'vue'
import { prefersReducedMotion } from '@shared/motion/prefersReducedMotion.ts'
import Icon from '@ui/Icon.vue'
import BrushSplash from '@ui/BrushSplash.vue'
import BrushButton from '@ui/BrushButton.vue'
import KitHeroPanel from '@ui/KitHeroPanel.vue'

export type KitHeroPanelSlide = {
  readonly id: string
  readonly label?: string
  readonly mediaLabel?: string
  readonly mediaSrc?: string
  readonly blankMedia?: boolean
  readonly title?: string
  readonly km?: string
  readonly cupo?: string
  readonly fecha?: string
  readonly splash?: string
  readonly ctaLabel?: string
  readonly ctaHref?: string
  readonly ctaTo?: string
}

const chips = [
  { href: '#brocha', label: 'Brocha' },
  { href: '#producto', label: 'Parchese' },
  { href: '#comunidad', label: 'Comunidad' },
  { href: '#roadmap', label: 'Roadmap' },
  { href: '#motion', label: 'Motion' },
] as const

const SLIDE_MS = 7000

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
    panelSlides?: readonly KitHeroPanelSlide[]
  }>(),
  {
    variant: 'classic',
    tagline: 'Kit de UI · portal en construcción · placeholders honestos',
    kicker: 'por el parche',
    splashLabel: 'paolabiker.com',
    logoSrc: '/kit-assets/logo.png',
    panelSlides: () => [],
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

const slideIndex = ref(0)
const progress = ref(0)
const paused = ref(false)
let raf = 0
let startedAt = 0
let elapsedBeforePause = 0

const slides = computed(() => props.panelSlides)
const hasDeck = computed(() => slides.value.length > 0)
const canCycle = computed(() => slides.value.length > 1 && !prefersReducedMotion())
const activeSlide = computed(() => slides.value[slideIndex.value] ?? slides.value[0])
const panelStyle = computed(() => ({
  ...panelTiltStyle.value,
  '--panel-progress': `${progress.value}%`,
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
  resumeCycle()
}

function pauseCycle(): void {
  if (!canCycle.value || paused.value) return
  paused.value = true
  elapsedBeforePause = Math.min(SLIDE_MS, performance.now() - startedAt)
}

function resumeCycle(): void {
  if (!canCycle.value || !paused.value) return
  paused.value = false
  startedAt = performance.now() - elapsedBeforePause
}

function goTo(index: number): void {
  if (!slides.value.length) return
  slideIndex.value = ((index % slides.value.length) + slides.value.length) % slides.value.length
  progress.value = 0
  elapsedBeforePause = 0
  startedAt = performance.now()
}

function tick(now: number): void {
  if (!canCycle.value) {
    progress.value = 0
    return
  }
  if (!paused.value) {
    const elapsed = now - startedAt
    progress.value = Math.min(100, (elapsed / SLIDE_MS) * 100)
    if (elapsed >= SLIDE_MS) {
      goTo(slideIndex.value + 1)
    }
  }
  raf = requestAnimationFrame(tick)
}

function startLoop(): void {
  cancelAnimationFrame(raf)
  startedAt = performance.now()
  elapsedBeforePause = 0
  progress.value = 0
  paused.value = false
  if (!canCycle.value) return
  raf = requestAnimationFrame(tick)
}

onMounted(() => {
  startLoop()
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
})

watch(
  () => slides.value.length,
  () => {
    slideIndex.value = 0
    startLoop()
  },
)
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
          <div class="kit-hero__deck">
            <aside
              class="kit-hero__panel"
              :class="{
                'is-tilting': panelTilting,
              }"
              :style="panelStyle"
              aria-label="Hoy"
              @pointermove="onPanelMove"
              @pointerenter="pauseCycle"
              @pointerleave="onPanelLeave"
            >
              <span v-if="canCycle" class="kit-hero__panel-ring" aria-hidden="true" />
              <Transition v-if="hasDeck" name="kit-hero-deck" mode="out-in">
                <div v-if="activeSlide" :key="activeSlide.id" class="kit-hero__panel-slide">
                  <KitHeroPanel
                    :label="activeSlide.label"
                    :media-label="activeSlide.mediaLabel"
                    :media-src="activeSlide.mediaSrc"
                    :blank-media="activeSlide.blankMedia ?? !activeSlide.mediaSrc"
                    :title="activeSlide.title"
                    :km="activeSlide.km"
                    :cupo="activeSlide.cupo"
                    :fecha="activeSlide.fecha"
                    :splash="activeSlide.splash"
                    :cta-label="activeSlide.ctaLabel"
                    :cta-href="activeSlide.ctaHref"
                    :cta-to="activeSlide.ctaTo"
                  />
                </div>
              </Transition>
              <slot v-else name="panel" />
            </aside>
            <div
              v-if="slides.length > 1"
              class="kit-hero__deck-dots"
              role="tablist"
              aria-label="Rodadas próximas"
            >
              <button
                v-for="(slide, index) in slides"
                :key="slide.id"
                type="button"
                class="kit-hero__deck-dot"
                role="tab"
                :aria-label="slide.title ?? `Rodada ${index + 1}`"
                :aria-selected="index === slideIndex"
                :class="{ 'is-active': index === slideIndex }"
                @click="goTo(index)"
              />
            </div>
          </div>
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
