<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

type StreakKind = 'red' | 'amber' | 'head'

type Streak = {
  kind: StreakKind
  x: number
  y: number
  speed: number
  length: number
  thickness: number
  opacity: number
  blinkPhase: number
  blinkPeriod: number
  depth: number
}

const wrapRef = ref<HTMLElement | null>(null)
const pinRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const copPinRef = ref<HTMLElement | null>(null)
const copCanvasRef = ref<HTMLCanvasElement | null>(null)

let raf = 0
let running = false
let reduced = false
let width = 0
let height = 0
let dpr = 1
let lastTs = 0
let parallaxY = 0
let scrollTween: gsap.core.Tween | undefined
const streaks: Streak[] = []

type CopBurst = {
  active: boolean
  until: number
  nextAt: number
}

const cop: CopBurst = {
  active: false,
  until: 0,
  nextAt: 3,
}

function rand(min: number, max: number): number {
  return min + Math.random() * (max - min)
}

function spawn(kind?: StreakKind): Streak {
  const roll = Math.random()
  const picked: StreakKind =
    kind ?? (roll < 0.34 ? 'red' : roll < 0.67 ? 'amber' : 'head')
  const depth = rand(0.4, 1)
  return {
    kind: picked,
    x: rand(-0.55, 0.2) * width,
    y: rand(0.48, 0.88) * height,
    speed: (picked === 'head' ? rand(2400, 3400) : rand(1800, 2800)) * (0.7 + depth * 0.6),
    length: (picked === 'head' ? rand(160, 280) : rand(180, 360)) * depth,
    thickness:
      (picked === 'amber' ? rand(2.4, 3.8) : picked === 'head' ? rand(2.8, 4.6) : rand(2.6, 4.5)) *
      depth,
    opacity:
      (picked === 'red'
        ? rand(0.62, 0.95)
        : picked === 'amber'
          ? rand(0.75, 1)
          : rand(0.55, 0.88)) *
      (0.65 + depth * 0.45),
    blinkPhase: Math.random() * Math.PI * 2,
    blinkPeriod: rand(3.2, 5.5),
    depth,
  }
}

function ensureFleet(): void {
  streaks.length = 0
  const mix: StreakKind[] = ['red', 'red', 'red', 'amber', 'amber', 'amber', 'head', 'head', 'head']
  for (const kind of mix) streaks.push(spawn(kind))
}

function colorFor(kind: StreakKind, alpha: number): string {
  if (kind === 'red') return `rgba(255, 52, 52, ${alpha})`
  if (kind === 'amber') return `rgba(255, 186, 40, ${alpha})`
  return `rgba(255, 248, 230, ${alpha})`
}

function cornerPoint(corner: 0 | 1 | 2 | 3): { x: number; y: number } {
  return {
    x: corner === 0 || corner === 3 ? 0 : width,
    y: corner === 0 || corner === 1 ? 0 : height,
  }
}

function paintCorner(
  ctx: CanvasRenderingContext2D,
  corner: 0 | 1 | 2 | 3,
  rgb: string,
  alpha: number,
  radiusScale: number,
): void {
  if (alpha <= 0.01) return
  const { x, y } = cornerPoint(corner)
  const radius = Math.max(width, height) * radiusScale
  const glow = ctx.createRadialGradient(x, y, 0, x, y, radius)
  glow.addColorStop(0, `rgba(${rgb}, ${alpha})`)
  glow.addColorStop(0.35, `rgba(${rgb}, ${alpha * 0.55})`)
  glow.addColorStop(1, `rgba(${rgb}, 0)`)
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, width, height)
}

/** Patrulla: doble rojo / doble azul, el doble de rápido; ráfagas más cortas. */
function drawCopFlash(ctx: CanvasRenderingContext2D, t: number): void {
  ctx.clearRect(0, 0, width, height)

  if (t >= cop.nextAt && !cop.active) {
    cop.active = true
    cop.until = t + rand(0.25, 0.75)
  }
  if (cop.active && t >= cop.until) {
    cop.active = false
    cop.nextAt = t + rand(5, 11)
  }
  if (!cop.active) return

  const stepMs = 28
  const step = Math.floor((t * 1000) / stepMs) % 8
  if (step % 2 !== 0) return

  const alpha = 0.78
  if (step === 0 || step === 2) {
    paintCorner(ctx, 0, '255, 28, 48', alpha, 0.62)
    paintCorner(ctx, 2, '255, 28, 48', alpha * 0.85, 0.55)
  }
  if (step === 4 || step === 6) {
    paintCorner(ctx, 1, '40, 120, 255', alpha, 0.62)
    paintCorner(ctx, 3, '40, 120, 255', alpha * 0.85, 0.55)
  }
}

