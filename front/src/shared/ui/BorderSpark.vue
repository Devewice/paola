<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { prefersReducedMotion } from '@shared/motion/prefersReducedMotion.ts'
import { pointOnRoundedRectPath, roundedRectPath, asymmetricRoundedRectPath } from '@ui/roundedRectPath.ts'

/** Kit de marca visible sobre fondo oscuro (sin navy/ink/surface/line). */
const BRAND_COLORS = [
  '#0088f8', // blue
  '#0068c8', // blue-deep
  '#48b4fc', // cyan
  '#70c0f8', // cyan-soft
  '#f7fafc', // white
  '#e2e8f0', // incauta
  '#8b9bb0', // muted
  '#3ddc97', // ok / wa
  '#e8a020', // warn
  '#e23b4a', // danger
  '#c878b4', // armargura
  '#d8a0e0', // armargura-soft
  '#783c8c', // armargura-deep
] as const

/** Fracción del contorno que ocupa el rastro (70%). */
const TRAIL_FRAC = 0.7

export type BorderSparkCorners = {
  /** Fracciones horizontales TL TR BR BL (como border-radius antes de /). */
  readonly hx: readonly [number, number, number, number]
  /** Fracciones verticales TL TR BR BL (como border-radius después de /). */
  readonly hy: readonly [number, number, number, number]
}

const props = withDefaults(
  defineProps<{
    /** Radio del path en px; si no, ~48% del lado menor (casi óvalo). */
    radius?: number
    /** Si hay corners, el path sigue ese border-radius asimétrico (mismo del contenedor). */
    corners?: BorderSparkCorners
    outset?: number
    /** Duración de una vuelta completa del borde. */
    durationMs?: number
  }>(),
  {
    outset: 14,
    durationMs: 5200,
  },
)

const bodyRef = ref<HTMLElement | null>(null)
const sparkPathRef = ref<SVGPathElement | null>(null)
const frame = ref({ w: 0, h: 0 })
const pathLength = ref(0)
const progress = ref(0)
let raf = 0
let lastTickAt = 0
let resizeObserver: ResizeObserver | undefined

const reduced = prefersReducedMotion()
const active = computed(() => !reduced)

const pathRadius = computed(() => {
  if (props.radius !== undefined) return props.radius
  const side = Math.min(frame.value.w, frame.value.h)
  return Math.max(12, side * 0.48)
})

const borderPath = computed(() => {
  const { w, h } = frame.value
  if (props.corners) {
    return asymmetricRoundedRectPath(w, h, props.corners.hx, props.corners.hy)
  }
  return roundedRectPath(w, h, pathRadius.value)
})

const sparkColor = computed(() => colorAlongBrand(progress.value))

const trailStyle = computed(() => {
  if (pathLength.value < 1) return {}
  const t = progress.value / 100
  const trail = TRAIL_FRAC
  /* Misma dirección que getPointAtLength: punta del rastro en t. */
  return {
    strokeDasharray: `${trail} ${1 - trail}`,
    strokeDashoffset: `${trail - t}`,
    stroke: sparkColor.value,
  }
})

const sparkStyle = computed(() => {
  const path = sparkPathRef.value
  const { w, h } = frame.value
  const outset = props.outset
  void pathLength.value
  void progress.value
  if (!path || w < 1 || h < 1) {
    return {
      left: `${w / 2 + outset}px`,
      top: `${outset}px`,
      '--spark-tangent': '-90deg',
      '--spark-color': sparkColor.value,
    }
  }
  const pt = pointOnRoundedRectPath(path, progress.value)
  return {
    left: `${pt.x + outset}px`,
    top: `${pt.y + outset}px`,
    '--spark-tangent': `${pt.tangent}deg`,
    '--spark-color': sparkColor.value,
  }
})

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  return [
    Number.parseInt(h.slice(0, 2), 16),
    Number.parseInt(h.slice(2, 4), 16),
    Number.parseInt(h.slice(4, 6), 16),
  ]
}

