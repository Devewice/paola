<script setup lang="ts">
import gsap from 'gsap'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { POLLS_COPY, POLLS_INTRO } from '@modules/polls/constants/copy.ts'
import { prefersReducedMotion } from '@shared/motion/prefersReducedMotion.ts'
import Button from '@ui/Button.vue'
import Mascot3d from '@ui/Mascot3d.vue'

const props = defineProps<{
  title: string
  description?: string
  total: number
  minutes: number
  /** Ya se vio una vez (volvió con «Atrás»): corre más rápido. */
  replay?: boolean
}>()

const emit = defineEmits<{ start: [] }>()

const copy = POLLS_COPY
const intro = POLLS_INTRO

const root = ref<HTMLElement | null>(null)
const heading = ref<HTMLElement | null>(null)
const cta = ref<HTMLElement | null>(null)
const clock = ref<HTMLElement | null>(null)
const cam = ref<InstanceType<typeof Mascot3d> | null>(null)
const playing = ref(false)
const line = ref<string>(intro.line)
const words = computed(() => props.title.trim().split(/\s+/))

let timeline: gsap.core.Timeline | undefined
let leaving = false
let clockFrame = 0
let clockStart = 0
let moveX: ((value: number) => void) | undefined
let moveY: ((value: number) => void) | undefined
let camX: ((value: number) => void) | undefined
let camY: ((value: number) => void) | undefined

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

/** Contador del visor: mm:ss:fotograma, escrito directo en el DOM para no re-renderizar. */
function tickClock(now: number): void {
  if (!clockStart) clockStart = now
  const elapsed = (now - clockStart) / 1000
  const frames = Math.floor((elapsed % 1) * intro.fps)
  if (clock.value) clock.value.textContent = `${pad(Math.floor(elapsed / 60))}:${pad(Math.floor(elapsed % 60))}:${pad(frames)}`
  clockFrame = window.requestAnimationFrame(tickClock)
}

function skip(): void {
  if (playing.value) timeline?.progress(1)
}

function onPointer(event: PointerEvent): void {
  if (event.pointerType !== 'mouse' || !root.value || !moveX) return
  const box = root.value.getBoundingClientRect()
  const dx = (event.clientX - box.left) / box.width - 0.5
  const dy = (event.clientY - box.top) / box.height - 0.5
  moveX?.(dx * -10)
  moveY?.(dy * -8)
  camX?.(dx * 18)
  camY?.(dy * 14)
}

function onCtaEnter(): void {
  line.value = intro.ctaHoverLine
  cam.value?.cue('tilt')
}

function onCtaLeave(): void {
  line.value = intro.line
}

/** Disparo + obturador que se cierra desde el botón; resuelve cuando la pantalla quedó negra. */
function leave(): Promise<void> {
  if (leaving) return Promise.resolve()
  leaving = true
  timeline?.progress(1)
  cam.value?.cue('shoot')
  const el = root.value
  if (!el || prefersReducedMotion()) return Promise.resolve()
  const q = gsap.utils.selector(el)
  const box = cta.value?.getBoundingClientRect()
  const x = box ? box.left + box.width / 2 : window.innerWidth / 2
  const y = box ? box.top + box.height / 2 : window.innerHeight / 2
  const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
  return new Promise((resolve) => {
    gsap
      .timeline({ onComplete: () => resolve() })
      .fromTo(q('.poll-intro__flash'), { opacity: 0 }, { opacity: 0.85, duration: 0.07, ease: 'power1.out' })
      .to(q('.poll-intro__flash'), { opacity: 0, duration: 0.3, ease: 'power2.in' })
      .fromTo(
        q('.poll-intro__iris'),
        { clipPath: `circle(0px at ${x}px ${y}px)`, opacity: 1 },
        { clipPath: `circle(${radius}px at ${x}px ${y}px)`, duration: 0.5, ease: 'power3.in' },
        0.12,
      )
  })
}

function start(): void {
  void leave().then(() => emit('start'))
}

defineExpose({ leave })

