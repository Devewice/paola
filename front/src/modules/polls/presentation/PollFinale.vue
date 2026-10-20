<script setup lang="ts">
import gsap from 'gsap'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { POLLS_FINALE } from '@modules/polls/constants/copy.ts'
import { APP_PATHS } from '@shared/http/constants.ts'
import { prefersReducedMotion } from '@shared/motion/prefersReducedMotion.ts'
import Button from '@ui/Button.vue'
import Mascot3d from '@ui/Mascot3d.vue'
import { showToast } from '@ui/toast.ts'

const props = defineProps<{
  pollTitle: string
  answered: number
  total: number
  /** Milisegundos desde que arrancó hasta que envió. */
  elapsed: number
  /** El público puede ver resultados: aparece «Ver cómo va». */
  hasResults: boolean
}>()

const emit = defineEmits<{ results: [] }>()

const copy = POLLS_FINALE
const root = ref<HTMLElement | null>(null)
const heading = ref<HTMLElement | null>(null)
const answeredEl = ref<HTMLElement | null>(null)
const cam = ref<InstanceType<typeof Mascot3d> | null>(null)
const words = computed(() => copy.title.split(/\s+/))

let timeline: gsap.core.Timeline | undefined
let celebrateTimer = 0

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

const clock = computed(() => {
  const seconds = Math.max(0, Math.round(props.elapsed / 1000))
  return `${pad(Math.floor(seconds / 60))}:${pad(seconds % 60)}`
})

function celebrate(): void {
  cam.value?.cue('spin')
  window.clearTimeout(celebrateTimer)
  celebrateTimer = window.setTimeout(() => cam.value?.cue('peace'), copy.celebrateGap * 1000)
}

async function share(): Promise<void> {
  const url = window.location.href
  const text = copy.shareText(props.pollTitle)
  if (navigator.share) {
    try {
      await navigator.share({ title: props.pollTitle, text, url })
    } catch {
      /* Cerró el menú de compartir: nada que avisar. */
    }
    return
  }
  try {
    await navigator.clipboard.writeText(`${text} ${url}`)
    showToast(copy.shareCopied, 'ok')
  } catch {
    showToast(url, 'ok')
  }
}

function build(el: HTMLElement): void {
  const q = gsap.utils.selector(el)
  const counter = { value: 0 }
  timeline = gsap.timeline({ defaults: { ease: 'power3.out' }, onComplete: celebrate })
  timeline
    .fromTo(q('.poll-finale__flash'), { opacity: 0.95 }, { opacity: 0, duration: 0.7, ease: 'power2.out' }, 0)
    .from(q('.poll-finale__bar'), { scaleY: 0, duration: 0.6, ease: 'power3.inOut' }, 0)
    .from(q('.poll-finale__corner'), { scale: 1.6, opacity: 0, duration: 0.45, stagger: 0.05 }, 0.15)
    .from(q('.poll-finale__rec, .poll-finale__hud'), { y: -10, opacity: 0, duration: 0.35, stagger: 0.08 }, 0.25)
    .from(q('.poll-finale__cam-frame'), { scale: 0.6, opacity: 0, filter: 'blur(12px)', duration: 0.9, ease: 'expo.out' }, 0.2)
    .from(q('.poll-finale__clap'), { y: -40, rotate: -12, opacity: 0, duration: 0.45, ease: 'back.out(1.8)' }, 0.35)
    .fromTo(q('.poll-finale__stick'), { rotate: -32 }, { rotate: 0, duration: 0.16, ease: 'power4.in' }, 0.85)
    .fromTo(el, { x: 0 }, { x: 6, duration: 0.05, repeat: 5, yoyo: true, ease: 'none', clearProps: 'transform' }, 1.01)
    .fromTo(q('.poll-finale__flash'), { opacity: 0 }, { opacity: 0.5, duration: 0.05, ease: 'none' }, 1.01)
    .to(q('.poll-finale__flash'), { opacity: 0, duration: 0.4, ease: 'power2.out' }, 1.06)
    .from(q('.poll-finale__clap-word'), { scale: 1.8, opacity: 0, duration: 0.5, ease: 'back.out(2.2)' }, 1.02)
    .from(q('.poll-finale__kicker'), { x: -20, opacity: 0, duration: 0.4 }, 1.15)
    .from(q('.poll-finale__word-inner'), { yPercent: 115, rotate: 4, duration: 0.7, stagger: 0.08, ease: 'expo.out' }, 1.2)
    .from(q('.poll-finale__lead'), { y: 16, opacity: 0, duration: 0.5 }, 1.45)
    .from(q('.poll-finale__stat'), { y: 20, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'back.out(1.8)' }, 1.55)
    .to(
      counter,
      {
        value: props.answered,
        duration: 0.9,
        ease: 'power2.out',
        onUpdate: () => {
          if (answeredEl.value) answeredEl.value.textContent = String(Math.round(counter.value))
        },
      },
      1.6,
    )
    .from(q('.poll-finale__line'), { y: 10, opacity: 0, scale: 0.9, duration: 0.4, ease: 'back.out(2)' }, 1.7)
    .from(q('.poll-finale__actions > *'), { y: 22, opacity: 0, duration: 0.5, stagger: 0.08, ease: 'back.out(1.6)' }, 1.8)
    .from(
      q('.poll-finale__credit'),
      { opacity: 0, letterSpacing: '0.6em', filter: 'blur(6px)', duration: 0.7, stagger: 0.22, ease: 'power2.out' },
      2,
    )
    .fromTo(q('.poll-finale__streak'), { xPercent: -120, opacity: 0.9 }, { xPercent: 560, opacity: 0, duration: 1.3, ease: 'power2.inOut' }, 1.9)
}

