<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useSlots, watch } from 'vue'
import { prefersReducedMotion } from '@shared/motion/prefersReducedMotion.ts'
import { pointOnRoundedRectPath, roundedRectPath } from '@ui/roundedRectPath.ts'
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
const SPARK_CTA_SPEED = 1 / 3
const PANEL_RADIUS = 10
const PANEL_GLOW_OUTSET = 18

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
    tagline: 'Kit de UI · portal en construcción · demos del parche',
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

const TILT_PERSPECTIVE = 720
const TILT_MAX_X = 7
const TILT_MAX_Y = 10
const DEPTH_MAX = 96
const DEPTH_REACH = 0.36
const DEPTH_JITTER_MAX = 30
const DEPTH_JITTER_PEAK_MS = 300
const DEPTH_JITTER_SETTLE_MS = 260
const DEPTH_JITTER_GAP_MIN_MS = 420
const DEPTH_JITTER_GAP_MAX_MS = 780

type JitterKey = 'label' | 'media' | 'splash' | 'stat0' | 'stat1' | 'stat2'
const JITTER_KEYS: readonly JitterKey[] = ['label', 'media', 'splash', 'stat0', 'stat1', 'stat2']

type LayerDepths = {
  label: number
  media: number
  title: number
  splash: number
  stat0: number
  stat1: number
  stat2: number
  glow: number
}

function emptyDepths(): LayerDepths {
  return { label: 0, media: 0, title: 0, splash: 0, stat0: 0, stat1: 0, stat2: 0, glow: 0 }
}

function computeDepth(mx: number, my: number, ax: number, ay: number): number {
  const dist = Math.hypot(mx - ax, my - ay)
  const t = Math.max(0, 1 - dist / DEPTH_REACH)
  return t * t * DEPTH_MAX
}

function computeTargetDepths(px: number, py: number): LayerDepths {
  const media = computeDepth(px, py, 0.5, 0.3)
  const title = Math.max(computeDepth(px, py, 0.5, 0.44), media + 16)
  const stat0 = computeDepth(px, py, 0.17, 0.65)
  const stat1 = computeDepth(px, py, 0.5, 0.67)
  const stat2 = computeDepth(px, py, 0.83, 0.65)
  const peak = Math.max(media, title, stat0, stat1, stat2)
  return {
    label: computeDepth(px, py, 0.5, 0.07),
    media,
    title,
    splash: computeDepth(px, py, 0.5, 0.9),
    stat0,
    stat1,
    stat2,
    glow: peak * 0.14,
  }
}

function combineDepths(base: LayerDepths, jitter: LayerDepths): LayerDepths {
  const media = base.media + jitter.media
  const title = Math.max(base.title, media + 16)
  return {
    label: base.label + jitter.label,
    media,
    title,
    splash: base.splash + jitter.splash,
    stat0: base.stat0 + jitter.stat0,
    stat1: base.stat1 + jitter.stat1,
    stat2: base.stat2 + jitter.stat2,
    glow: base.glow + jitter.glow,
  }
}

function pickJitterValue(): number {
  const sign = Math.random() > 0.25 ? 1 : -1
  return sign * (0.65 + Math.random() * 0.35) * DEPTH_JITTER_MAX
}

function jitterForKey(key: JitterKey, value: number): LayerDepths {
  const d = emptyDepths()
  d[key] = value
  d.glow = value * 0.18
  return d
}

function pickNextJitterKey(): JitterKey {
  const pool = JITTER_KEYS.filter((key) => key !== lastJitterKey)
  const choices = pool.length > 0 ? pool : [...JITTER_KEYS]
  const index = Math.floor(Math.random() * choices.length)
  const key: JitterKey = choices[index] ?? 'label'
  lastJitterKey = key
  return key
}

const panelTilting = ref(false)
const panelRotate = ref({ x: 0, y: 0 })
const panelNorm = ref({ x: 0, y: 0 })
const targetRotate = ref({ x: 0, y: 0 })
const targetNorm = ref({ x: 0, y: 0 })
const layerDepth = ref<LayerDepths>(emptyDepths())
const targetLayerDepth = ref<LayerDepths>(emptyDepths())
const depthJitter = ref<LayerDepths>(emptyDepths())
const targetDepthJitter = ref<LayerDepths>(emptyDepths())
let tiltRaf = 0
let depthJitterTimeout = 0
let depthJitterActive = false
let lastJitterKey: JitterKey | null = null