function build(el: HTMLElement): void {
  const q = gsap.utils.selector(el)
  playing.value = true
  timeline = gsap.timeline({
    defaults: { ease: 'power3.out' },
    onComplete: () => {
      playing.value = false
      cam.value?.cue('shoot')
    },
  })
  timeline
    .fromTo(q('.poll-intro__curtain'), { scaleY: 1 }, { scaleY: 0, duration: 0.9, ease: 'power3.inOut' }, 0)
    .from(q('.poll-intro__corner'), { scale: 1.6, opacity: 0, duration: 0.5, stagger: 0.06 }, 0.35)
    .from(q('.poll-intro__rec, .poll-intro__hud'), { y: -10, opacity: 0, duration: 0.4, stagger: 0.08 }, 0.5)
    .from(
      q('.poll-intro__cam-frame'),
      { scale: 0.55, opacity: 0, filter: 'blur(14px)', duration: 1, ease: 'expo.out' },
      0.55,
    )
    .fromTo(
      q('.poll-intro__focus'),
      { scale: 1.7, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.45, ease: 'back.out(2)' },
      0.8,
    )
    .to(q('.poll-intro__focus'), { opacity: 0, duration: 0.12, repeat: 3, yoyo: true, ease: 'none' }, 1.25)
    .fromTo(q('.poll-intro__flash'), { opacity: 0 }, { opacity: 0.75, duration: 0.06, ease: 'none' }, 1.55)
    .to(q('.poll-intro__flash'), { opacity: 0, duration: 0.45, ease: 'power2.out' }, 1.61)
    .from(q('.poll-intro__kicker'), { x: -20, opacity: 0, duration: 0.4 }, 0.9)
    .from(q('.poll-intro__word-inner'), { yPercent: 115, rotate: 4, duration: 0.7, stagger: 0.07, ease: 'expo.out' }, 1)
    .from(q('.poll-intro__lead'), { y: 16, opacity: 0, duration: 0.55 }, 1.35)
    .from(q('.poll-intro__fact'), { scale: 0.6, opacity: 0, duration: 0.4, stagger: 0.08, ease: 'back.out(2.2)' }, 1.5)
    .from(q('.poll-intro__actions'), { y: 24, opacity: 0, duration: 0.55, ease: 'back.out(1.6)' }, 1.7)
    .from(q('.poll-intro__line'), { y: 10, opacity: 0, scale: 0.9, duration: 0.4, ease: 'back.out(2)' }, 1.8)
    .fromTo(q('.poll-intro__streak'), { xPercent: -120, opacity: 0.9 }, { xPercent: 560, opacity: 0, duration: 1.2, ease: 'power2.inOut' }, 1.6)
    .to(q('.poll-intro__skip'), { opacity: 0, duration: 0.3 }, '>-0.3')
  if (props.replay) timeline.timeScale(intro.replaySpeed)
}

onMounted(() => {
  heading.value?.focus({ preventScroll: true })
  const el = root.value
  if (!el || prefersReducedMotion()) return
  clockFrame = window.requestAnimationFrame(tickClock)
  build(el)
  const q = gsap.utils.selector(el)
  const copyEl = q('.poll-intro__copy')[0]
  const camEl = q('.poll-intro__cam')[0]
  if (copyEl && camEl && window.matchMedia('(hover: hover)').matches) {
    moveX = gsap.quickTo(copyEl, 'x', { duration: 0.8, ease: 'power3.out' })
    moveY = gsap.quickTo(copyEl, 'y', { duration: 0.8, ease: 'power3.out' })
    camX = gsap.quickTo(camEl, 'x', { duration: 1, ease: 'power3.out' })
    camY = gsap.quickTo(camEl, 'y', { duration: 1, ease: 'power3.out' })
  }
})

onBeforeUnmount(() => {
  window.cancelAnimationFrame(clockFrame)
  timeline?.kill()
})
</script>

<template>
  <div ref="root" class="poll-intro" :class="{ 'is-playing': playing }" @click="skip" @pointermove="onPointer">
    <div class="poll-intro__finder" aria-hidden="true">
      <span class="poll-intro__corner poll-intro__corner--tl" />
      <span class="poll-intro__corner poll-intro__corner--tr" />
      <span class="poll-intro__corner poll-intro__corner--bl" />
      <span class="poll-intro__corner poll-intro__corner--br" />
      <p class="poll-intro__rec">
        <span class="poll-intro__rec-dot" />
        {{ intro.rec }}
        <span ref="clock" class="poll-intro__clock">00:00:00</span>
      </p>
      <p class="poll-intro__hud">
        <span v-for="item in intro.hud" :key="item">{{ item }}</span>
      </p>
    </div>

    <div class="poll-intro__grid">
      <figure class="poll-intro__cam">
        <div class="poll-intro__cam-frame">
          <Mascot3d ref="cam" />
          <span class="poll-intro__focus" aria-hidden="true" />
        </div>
        <figcaption class="poll-intro__line">{{ line }}</figcaption>
      </figure>

      <div class="poll-intro__copy">
        <p class="poll-intro__kicker">{{ copy.kicker }}</p>
        <h1 ref="heading" class="poll-intro__title" tabindex="-1" :aria-label="title">
          <span v-for="(word, index) in words" :key="index" class="poll-intro__word" aria-hidden="true">
            <span class="poll-intro__word-inner">{{ word }}</span>
          </span>
        </h1>
        <p v-if="description" class="poll-intro__lead">{{ description }}</p>
        <p class="poll-intro__facts">
          <span class="poll-intro__fact">{{ total }} {{ copy.stepQuestions }}</span>
          <span class="poll-intro__fact">{{ minutes }} {{ copy.stepMinutes }}</span>
        </p>
        <div class="poll-intro__actions">
          <span ref="cta" class="poll-intro__cta" @mouseenter="onCtaEnter" @mouseleave="onCtaLeave">
            <Button variant="hero" @click.stop="start">{{ copy.stepStart }}</Button>
          </span>
          <p class="poll-intro__hint">{{ copy.stepDraftSaved }}</p>
        </div>
      </div>
    </div>

    <span class="poll-intro__streak" aria-hidden="true" />
    <span class="poll-intro__curtain poll-intro__curtain--top" aria-hidden="true" />
    <span class="poll-intro__curtain poll-intro__curtain--bottom" aria-hidden="true" />
    <p class="poll-intro__skip" aria-hidden="true">{{ intro.skip }}</p>
    <span class="poll-intro__flash" aria-hidden="true" />
    <span class="poll-intro__iris" aria-hidden="true" />
  </div>