onMounted(() => {
  heading.value?.focus({ preventScroll: true })
  const el = root.value
  if (!el || prefersReducedMotion()) return
  cam.value?.cue('shoot')
  build(el)
})

onBeforeUnmount(() => {
  timeline?.kill()
  window.clearTimeout(celebrateTimer)
})
</script>

<template>
  <div ref="root" class="poll-finale">
    <span class="poll-finale__leak poll-finale__leak--a" aria-hidden="true" />
    <span class="poll-finale__leak poll-finale__leak--b" aria-hidden="true" />
    <span class="poll-finale__bar poll-finale__bar--top" aria-hidden="true" />
    <span class="poll-finale__bar poll-finale__bar--bottom" aria-hidden="true" />

    <div class="poll-finale__finder" aria-hidden="true">
      <span class="poll-finale__corner poll-finale__corner--tl" />
      <span class="poll-finale__corner poll-finale__corner--tr" />
      <span class="poll-finale__corner poll-finale__corner--bl" />
      <span class="poll-finale__corner poll-finale__corner--br" />
      <p class="poll-finale__rec">
        <span class="poll-finale__stop" />
        {{ copy.stop }}
        <span class="poll-finale__clock">{{ clock }}</span>
      </p>
      <p class="poll-finale__hud">{{ copy.hud }}</p>
    </div>

    <div class="poll-finale__grid">
      <figure class="poll-finale__cam">
        <div class="poll-finale__clap" aria-hidden="true">
          <span class="poll-finale__stick" />
          <span class="poll-finale__slate">
            <span>{{ copy.clapScene }}</span>
            <span>{{ copy.clapTake }}</span>
          </span>
        </div>
        <div class="poll-finale__cam-frame"><Mascot3d ref="cam" /></div>
        <figcaption class="poll-finale__line">{{ copy.camLine }}</figcaption>
      </figure>

      <div class="poll-finale__copy">
        <p class="poll-finale__clap-word type-brush-dry" aria-hidden="true">{{ copy.clap }}</p>
        <p class="poll-finale__kicker">{{ copy.kicker }}</p>
        <h2 ref="heading" class="poll-finale__title" tabindex="-1" :aria-label="copy.title">
          <span v-for="(word, index) in words" :key="index" class="poll-finale__word" aria-hidden="true">
            <span class="poll-finale__word-inner">{{ word }}</span>
          </span>
        </h2>
        <p class="poll-finale__lead">{{ copy.lead }}</p>

        <dl class="poll-finale__stats">
          <div class="poll-finale__stat">
            <dt>{{ copy.answered }}</dt>
            <dd><span ref="answeredEl">{{ answered }}</span><small>/{{ total }}</small></dd>
          </div>
          <div class="poll-finale__stat">
            <dt>{{ copy.time }}</dt>
            <dd>{{ clock }}</dd>
          </div>
        </dl>

        <div class="poll-finale__actions">
          <Button v-if="hasResults" variant="hero" @click="emit('results')">{{ copy.resultsCta }}</Button>
          <Button :variant="hasResults ? 'ghost' : 'hero'" :to="APP_PATHS.TU_VOZ_ENCUESTAS">{{ copy.moreCta }}</Button>
          <Button variant="ghost" @click="share">{{ copy.shareCta }}</Button>
        </div>

        <ul class="poll-finale__credits" aria-hidden="true">
          <li v-for="credit in copy.credits" :key="credit.role" class="poll-finale__credit">
            <span>{{ credit.role }}</span>
            <strong>{{ credit.name }}</strong>
          </li>
        </ul>
      </div>
    </div>

    <span class="poll-finale__streak" aria-hidden="true" />
    <span class="poll-finale__flash" aria-hidden="true" />
  </div>
