<script setup lang="ts">
import gsap from 'gsap'
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { POLLS_COMPANION_LINES, POLLS_STAGE } from '@modules/polls/constants/copy.ts'
import { prefersReducedMotion } from '@shared/motion/prefersReducedMotion.ts'

const props = defineProps<{
  /** Avance del recorrido, de 0 a 1. */
  progress: number
  /** Cambia en cada pantalla para rotar la pose. */
  beat: number
  line?: string
}>()

const BUBBLE_MS = 3200

const root = ref<HTMLElement | null>(null)
const bubbleOpen = ref(true)
let bubbleTimer = 0

const pose = computed(() => POLLS_STAGE.poses[props.beat % POLLS_STAGE.poses.length]!)
const text = computed(() => {
  if (props.line) return props.line
  let pick = POLLS_COMPANION_LINES[0]!.text
  for (const entry of POLLS_COMPANION_LINES) if (props.progress >= entry.from) pick = entry.text
  return pick
})

function openBubble() {
  bubbleOpen.value = true
  window.clearTimeout(bubbleTimer)
  bubbleTimer = window.setTimeout(() => (bubbleOpen.value = false), BUBBLE_MS)
}

/** La cámara «toma la foto»: destello y sacudida corta. */
function snap() {
  const el = root.value
  if (!el || prefersReducedMotion()) return
  const q = gsap.utils.selector(el)
  gsap.fromTo(q('.poll-companion__flash'), { opacity: 0.9, scale: 0.6 }, { opacity: 0, scale: 1.6, duration: 0.45, ease: 'power2.out' })
  gsap.fromTo(q('.poll-companion__pose'), { rotate: -10, scale: 0.86 }, { rotate: 0, scale: 1, duration: 0.5, ease: 'back.out(2.4)' })
}

watch(text, openBubble, { immediate: true })
watch(
  () => props.beat,
  () => snap(),
)

onBeforeUnmount(() => window.clearTimeout(bubbleTimer))

defineExpose({ snap })
</script>

<template>
  <aside ref="root" class="poll-companion" aria-hidden="true" @click="openBubble">
    <Transition name="poll-bubble">
      <p v-if="bubbleOpen" class="poll-companion__bubble">{{ text }}</p>
    </Transition>
    <div class="poll-companion__orb">
      <span class="poll-companion__ring" />
      <img class="poll-companion__pose" :src="pose" alt="" width="96" height="96" />
      <span class="poll-companion__flash" />
      <span class="poll-companion__rec" />
    </div>
  </aside>
</template>

<style scoped>
.poll-companion {
  position: fixed;
  right: clamp(12px, 3vw, 32px);
  bottom: clamp(12px, 3vw, 32px);
  z-index: 30;
  display: flex;
  align-items: flex-end;
  gap: 10px;
  pointer-events: none;
}
.poll-companion__orb {
  position: relative;
  display: grid;
  place-items: center;
  width: clamp(68px, 9vw, 96px);
  aspect-ratio: 1;
  border-radius: 46% 54% 42% 58% / 48% 42% 58% 52%;
  background: radial-gradient(ellipse at 50% 38%, rgba(0, 16, 40, 0.96) 0%, #05070c 78%);
  border: 1px solid rgba(72, 180, 252, 0.35);
  box-shadow: 0 0 0 4px rgba(5, 7, 12, 0.7), 0 0 26px rgba(0, 136, 248, 0.45);
  pointer-events: auto;
  cursor: pointer;
  animation: poll-orb-float 4.2s ease-in-out infinite;
}
.poll-companion__ring {
  position: absolute;
  inset: -6px;
  border-radius: inherit;
  border: 1px solid rgba(72, 180, 252, 0.5);
  filter: blur(1px);
  animation: poll-orb-spin 9s linear infinite;
}
.poll-companion__pose {
  width: 78%;
  height: 78%;
  object-fit: contain;
  filter: drop-shadow(0 6px 10px rgba(0, 0, 0, 0.6));
}
.poll-companion__flash {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(circle, #fff 0%, rgba(200, 232, 255, 0.6) 45%, transparent 70%);
  opacity: 0;
}
.poll-companion__rec {
  position: absolute;
  top: 12%;
  right: 14%;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ff3b3b;
  box-shadow: 0 0 8px #ff3b3b;
  animation: poll-rec 1.4s steps(2, jump-none) infinite;
}
.poll-companion__bubble {
  max-width: 220px;
  margin: 0 0 18px;
  padding: 10px 14px;
  border-radius: 14px 14px 4px 14px;
  background: rgba(0, 16, 40, 0.92);
  border: 1px solid rgba(72, 180, 252, 0.35);
  font-size: 13px;
  font-weight: 600;
  line-height: 1.4;
  color: #eaf2ff;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45);
}
.poll-bubble-enter-active,
.poll-bubble-leave-active {
  transition: opacity 220ms ease, transform 220ms ease;
}
.poll-bubble-enter-from,
.poll-bubble-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.96);
}
@keyframes poll-orb-float {
  50% { transform: translateY(-6px) rotate(-2deg); }
}
@keyframes poll-orb-spin {
  to { transform: rotate(360deg); }
}
@keyframes poll-rec {
  50% { opacity: 0.2; }
}
@media (max-width: 600px) {
  .poll-companion__bubble {
    max-width: 160px;
    font-size: 12px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .poll-companion__orb,
  .poll-companion__ring,
  .poll-companion__rec {
    animation: none;
  }
}
</style>