</template>

<style scoped>
.poll-intro {
  position: relative;
  display: grid;
  align-items: center;
  min-height: calc(100svh - 240px);
  padding: clamp(40px, 6vw, 64px) clamp(20px, 4vw, 56px);
  isolation: isolate;
  overflow: hidden;
  border-radius: 20px;
}
.poll-intro.is-playing {
  cursor: pointer;
}

/* Visor de cámara */
.poll-intro__finder {
  position: absolute;
  inset: 12px;
  z-index: 1;
  pointer-events: none;
}
.poll-intro__corner {
  position: absolute;
  width: clamp(22px, 4vw, 40px);
  aspect-ratio: 1;
  border: 0 solid rgba(234, 242, 255, 0.75);
}
.poll-intro__corner--tl { top: 0; left: 0; border-top-width: 2px; border-left-width: 2px; border-top-left-radius: 8px; }
.poll-intro__corner--tr { top: 0; right: 0; border-top-width: 2px; border-right-width: 2px; border-top-right-radius: 8px; }
.poll-intro__corner--bl { bottom: 0; left: 0; border-bottom-width: 2px; border-left-width: 2px; border-bottom-left-radius: 8px; }
.poll-intro__corner--br { bottom: 0; right: 0; border-bottom-width: 2px; border-right-width: 2px; border-bottom-right-radius: 8px; }
.poll-intro__rec,
.poll-intro__hud {
  position: absolute;
  top: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  font: 600 11px/1 var(--ui, Montserrat, sans-serif);
  letter-spacing: 0.14em;
  color: rgba(234, 242, 255, 0.8);
}
.poll-intro__rec {
  left: clamp(30px, 5vw, 52px);
}
.poll-intro__hud {
  right: clamp(30px, 5vw, 52px);
  gap: 12px;
}
.poll-intro__rec-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #ff3b3b;
  box-shadow: 0 0 10px #ff3b3b;
  animation: poll-intro-rec 1.2s steps(2, jump-none) infinite;
}
.poll-intro__clock {
  font-variant-numeric: tabular-nums;
  color: rgba(234, 242, 255, 0.6);
}