function drawTraffic(ctx: CanvasRenderingContext2D, dt: number, t: number): void {
  ctx.clearRect(0, 0, width, height)

  for (const s of streaks) {
    s.x += s.speed * dt
    if (s.x - s.length > width + 80) {
      Object.assign(s, spawn(s.kind), { x: rand(-0.6, -0.1) * width })
    }

    let alpha = s.opacity
    if (s.kind === 'amber') {
      const blink = 0.5 + 0.5 * Math.sin(t * s.blinkPeriod + s.blinkPhase)
      alpha *= blink > 0.38 ? 1 : 0.06
    }

    const y = s.y + parallaxY * s.depth * 0.35
    const x0 = s.x
    const x1 = s.x - s.length
    const grad = ctx.createLinearGradient(x0, y, x1, y)
    grad.addColorStop(0, colorFor(s.kind, alpha))
    grad.addColorStop(0.4, colorFor(s.kind, alpha * 0.45))
    grad.addColorStop(1, colorFor(s.kind, 0))

    ctx.strokeStyle = grad
    ctx.lineWidth = s.thickness
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(x0, y)
    ctx.lineTo(x1, y)
    ctx.stroke()

    if (s.kind !== 'red' && alpha > 0.12) {
      ctx.fillStyle = colorFor(s.kind, alpha * 0.9)
      ctx.beginPath()
      ctx.arc(x0, y, s.thickness * (s.kind === 'head' ? 1.45 : 1.2), 0, Math.PI * 2)
      ctx.fill()
    } else if (s.kind === 'red' && alpha > 0.15) {
      ctx.fillStyle = colorFor(s.kind, alpha * 0.85)
      ctx.beginPath()
      ctx.arc(x0, y, s.thickness * 1.2, 0, Math.PI * 2)
      ctx.fill()
    }
  }
}

function sizeCanvas(canvas: HTMLCanvasElement, w: number, h: number): CanvasRenderingContext2D | null {
  canvas.width = Math.floor(w * dpr)
  canvas.height = Math.floor(h * dpr)
  canvas.style.width = `${w}px`
  canvas.style.height = `${h}px`
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  return ctx
}

function resize(): void {
  const pin = pinRef.value
  const canvas = canvasRef.value
  const copPin = copPinRef.value
  const copCanvas = copCanvasRef.value
  if (!pin || !canvas) return
  dpr = Math.min(window.devicePixelRatio || 1, 2)
  width = Math.max(1, pin.clientWidth)
  height = Math.max(1, pin.clientHeight)
  sizeCanvas(canvas, width, height)
  if (copPin && copCanvas) {
    sizeCanvas(copCanvas, Math.max(1, copPin.clientWidth), Math.max(1, copPin.clientHeight))
  }
  ensureFleet()
}

function loop(now: number): void {
  if (!running) return
  const ctx = canvasRef.value?.getContext('2d')
  const copCtx = copCanvasRef.value?.getContext('2d')
  if (!ctx) return
  const dt = lastTs ? Math.min(0.05, (now - lastTs) / 1000) : 0.016
  lastTs = now
  const t = now / 1000
  drawTraffic(ctx, dt, t)
  if (copCtx) drawCopFlash(copCtx, t)
  raf = requestAnimationFrame(loop)
}

function start(): void {
  if (running || reduced) return
  running = true
  lastTs = 0
  raf = requestAnimationFrame(loop)
}

function stop(): void {
  running = false
  if (raf) cancelAnimationFrame(raf)
  raf = 0
}

function onVis(): void {
  if (document.hidden) stop()
  else if (!reduced) start()
}

function bindParallax(): void {
  const wrap = wrapRef.value
  const pin = pinRef.value
  if (!wrap || !pin || reduced) return
  const page = wrap.parentElement
  if (!page) return

  scrollTween = gsap.fromTo(
    pin,
    { y: 0 },
    {
      y: 48,
      ease: 'none',
      scrollTrigger: {
        trigger: page,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
        onUpdate(self) {
          parallaxY = self.progress * 40
        },
      },
    },
  )
  ScrollTrigger.refresh()
}

onMounted(() => {
  reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  resize()
  window.addEventListener('resize', resize)
  document.addEventListener('visibilitychange', onVis)

  if (reduced) {
    const ctx = canvasRef.value?.getContext('2d')
    if (ctx) drawTraffic(ctx, 0, 0)
    return
  }

  bindParallax()
  start()
})

onUnmounted(() => {
  stop()
  scrollTween?.scrollTrigger?.kill()
  scrollTween?.kill()
  scrollTween = undefined
  window.removeEventListener('resize', resize)
  document.removeEventListener('visibilitychange', onVis)
})
</script>

<template>
  <div ref="wrapRef" class="road-lights road-lights--back" aria-hidden="true">
    <div ref="pinRef" class="road-lights__pin">
      <canvas ref="canvasRef" class="road-lights__canvas" />
    </div>
  </div>
  <div class="road-lights road-lights--fore" aria-hidden="true">
    <div ref="copPinRef" class="road-lights__pin">
      <canvas ref="copCanvasRef" class="road-lights__cop" />
    </div>
  </div>
</template>

<style scoped>
.road-lights {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: clip;
}

.road-lights--back {
  z-index: 0;
}

.road-lights--fore {
  z-index: 3;
}

.road-lights__pin {
  position: sticky;
  top: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.road-lights--back .road-lights__pin {
  will-change: transform;
}

.road-lights__canvas {
  display: block;
  width: 100%;
  height: 100%;
  transform: scale(1.08);
  transform-origin: center center;
  filter: blur(10px);
  opacity: 1;
}

.road-lights__cop {
  display: block;
  width: 100%;
  height: 100%;
  filter: blur(7px);
  opacity: 0.95;
}
</style>