</template>

<style scoped>
.poll-finale {
  position: relative;
  display: grid;
  align-items: center;
  min-height: calc(100svh - 240px);
  padding: clamp(56px, 7vw, 80px) clamp(20px, 4vw, 56px);
  isolation: isolate;
  overflow: hidden;
  border-radius: 20px;
}

/* Barras de cine y luces que se cuelan */
.poll-finale__bar {
  position: absolute;
  left: 0;
  right: 0;
  z-index: 3;
  height: clamp(18px, 4vh, 36px);
  background: #000;
  pointer-events: none;
}
.poll-finale__bar--top {
  top: 0;
  transform-origin: 50% 0;
}
.poll-finale__bar--bottom {
  bottom: 0;
  transform-origin: 50% 100%;
}
.poll-finale__leak {
  position: absolute;
  z-index: 0;
  width: 60%;
  aspect-ratio: 1;
  border-radius: 50%;
  filter: blur(70px);
  opacity: 0.35;
  pointer-events: none;
}
.poll-finale__leak--a {
  top: -20%;
  left: -15%;
  background: radial-gradient(circle, rgba(0, 136, 248, 0.9), transparent 70%);
  animation: poll-finale-drift 9s ease-in-out infinite alternate;
}
.poll-finale__leak--b {
  right: -20%;
  bottom: -25%;
  background: radial-gradient(circle, rgba(72, 180, 252, 0.7), transparent 70%);
  animation: poll-finale-drift 11s ease-in-out -4s infinite alternate-reverse;
}

/* Visor */
.poll-finale__finder {
  position: absolute;
  inset: clamp(26px, 5vh, 46px) 12px;
  z-index: 1;
  pointer-events: none;
}
.poll-finale__corner {
  position: absolute;
  width: clamp(22px, 4vw, 40px);
  aspect-ratio: 1;
  border: 0 solid rgba(234, 242, 255, 0.75);
}
.poll-finale__corner--tl { top: 0; left: 0; border-top-width: 2px; border-left-width: 2px; border-top-left-radius: 8px; }
.poll-finale__corner--tr { top: 0; right: 0; border-top-width: 2px; border-right-width: 2px; border-top-right-radius: 8px; }
.poll-finale__corner--bl { bottom: 0; left: 0; border-bottom-width: 2px; border-left-width: 2px; border-bottom-left-radius: 8px; }
.poll-finale__corner--br { bottom: 0; right: 0; border-bottom-width: 2px; border-right-width: 2px; border-bottom-right-radius: 8px; }
.poll-finale__rec,
.poll-finale__hud {
  position: absolute;
  top: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  font: 600 11px/1 var(--ui, Montserrat, sans-serif);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(234, 242, 255, 0.8);
}
.poll-finale__rec {
  left: clamp(30px, 5vw, 52px);
}
.poll-finale__hud {
  right: clamp(30px, 5vw, 52px);
}
.poll-finale__stop {
  width: 9px;
  height: 9px;
  border-radius: 2px;
  background: #eaf2ff;
}
.poll-finale__clock {
  font-variant-numeric: tabular-nums;
  color: rgba(234, 242, 255, 0.6);
}