/* Composición */
.poll-intro__grid {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(220px, 0.7fr);
  gap: clamp(24px, 5vw, 64px);
  align-items: center;
}
.poll-intro__cam {
  grid-column: 2;
  grid-row: 1;
  display: grid;
  justify-items: center;
  gap: 14px;
  margin: 0;
}
.poll-intro__copy {
  grid-column: 1;
  grid-row: 1;
  display: grid;
  gap: 18px;
  align-content: center;
}
.poll-intro__cam-frame {
  position: relative;
  width: min(340px, 100%);
  aspect-ratio: 1;
  border-radius: 46% 54% 42% 58% / 48% 42% 58% 52%;
  overflow: hidden;
  background: radial-gradient(ellipse at 50% 38%, rgba(0, 16, 40, 0.96) 0%, #05070c 74%);
  border: 1px solid rgba(72, 180, 252, 0.4);
  box-shadow:
    0 0 0 6px rgba(5, 7, 12, 0.72),
    0 0 50px rgba(0, 136, 248, 0.5),
    0 0 110px rgba(72, 180, 252, 0.22);
}
.poll-intro__focus {
  position: absolute;
  inset: 26%;
  border: 2px solid var(--cyan, #48b4fc);
  border-radius: 10px;
  box-shadow: 0 0 14px rgba(72, 180, 252, 0.7);
  opacity: 0;
  pointer-events: none;
}
.poll-intro__line {
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(0, 16, 40, 0.88);
  border: 1px solid rgba(72, 180, 252, 0.32);
  font-size: 13px;
  font-weight: 600;
  text-align: center;
}
.poll-intro__kicker {
  margin: 0;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--cyan, #48b4fc);
}
.poll-intro__title {
  display: flex;
  flex-wrap: wrap;
  gap: 0 0.28em;
  margin: 0;
  font: 700 clamp(32px, 4vw, 52px) / 1.02 var(--display, Oswald, sans-serif);
  overflow-wrap: anywhere;
  letter-spacing: 0.01em;
  text-transform: uppercase;
  outline: none;
  text-shadow: 0 6px 30px rgba(0, 0, 0, 0.6);
}
.poll-intro__word {
  display: inline-block;
  overflow: hidden;
  padding-bottom: 0.06em;
}
.poll-intro__word-inner {
  display: inline-block;
  transform-origin: 0 100%;
}
.poll-intro__lead {
  margin: 0;
  max-width: 58ch;
  font-size: 16px;
  line-height: 1.6;
  color: var(--muted, rgba(234, 242, 255, 0.8));
}
.poll-intro__facts {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0;
}
.poll-intro__fact {
  padding: 5px 12px;
  border: 1px solid rgba(72, 180, 252, 0.35);
  border-radius: 999px;
  background: rgba(0, 16, 40, 0.6);
  font-size: 12px;
  font-weight: 600;
}
.poll-intro__actions {
  display: grid;
  gap: 10px;
  justify-items: start;
  margin-top: 4px;
}
.poll-intro__cta {
  display: inline-block;
  border-radius: 12px;
  animation: poll-intro-pulse 2.4s ease-in-out 2.4s infinite;
}
.poll-intro__hint {
  margin: 0;
  font-size: 12px;
  color: var(--muted, rgba(234, 242, 255, 0.6));
}

/* Efectos */
.poll-intro__streak {
  position: absolute;
  top: -20%;
  left: 0;
  z-index: 3;
  width: 22%;
  height: 140%;
  background: linear-gradient(100deg, transparent, rgba(200, 232, 255, 0.16), transparent);
  transform: rotate(14deg);
  opacity: 0;
  pointer-events: none;
}
.poll-intro__curtain {
  position: fixed;
  left: 0;
  right: 0;
  z-index: 18;
  height: 50vh;
  background: #05070c;
  transform: scaleY(0);
  pointer-events: none;
}
.poll-intro__curtain--top {
  top: 0;
  transform-origin: 50% 0;
}
.poll-intro__curtain--bottom {
  bottom: 0;
  transform-origin: 50% 100%;
}
.poll-intro__skip {
  position: absolute;
  bottom: 18px;
  left: 50%;
  z-index: 4;
  margin: 0;
  transform: translateX(-50%);
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  white-space: nowrap;
  color: rgba(234, 242, 255, 0.45);
  pointer-events: none;
}
.poll-intro:not(.is-playing) .poll-intro__skip {
  opacity: 0;
}
.poll-intro__flash {
  position: fixed;
  inset: 0;
  z-index: 40;
  background: radial-gradient(circle at 60% 45%, #fff 0%, rgba(200, 232, 255, 0.85) 38%, rgba(72, 180, 252, 0) 75%);
  opacity: 0;
  pointer-events: none;
}
.poll-intro__iris {
  position: fixed;
  inset: 0;
  z-index: 39;
  background: #05070c;
  opacity: 0;
  pointer-events: none;
}

@keyframes poll-intro-rec {
  50% { opacity: 0.15; }
}
@keyframes poll-intro-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(72, 180, 252, 0); }
  50% { box-shadow: 0 0 0 8px rgba(72, 180, 252, 0.18), 0 0 34px rgba(0, 136, 248, 0.45); }
}

@media (max-width: 760px) {
  .poll-intro {
    min-height: calc(100svh - 190px);
    padding: 40px 20px 32px;
    align-items: start;
  }
  .poll-intro__grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  .poll-intro__cam {
    grid-column: 1;
    grid-template-columns: auto minmax(0, 1fr);
    align-items: center;
    justify-items: start;
    gap: 12px;
  }
  .poll-intro__copy {
    grid-column: 1;
    grid-row: 2;
    gap: 12px;
  }
  .poll-intro__cam-frame {
    width: clamp(104px, 30vw, 140px);
  }
  .poll-intro__line {
    border-radius: 14px 14px 14px 4px;
    text-align: left;
  }
  .poll-intro__lead {
    font-size: 15px;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .poll-intro__hud span:not(:first-child) {
    display: none;
  }
  .poll-intro__actions {
    justify-items: stretch;
  }
  .poll-intro__cta :deep(.btn) {
    width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .poll-intro__rec-dot,
  .poll-intro__cta {
    animation: none;
  }
}
</style>
