<script setup lang="ts">
import gsap from 'gsap'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { POLLS_COPY, POLLS_STAGE } from '@modules/polls/constants/copy.ts'
import { prefersReducedMotion } from '@shared/motion/prefersReducedMotion.ts'

const props = defineProps<{
  title: string
  pose: string
}>()

const emit = defineEmits<{ done: [] }>()

const root = ref<HTMLElement | null>(null)
let timeline: gsap.core.Timeline | undefined
let finished = false

const words = computed(() => props.title.trim().split(/\s+/).map((word) => [...word]))

function finish() {
  if (finished) return
  finished = true
  timeline?.kill()
  emit('done')
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' || event.key === ' ' || event.key === 'Escape') {
    event.preventDefault()
    finish()
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown, { capture: true })
  const el = root.value
  if (!el) return
  if (prefersReducedMotion()) {
    timeline = gsap.timeline({ onComplete: finish }).to({}, { duration: POLLS_STAGE.sectionHold + 0.4 })
    return
  }
  const q = gsap.utils.selector(el)
  timeline = gsap.timeline({ onComplete: finish })
  timeline
    .fromTo(q('.poll-splash__flash'), { opacity: 0.95 }, { opacity: 0, duration: 0.45, ease: 'power2.out' })
    .from(q('.poll-splash__kicker'), { y: 12, opacity: 0, duration: 0.3, ease: 'power2.out' }, 0.1)
    .from(
      q('.poll-splash__char'),
      { yPercent: 110, rotate: 8, opacity: 0, duration: 0.5, ease: 'back.out(1.8)', stagger: 0.022 },
      0.15,
    )
    .fromTo(q('.poll-splash__stroke'), { scaleX: 0 }, { scaleX: 1, duration: 0.45, ease: 'power3.out' }, 0.45)
    .from(q('.poll-splash__pose'), { y: 80, rotate: -14, opacity: 0, duration: 0.6, ease: 'back.out(1.6)' }, 0.25)
    .to({}, { duration: POLLS_STAGE.sectionHold })
    .to(q('.poll-splash__inner'), { x: -60, opacity: 0, duration: 0.35, ease: 'power2.in' })
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown, { capture: true })
  timeline?.kill()
})
</script>

<template>
  <div ref="root" class="poll-splash" role="status" :aria-label="title" @click="finish">
    <span class="poll-splash__flash" aria-hidden="true" />
    <div class="poll-splash__inner">
      <p class="poll-splash__kicker">{{ POLLS_COPY.stepSection }}</p>
      <h2 class="poll-splash__title type-brush-dry" aria-hidden="true">
        <span v-for="(word, w) in words" :key="w" class="poll-splash__word">
          <span v-for="(char, c) in word" :key="c" class="poll-splash__char">{{ char }}</span>
        </span>
      </h2>
      <span class="poll-splash__stroke" aria-hidden="true" />
      <img class="poll-splash__pose" :src="pose" alt="" width="160" height="160" />
    </div>
    <p class="poll-splash__skip">{{ POLLS_COPY.stageSkip }}</p>
  </div>
</template>

<style scoped>
.poll-splash {
  position: relative;
  display: grid;
  place-items: center;
  min-height: min(62vh, 560px);
  cursor: pointer;
  user-select: none;
}
.poll-splash__flash {
  position: fixed;
  inset: 0;
  z-index: 40;
  background: radial-gradient(circle at 50% 45%, #fff 0%, rgba(200, 232, 255, 0.85) 40%, rgba(72, 180, 252, 0) 75%);
  opacity: 0;
  pointer-events: none;
}
.poll-splash__inner {
  position: relative;
  display: grid;
  justify-items: center;
  gap: 16px;
  max-width: 900px;
  text-align: center;
}
.poll-splash__kicker {
  margin: 0;
  font: 700 13px/1 var(--ui, Montserrat, sans-serif);
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--cyan, #48b4fc);
}
.poll-splash__title {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0 0.28em;
  margin: 0;
  font-size: clamp(40px, 8vw, 92px);
  line-height: 1.05;
  text-shadow: 0 0 32px rgba(0, 136, 248, 0.45);
}
.poll-splash__word {
  display: inline-flex;
  overflow: hidden;
  padding: 0.06em 0;
}
.poll-splash__char {
  display: inline-block;
  will-change: transform;
}
.poll-splash__stroke {
  width: min(320px, 60%);
  height: 6px;
  border-radius: 999px;
  background: linear-gradient(90deg, transparent, var(--blue, #0088f8), var(--cyan, #48b4fc), transparent);
  box-shadow: 0 0 18px rgba(72, 180, 252, 0.7);
  transform-origin: 0 50%;
}
.poll-splash__pose {
  width: clamp(110px, 18vw, 160px);
  height: auto;
  margin-top: 8px;
  object-fit: contain;
  filter: drop-shadow(0 18px 30px rgba(0, 0, 0, 0.6)) drop-shadow(0 0 24px rgba(72, 180, 252, 0.35));
}
.poll-splash__skip {
  position: absolute;
  bottom: 0;
  margin: 0;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(234, 242, 255, 0.45);
}
</style>