/* Composición */
.poll-finale__grid {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: minmax(220px, 0.7fr) minmax(0, 1.3fr);
  gap: clamp(24px, 5vw, 64px);
  align-items: center;
}
.poll-finale__cam {
  position: relative;
  display: grid;
  justify-items: center;
  gap: 14px;
  margin: 0;
}
.poll-finale__cam-frame {
  width: min(300px, 100%);
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
.poll-finale__line {
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(0, 16, 40, 0.88);
  border: 1px solid rgba(72, 180, 252, 0.32);
  font-size: 13px;
  font-weight: 600;
  text-align: center;
}

/* Claqueta */
.poll-finale__clap {
  position: absolute;
  top: -6%;
  left: 2%;
  z-index: 2;
  display: grid;
  width: clamp(92px, 12vw, 128px);
  rotate: -10deg;
  filter: drop-shadow(0 10px 18px rgba(0, 0, 0, 0.6));
}
.poll-finale__stick {
  height: 14px;
  border-radius: 3px 3px 0 0;
  background: repeating-linear-gradient(-45deg, #eaf2ff 0 10px, #05070c 10px 20px);
  transform-origin: 0 100%;
}
.poll-finale__slate {
  display: grid;
  gap: 4px;
  padding: 8px 10px;
  border-radius: 0 0 6px 6px;
  background: #0b111c;
  border: 1px solid rgba(234, 242, 255, 0.25);
  font: 700 10px/1.1 var(--ui, Montserrat, sans-serif);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(234, 242, 255, 0.85);
}
.poll-finale__slate span:last-child {
  color: var(--cyan, #48b4fc);
}

.poll-finale__copy {
  display: grid;
  gap: 16px;
  align-content: center;
}
.poll-finale__clap-word {
  margin: 0;
  font-size: clamp(30px, 4.4vw, 52px) !important;
  line-height: 1 !important;
  color: var(--cyan, #48b4fc);
  justify-self: start;
  padding: 0.1em 0.35em 0.1em 0.05em;
}
.poll-finale__kicker {
  margin: 0;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--muted, rgba(234, 242, 255, 0.7));
}
.poll-finale__title {
  display: flex;
  flex-wrap: wrap;
  gap: 0 0.28em;
  margin: 0;
  font: 700 clamp(34px, 5vw, 60px) / 1.02 var(--display, Oswald, sans-serif);
  letter-spacing: 0.01em;
  text-transform: uppercase;
  outline: none;
  text-shadow: 0 6px 30px rgba(0, 0, 0, 0.6);
}
.poll-finale__word {
  display: inline-block;
  overflow: hidden;
  padding-bottom: 0.06em;
}
.poll-finale__word-inner {
  display: inline-block;
  transform-origin: 0 100%;
}
.poll-finale__lead {
  margin: 0;
  max-width: 52ch;
  font-size: 16px;
  line-height: 1.6;
  color: var(--muted, rgba(234, 242, 255, 0.8));
}
.poll-finale__stats {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin: 0;
}
.poll-finale__stat {
  display: grid;
  gap: 4px;
  min-width: 128px;
  padding: 12px 16px;
  border-radius: 14px;
  background: rgba(0, 16, 40, 0.7);
  border: 1px solid rgba(72, 180, 252, 0.28);
}
.poll-finale__stat dt {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--muted, rgba(234, 242, 255, 0.65));
}
.poll-finale__stat dd {
  margin: 0;
  font: 700 30px/1 var(--display, Oswald, sans-serif);
  font-variant-numeric: tabular-nums;
}
.poll-finale__stat small {
  margin-left: 2px;
  font-size: 16px;
  color: var(--muted, rgba(234, 242, 255, 0.6));
}
.poll-finale__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}
.poll-finale__credits {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, max-content));
  gap: 6px 28px;
  margin: 8px 0 0;
  padding: 14px 0 0;
  list-style: none;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}
.poll-finale__credit {
  display: flex;
  gap: 10px;
  align-items: baseline;
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(234, 242, 255, 0.55);
}
.poll-finale__credit strong {
  font: 600 13px/1 var(--display, Oswald, sans-serif);
  letter-spacing: 0.08em;
  color: #eaf2ff;
}

/* Efectos */
.poll-finale__streak {
  position: absolute;
  top: -20%;
  left: 0;
  z-index: 4;
  width: 22%;
  height: 140%;
  background: linear-gradient(100deg, transparent, rgba(200, 232, 255, 0.16), transparent);
  transform: rotate(14deg);
  opacity: 0;
  pointer-events: none;
}
.poll-finale__flash {
  position: fixed;
  inset: 0;
  z-index: 40;
  background: radial-gradient(circle at 50% 45%, #fff 0%, rgba(200, 232, 255, 0.85) 40%, rgba(72, 180, 252, 0) 75%);
  opacity: 0;
  pointer-events: none;
}

@keyframes poll-finale-drift {
  to { translate: 18% 12%; }
}

@media (max-width: 760px) {
  .poll-finale {
    min-height: calc(100svh - 190px);
    padding: 80px 20px 52px;
    align-items: start;
  }
  .poll-finale__grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  .poll-finale__cam {
    grid-template-columns: auto minmax(0, 1fr);
    align-items: center;
    justify-items: start;
    gap: 12px;
  }
  .poll-finale__cam-frame {
    width: clamp(104px, 30vw, 140px);
  }
  .poll-finale__clap {
    top: -12%;
    left: -4%;
    width: 74px;
  }
  .poll-finale__stat dt {
    letter-spacing: 0.08em;
  }
  .poll-finale__line {
    border-radius: 14px 14px 14px 4px;
    text-align: left;
  }
  .poll-finale__lead {
    font-size: 15px;
  }
  .poll-finale__stat {
    flex: 1;
    min-width: 0;
  }
  .poll-finale__actions > :first-child {
    flex: 1 1 100%;
  }
  .poll-finale__actions > :first-child :deep(.btn),
  .poll-finale__actions > :first-child.btn {
    width: 100%;
  }
  .poll-finale__credits {
    grid-template-columns: 1fr 1fr;
    gap: 10px 16px;
  }
  .poll-finale__credit {
    flex-direction: column;
    gap: 3px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .poll-finale__leak {
    animation: none;
  }
}
</style>