const panelTiltStyle = computed(() => {
  const d = combineDepths(layerDepth.value, depthJitter.value)
  return {
    transform: `perspective(${TILT_PERSPECTIVE}px) rotateX(${panelRotate.value.x}deg) rotateY(${panelRotate.value.y}deg)`,
    '--tilt-nx': panelNorm.value.x,
    '--tilt-ny': panelNorm.value.y,
    '--depth-label-z': d.label,
    '--depth-media-z': d.media,
    '--depth-title-z': d.title,
    '--depth-splash-z': d.splash,
    '--depth-stat0-z': d.stat0,
    '--depth-stat1-z': d.stat1,
    '--depth-stat2-z': d.stat2,
    '--depth-glow-z': d.glow,
  }
})

const slideIndex = ref(0)
const progress = ref(0)
const ctaHovered = ref(false)
const panelRef = ref<HTMLElement | null>(null)
const panelTiltRef = ref<HTMLElement | null>(null)
const sparkPathRef = ref<SVGPathElement | null>(null)
const panelFrame = ref({ w: 0, h: 0 })
const pathLength = ref(0)
let raf = 0
let lastTickAt = 0
let resizeObserver: ResizeObserver | undefined

const slides = computed(() => props.panelSlides)
const hasDeck = computed(() => slides.value.length > 0)
const canCycle = computed(() => slides.value.length > 1 && !prefersReducedMotion())
const activeSlide = computed(() => slides.value[slideIndex.value] ?? slides.value[0])
const borderPath = computed(() => roundedRectPath(panelFrame.value.w, panelFrame.value.h, PANEL_RADIUS))
const progressStrokeStyle = computed(() => {
  const len = pathLength.value
  if (len < 1) return {}
  return {
    strokeDasharray: `${len}`,
    strokeDashoffset: `${len * (1 - progress.value / 100)}`,
  }
})
const sparkStyle = computed(() => {
  const path = sparkPathRef.value
  const { w, h } = panelFrame.value
  if (!path || w < 1 || h < 1) {
    return {
      left: `${w / 2 + PANEL_GLOW_OUTSET}px`,
      top: `${PANEL_GLOW_OUTSET}px`,
      '--spark-tangent': '-90deg',
    }
  }
  const pt = pointOnRoundedRectPath(path, progress.value)
  return {
    left: `${pt.x + PANEL_GLOW_OUTSET}px`,
    top: `${pt.y + PANEL_GLOW_OUTSET}px`,
    '--spark-tangent': `${pt.tangent}deg`,
  }
})
const panelStyle = computed(() => ({
  '--tilt-nx': panelNorm.value.x,
  '--tilt-ny': panelNorm.value.y,
}))

function animateTilt(): void {
  const ease = 0.18
  const depthEase = 0.16
  const jitterEase = 0.26
  panelRotate.value = {
    x: panelRotate.value.x + (targetRotate.value.x - panelRotate.value.x) * ease,
    y: panelRotate.value.y + (targetRotate.value.y - panelRotate.value.y) * ease,
  }
  panelNorm.value = {
    x: panelNorm.value.x + (targetNorm.value.x - panelNorm.value.x) * ease,
    y: panelNorm.value.y + (targetNorm.value.y - panelNorm.value.y) * ease,
  }
  const td = targetLayerDepth.value
  const ld = layerDepth.value
  layerDepth.value = {
    label: ld.label + (td.label - ld.label) * depthEase,
    media: ld.media + (td.media - ld.media) * depthEase,
    title: ld.title + (td.title - ld.title) * depthEase,
    splash: ld.splash + (td.splash - ld.splash) * depthEase,
    stat0: ld.stat0 + (td.stat0 - ld.stat0) * depthEase,
    stat1: ld.stat1 + (td.stat1 - ld.stat1) * depthEase,
    stat2: ld.stat2 + (td.stat2 - ld.stat2) * depthEase,
    glow: ld.glow + (td.glow - ld.glow) * depthEase,
  }
  const tj = targetDepthJitter.value
  const lj = depthJitter.value
  depthJitter.value = {
    label: lj.label + (tj.label - lj.label) * jitterEase,
    media: lj.media + (tj.media - lj.media) * jitterEase,
    title: 0,
    splash: lj.splash + (tj.splash - lj.splash) * jitterEase,
    stat0: lj.stat0 + (tj.stat0 - lj.stat0) * jitterEase,
    stat1: lj.stat1 + (tj.stat1 - lj.stat1) * jitterEase,
    stat2: lj.stat2 + (tj.stat2 - lj.stat2) * jitterEase,
    glow: lj.glow + (tj.glow - lj.glow) * jitterEase,
  }
  const dx = Math.abs(panelRotate.value.x - targetRotate.value.x)
  const dy = Math.abs(panelRotate.value.y - targetRotate.value.y)
  const dn = Math.hypot(panelNorm.value.x - targetNorm.value.x, panelNorm.value.y - targetNorm.value.y)
  const depthDelta =
    Math.abs(layerDepth.value.label - td.label) +
    Math.abs(layerDepth.value.media - td.media) +
    Math.abs(layerDepth.value.title - td.title)
  const jitterDelta =
    Math.abs(depthJitter.value.label - tj.label) +
    Math.abs(depthJitter.value.media - tj.media) +
    Math.abs(depthJitter.value.splash - tj.splash) +
    Math.abs(depthJitter.value.stat0 - tj.stat0) +
    Math.abs(depthJitter.value.stat1 - tj.stat1) +
    Math.abs(depthJitter.value.stat2 - tj.stat2)
  if (dx > 0.02 || dy > 0.02 || dn > 0.02 || depthDelta > 0.4 || jitterDelta > 0.2) {
    tiltRaf = requestAnimationFrame(animateTilt)
  }
}

