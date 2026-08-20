<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { prefersReducedMotion } from '@shared/motion/prefersReducedMotion.ts'
import {
  asymmetricRoundedRectPath,
  pointOnRoundedRectPath,
  roundedRectPath,
} from '@ui/roundedRectPath.ts'

/** Kit de marca visible sobre fondo oscuro (sin navy/ink/surface/line). */
const BRAND_COLORS = [
  '#0088f8',
  '#0068c8',
  '#48b4fc',
  '#70c0f8',
  '#f7fafc',
  '#e2e8f0',
  '#8b9bb0',
  '#3ddc97',
  '#e8a020',
  '#e23b4a',
  '#c878b4',
  '#d8a0e0',
  '#783c8c',
] as const

const TRAIL_FRAC = 0.7
const RGB = BRAND_COLORS.map((hex) => {
  const h = hex.slice(1)
  return [
    Number.parseInt(h.slice(0, 2), 16),
    Number.parseInt(h.slice(2, 4), 16),
    Number.parseInt(h.slice(4, 6), 16),
  ] as const
})

export type BorderSparkCorners = {
  readonly hx: readonly [number, number, number, number]
  readonly hy: readonly [number, number, number, number]
}

const props = withDefaults(
  defineProps<{
    radius?: number
    corners?: BorderSparkCorners
    outset?: number
    durationMs?: number
  }>(),
  {
    outset: 14,
    durationMs: 5200,
  },
)

const rootRef = ref<HTMLElement | null>(null)
const bodyRef = ref<HTMLElement | null>(null)
const glowPathRef = ref<SVGPathElement | null>(null)
const mainPathRef = ref<SVGPathElement | null>(null)
const sparkElRef = ref<HTMLElement | null>(null)
const frame = ref({ w: 0, h: 0 })

const reduced = prefersReducedMotion()
const active = computed(() => !reduced)
const visible = ref(true)

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

let raf = 0
let lastTickAt = 0
let progress = 0
let pathReady = false
let resizeObserver: ResizeObserver | undefined
let visibilityObserver: IntersectionObserver | undefined

function colorAlongBrand(pct: number): string {
  const n = RGB.length
  const t = ((pct % 100) / 100) * n
  const i = Math.floor(t) % n
  const j = (i + 1) % n
  const f = t - Math.floor(t)
  const a = RGB[i]!
  const b = RGB[j]!
  const r = (a[0] + (b[0] - a[0]) * f) | 0
  const g = (a[1] + (b[1] - a[1]) * f) | 0
  const bl = (a[2] + (b[2] - a[2]) * f) | 0
  return `rgb(${r}, ${g}, ${bl})`
}

function measure(): void {
  const el = bodyRef.value
  if (!el) return
  frame.value = { w: el.offsetWidth, h: el.offsetHeight }
}

function paint(nowProgress: number): void {
  const path = mainPathRef.value
  const glow = glowPathRef.value
  const spark = sparkElRef.value
  const root = rootRef.value
  if (!path || !spark || !root) return

  const color = colorAlongBrand(nowProgress)
  const t = nowProgress / 100
  const dash = `${TRAIL_FRAC} ${1 - TRAIL_FRAC}`
  const offset = `${TRAIL_FRAC - t}`

  root.style.setProperty('--spark-color', color)
  path.style.strokeDasharray = dash
  path.style.strokeDashoffset = offset
  path.style.stroke = color
  if (glow) {
    glow.style.strokeDasharray = dash
    glow.style.strokeDashoffset = offset
    glow.style.stroke = color
  }

  if (!pathReady) return
  const { w, h } = frame.value
  const outset = props.outset
  if (w < 1 || h < 1) return
  const pt = pointOnRoundedRectPath(path, nowProgress)
  spark.style.left = `${pt.x + outset}px`
  spark.style.top = `${pt.y + outset}px`
  spark.style.setProperty('--spark-tangent', `${pt.tangent}deg`)
}

function tick(now: number): void {
  if (!active.value || !visible.value) {
    raf = 0
    return
  }
  if (lastTickAt < 1) lastTickAt = now
  const dt = now - lastTickAt
  lastTickAt = now
  progress = (progress + (dt / props.durationMs) * 100) % 100
  paint(progress)
  raf = requestAnimationFrame(tick)
}

function startLoop(): void {
  if (raf || !active.value || !visible.value) return
  lastTickAt = 0
  raf = requestAnimationFrame(tick)
}

function stopLoop(): void {
  cancelAnimationFrame(raf)
  raf = 0
  lastTickAt = 0
}

function afterPathReady(): void {
  pathReady = Boolean(mainPathRef.value && frame.value.w > 0)
  paint(progress)
}

watch(borderPath, () => {
  nextTick(() => afterPathReady())
})

onMounted(() => {
  measure()
  nextTick(() => {
    afterPathReady()
    startLoop()
  })

  if (typeof ResizeObserver !== 'undefined' && bodyRef.value) {
    resizeObserver = new ResizeObserver(() => {
      measure()
      nextTick(() => afterPathReady())
    })
    resizeObserver.observe(bodyRef.value)
  }

  if (typeof IntersectionObserver !== 'undefined' && rootRef.value) {
    visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        visible.value = Boolean(entry?.isIntersecting)
        if (visible.value) startLoop()
        else stopLoop()
      },
      { root: null, threshold: 0.05 },
    )
    visibilityObserver.observe(rootRef.value)
  }
})

onBeforeUnmount(() => {
  stopLoop()
  resizeObserver?.disconnect()
  visibilityObserver?.disconnect()
})
</script>

<template>
  <div
    ref="rootRef"
    class="border-spark"
    :class="{ 'border-spark--on': active }"
    :style="{ '--spark-outset': `${outset}px` }"
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
        <!-- Un solo halo suave (sin blur CSS enorme) + trazo nítido -->
        <path
          ref="glowPathRef"
          :d="borderPath"
          class="border-spark__stroke border-spark__stroke--glow"
          pathLength="1"
        />
        <path
          ref="mainPathRef"
          :d="borderPath"
          class="border-spark__stroke border-spark__stroke--main"
          pathLength="1"
        />
      </svg>
      <span ref="sparkElRef" class="border-spark__spark">
        <span class="border-spark__burst">
          <span class="border-spark__ray border-spark__ray--a" />
          <span class="border-spark__ray border-spark__ray--b" />
          <span class="border-spark__ray border-spark__ray--c" />
        </span>
        <span class="border-spark__head">
          <svg class="border-spark__svg" viewBox="0 0 24 24" width="18" height="18" fill="none">
            <path
              class="border-spark__bolt"
              d="M12 1 L13.4 8.2 L21 10.2 L14.2 12.4 L16.2 22 L12 15.8 L7.8 22 L9.8 12.4 L3 10.2 L10.6 8.2 Z"
            />
          </svg>
        </span>
      </span>
    </div>
    <div ref="bodyRef" class="border-spark__body">
      <slot />
    </div>
  </div>
</template>