function colorAlongBrand(pct: number): string {
  const n = BRAND_COLORS.length
  const t = ((pct % 100) / 100) * n
  const i = Math.floor(t) % n
  const j = (i + 1) % n
  const f = t - Math.floor(t)
  const a = hexToRgb(BRAND_COLORS[i] ?? BRAND_COLORS[0])
  const b = hexToRgb(BRAND_COLORS[j] ?? BRAND_COLORS[0])
  const r = Math.round(a[0] + (b[0] - a[0]) * f)
  const g = Math.round(a[1] + (b[1] - a[1]) * f)
  const bl = Math.round(a[2] + (b[2] - a[2]) * f)
  return `rgb(${r}, ${g}, ${bl})`
}

function measure(): void {
  const el = bodyRef.value
  if (!el) return
  frame.value = { w: el.offsetWidth, h: el.offsetHeight }
}

function syncPathLength(): void {
  pathLength.value = sparkPathRef.value?.getTotalLength() ?? 0
}

function tick(now: number): void {
  if (!active.value) return
  if (lastTickAt < 1) lastTickAt = now
  const dt = now - lastTickAt
  lastTickAt = now
  progress.value = (progress.value + (dt / props.durationMs) * 100) % 100
  raf = requestAnimationFrame(tick)
}

function startLoop(): void {
  cancelAnimationFrame(raf)
  lastTickAt = 0
  if (!active.value) return
  raf = requestAnimationFrame(tick)
}

onMounted(() => {
  measure()
  if (typeof ResizeObserver !== 'undefined' && bodyRef.value) {
    resizeObserver = new ResizeObserver(() => {
      measure()
      nextTick(() => syncPathLength())
    })
    resizeObserver.observe(bodyRef.value)
  }
  nextTick(() => {
    syncPathLength()
    startLoop()
  })
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  resizeObserver?.disconnect()
})
</script>

<template>
  <div
    class="border-spark"
    :class="{ 'border-spark--on': active }"
    :style="{ '--spark-outset': `${outset}px`, '--spark-color': sparkColor }"
  >
    <div v-if="active" class="border-spark__glow" aria-hidden="true">
      <svg
        v-if="frame.w > 0 && frame.h > 0"
        class="border-spark__path"
        :viewBox="`0 0 ${frame.w} ${frame.h}`"
        :width="frame.w"
        :height="frame.h"
      >
        <path :d="borderPath" class="border-spark__track" pathLength="1" />
        <path
          :d="borderPath"
          class="border-spark__stroke border-spark__stroke--halo"
          pathLength="1"
          :style="trailStyle"
        />
        <path
          :d="borderPath"
          class="border-spark__stroke border-spark__stroke--blur"
          pathLength="1"
          :style="trailStyle"
        />
        <path
          ref="sparkPathRef"
          :d="borderPath"
          class="border-spark__stroke border-spark__stroke--main"
          pathLength="1"
          :style="trailStyle"
        />
      </svg>
      <span class="border-spark__spark" :style="sparkStyle">
        <span class="border-spark__burst">
          <span class="border-spark__ray border-spark__ray--a" />
          <span class="border-spark__ray border-spark__ray--b" />
          <span class="border-spark__ray border-spark__ray--c" />
          <span class="border-spark__ray border-spark__ray--d" />
          <span class="border-spark__ray border-spark__ray--e" />
          <span class="border-spark__ray border-spark__ray--f" />
          <span class="border-spark__ray border-spark__ray--g" />
          <span class="border-spark__ray border-spark__ray--h" />
          <span class="border-spark__ray border-spark__ray--i" />
        </span>
        <span class="border-spark__head">
          <svg class="border-spark__svg" viewBox="0 0 24 24" width="20" height="20" fill="none">
            <path
              class="border-spark__bolt"
              d="M12 1 L13.4 8.2 L21 10.2 L14.2 12.4 L16.2 22 L12 15.8 L7.8 22 L9.8 12.4 L3 10.2 L10.6 8.2 Z"
            />
            <path class="border-spark__needle" d="M12 3 L12 21" />
            <path class="border-spark__needle border-spark__needle--b" d="M4 11 L20 13" />
            <path class="border-spark__needle border-spark__needle--c" d="M6 6 L18 18" />
          </svg>
        </span>
      </span>
    </div>
    <div ref="bodyRef" class="border-spark__body">
      <slot />
    </div>
  </div>
</template>