function runNextDepthJitter(): void {
  clearTimeout(depthJitterTimeout)
  if (!depthJitterActive || prefersReducedMotion()) return

  const key = pickNextJitterKey()
  targetDepthJitter.value = jitterForKey(key, pickJitterValue())
  startTiltLoop()

  depthJitterTimeout = window.setTimeout(() => {
    if (!depthJitterActive) return
    targetDepthJitter.value = emptyDepths()
    startTiltLoop()

    const gap =
      DEPTH_JITTER_GAP_MIN_MS +
      Math.random() * (DEPTH_JITTER_GAP_MAX_MS - DEPTH_JITTER_GAP_MIN_MS)

    depthJitterTimeout = window.setTimeout(() => {
      runNextDepthJitter()
    }, DEPTH_JITTER_SETTLE_MS + gap)
  }, DEPTH_JITTER_PEAK_MS)
}

function startDepthJitter(): void {
  if (depthJitterActive || prefersReducedMotion()) return
  depthJitterActive = true
  lastJitterKey = null
  runNextDepthJitter()
}

function stopDepthJitter(): void {
  depthJitterActive = false
  lastJitterKey = null
  clearTimeout(depthJitterTimeout)
  depthJitterTimeout = 0
  targetDepthJitter.value = emptyDepths()
  startTiltLoop()
}

function startTiltLoop(): void {
  cancelAnimationFrame(tiltRaf)
  tiltRaf = requestAnimationFrame(animateTilt)
}

function onPanelEnter(event: PointerEvent): void {
  if (event.pointerType === 'touch' || prefersReducedMotion()) return
  panelTilting.value = true
  startDepthJitter()
}

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
  targetRotate.value = { x: ny * TILT_MAX_X, y: -nx * TILT_MAX_Y }
  targetNorm.value = { x: nx, y: ny }
  targetLayerDepth.value = computeTargetDepths(px, py)
  startTiltLoop()
}

function onPanelLeave(): void {
  panelTilting.value = false
  ctaHovered.value = false
  stopDepthJitter()
  targetRotate.value = { x: 0, y: 0 }
  targetNorm.value = { x: 0, y: 0 }
  targetLayerDepth.value = emptyDepths()
  startTiltLoop()
}

function goTo(index: number): void {
  if (!slides.value.length) return
  slideIndex.value = ((index % slides.value.length) + slides.value.length) % slides.value.length
  progress.value = 0
  lastTickAt = 0
}

function tick(now: number): void {
  if (!canCycle.value) {
    progress.value = 0
    lastTickAt = 0
    return
  }
  if (lastTickAt < 1) lastTickAt = now
  const dt = now - lastTickAt
  lastTickAt = now
  const speed = ctaHovered.value ? SPARK_CTA_SPEED : 1
  progress.value = Math.min(100, progress.value + (dt / SLIDE_MS) * 100 * speed)
  if (progress.value >= 100) {
    goTo(slideIndex.value + 1)
  }
  raf = requestAnimationFrame(tick)
}

function startLoop(): void {
  cancelAnimationFrame(raf)
  progress.value = 0
  lastTickAt = 0
  if (!canCycle.value) return
  raf = requestAnimationFrame(tick)
}

function onCtaHover(hovered: boolean): void {
  ctaHovered.value = hovered
}

function syncPathLength(): void {
  pathLength.value = sparkPathRef.value?.getTotalLength() ?? 0
}

function measurePanel(): void {
  const el = panelTiltRef.value ?? panelRef.value
  if (!el) return
  panelFrame.value = { w: el.offsetWidth, h: el.offsetHeight }
}

onMounted(() => {
  measurePanel()
  if (typeof ResizeObserver !== 'undefined') {
    const target = () => panelTiltRef.value ?? panelRef.value
    resizeObserver = new ResizeObserver(() => {
      measurePanel()
      nextTick(() => syncPathLength())
    })
    nextTick(() => {
      const el = target()
      if (el) resizeObserver!.observe(el)
    })
  }
  nextTick(() => syncPathLength())
  startLoop()
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  cancelAnimationFrame(tiltRaf)
  stopDepthJitter()
  resizeObserver?.disconnect()
})

watch(
  () => slides.value.length,
  () => {
    slideIndex.value = 0
    startLoop()
  },
)

watch(
  () => activeSlide.value?.id,
  async () => {
    await nextTick()
    measurePanel()
    syncPathLength()
  },
)

watch(borderPath, async () => {
  await nextTick()
  syncPathLength()
})
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
              ref="panelRef"
              class="kit-hero__panel"
              :class="{ 'is-tilting': panelTilting }"
              :style="panelStyle"
              aria-label="Hoy"
              @pointerenter="onPanelEnter"
              @pointermove="onPanelMove"
              @pointerleave="onPanelLeave"
            >
              <div
                ref="panelTiltRef"
                class="kit-hero__panel-tilt"
                :class="{ 'is-tilting': panelTilting, 'is-cta-hover': ctaHovered }"
                :style="panelTiltStyle"
              >
                <div v-if="canCycle" class="kit-hero__panel-glow" aria-hidden="true">
                  <svg
                    v-if="panelFrame.w > 0 && panelFrame.h > 0"
                    class="kit-hero__panel-path"
                    :viewBox="`0 0 ${panelFrame.w} ${panelFrame.h}`"
                    :width="panelFrame.w"
                    :height="panelFrame.h"
                  >
                    <path :d="borderPath" class="kit-hero__ring-track" />
                    <path
                      :d="borderPath"
                      class="kit-hero__ring-stroke kit-hero__ring-stroke--halo"
                      :style="progressStrokeStyle"
                    />
                    <path
                      :d="borderPath"
                      class="kit-hero__ring-stroke kit-hero__ring-stroke--blur"
                      :style="progressStrokeStyle"
                    />
                    <path
                      ref="sparkPathRef"
                      :d="borderPath"
                      class="kit-hero__ring-stroke kit-hero__ring-stroke--main"
                      :style="progressStrokeStyle"
                    />
                  </svg>
                  <span class="kit-hero__panel-spark" :style="sparkStyle">
                    <span class="kit-hero__panel-spark-burst" aria-hidden="true">
                      <span class="kit-hero__panel-spark-ray kit-hero__panel-spark-ray--a" />
                      <span class="kit-hero__panel-spark-ray kit-hero__panel-spark-ray--b" />
                      <span class="kit-hero__panel-spark-ray kit-hero__panel-spark-ray--c" />
                      <span class="kit-hero__panel-spark-ray kit-hero__panel-spark-ray--d" />
                      <span class="kit-hero__panel-spark-ray kit-hero__panel-spark-ray--e" />
                      <span class="kit-hero__panel-spark-ray kit-hero__panel-spark-ray--f" />
                      <span class="kit-hero__panel-spark-ray kit-hero__panel-spark-ray--g" />
                      <span class="kit-hero__panel-spark-ray kit-hero__panel-spark-ray--h" />
                      <span class="kit-hero__panel-spark-ray kit-hero__panel-spark-ray--i" />
                    </span>
                    <span class="kit-hero__panel-spark-head" aria-hidden="true">
                      <svg
                        class="kit-hero__panel-spark-svg"
                        viewBox="0 0 24 24"
                        width="22"
                        height="22"
                        fill="none"
                      >
                        <path
                          class="kit-hero__panel-spark-bolt"
                          d="M12 1 L13.4 8.2 L21 10.2 L14.2 12.4 L16.2 22 L12 15.8 L7.8 22 L9.8 12.4 L3 10.2 L10.6 8.2 Z"
                        />
                        <path class="kit-hero__panel-spark-needle" d="M12 3 L12 21" />
                        <path class="kit-hero__panel-spark-needle kit-hero__panel-spark-needle--b" d="M4 11 L20 13" />
                        <path class="kit-hero__panel-spark-needle kit-hero__panel-spark-needle--c" d="M6 6 L18 18" />
                      </svg>
                    </span>
                  </span>
                </div>
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
                      @cta-hover="onCtaHover"
                    />
                  </div>
                </Transition>
                <slot v-else name="panel" />
              </div>
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
