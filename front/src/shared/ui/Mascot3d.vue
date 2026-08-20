<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import type { Mesh, MeshPhysicalMaterial, Texture, WebGLRenderer } from 'three'
import { prefersReducedMotion } from '@shared/motion/prefersReducedMotion.ts'
import { MASCOT_3D } from '@shared/ui/mascot.ts'
import MascotFlash from '@ui/MascotFlash.vue'

const host = ref<HTMLElement | null>(null)
const failed = ref(false)

let renderer: WebGLRenderer | undefined
let frame = 0
let dead = false

onMounted(() => {
  void boot()
})

onUnmounted(() => {
  dead = true
  window.cancelAnimationFrame(frame)
  const shell = host.value?.parentElement
  if (shell) shell.style.transform = ''
  renderer?.dispose()
  renderer?.domElement.remove()
  renderer = undefined
})

type EaseKind = 'soft' | 'settle' | 'snap' | 'fall' | 'bounce'

type PoseBeat = {
  at: number
  yaw: number
  pitch: number
  roll: number
  hop: number
  bend: number
  shake: number
  push: number
  flat: number
  x: number
  spin: number
  gone: number
  ease: EaseKind
}

type Pose = PoseBeat

type Clip = {
  id: string
  duration: number
  play: (u: number, twist: number) => Pose
}

function clamp01(t: number): number {
  return Math.min(1, Math.max(0, t))
}

function applyEase(t: number, kind: EaseKind): number {
  const x = clamp01(t)
  if (kind === 'fall') return x * x * x * x
  if (kind === 'snap') return 1 - (1 - x) ** 3
  if (kind === 'settle') {
    const c = 1.18
    return 1 + (c + 1) * (x - 1) ** 3 + c * (x - 1) ** 2
  }
  if (kind === 'bounce') {
    const c = 1.55
    return 1 + (c + 1) * (x - 1) ** 3 + c * (x - 1) ** 2
  }
  return x < 0.5 ? 2 * x * x : 1 - (2 - 2 * x) ** 2 / 2
}

function mix(a: number, b: number, k: number): number {
  return a + (b - a) * k
}

function lapX(frac: number, inner: number): number {
  const zip = 0.035
  if (frac < zip) return mix(-inner * 1.08, -inner, frac / zip)
  if (frac > 1 - zip) return mix(inner, inner * 1.08, (frac - (1 - zip)) / zip)
  return mix(-inner, inner, (frac - zip) / (1 - 2 * zip))
}

function restPose(): Pose {
  return {
    at: 0,
    yaw: 0,
    pitch: 0,
    roll: 0,
    hop: 0,
    bend: 0,
    shake: 0,
    push: 0,
    flat: 0,
    x: 0,
    spin: 0,
    gone: 0,
    ease: 'soft',
  }
}

function beat(at: number, pose: Partial<PoseBeat>, ease: EaseKind): PoseBeat {
  return { ...restPose(), ...pose, at, ease }
}

function poseAt(beats: readonly PoseBeat[], u: number): Pose {
  const t = clamp01(u)
  let from = beats[0]
  let to = beats[1]
  for (let i = 0; i < beats.length - 1; i += 1) {
    const a = beats[i]
    const b = beats[i + 1]
    if (!a || !b) continue
    if (t >= a.at && t <= b.at) {
      from = a
      to = b
      break
    }
  }
  if (!from || !to) return restPose()
  const span = to.at - from.at || 1
  const k = applyEase((t - from.at) / span, to.ease)
  return {
    at: t,
    yaw: mix(from.yaw, to.yaw, k),
    pitch: mix(from.pitch, to.pitch, k),
    roll: mix(from.roll, to.roll, k),
    hop: mix(from.hop, to.hop, k),
    bend: mix(from.bend, to.bend, k),
    shake: mix(from.shake, to.shake, k),
    push: mix(from.push, to.push, k),
    flat: mix(from.flat, to.flat, k),
    x: mix(from.x, to.x, k),
    spin: mix(from.spin, to.spin, k),
    gone: mix(from.gone, to.gone, k),
    ease: to.ease,
  }
}

function clipSides(u: number, twist: number): Pose {
  return poseAt(
    [
      beat(0, {}, 'soft'),
      beat(0.18, { yaw: -0.5, pitch: 0.05, roll: 0.04, hop: 0.006, bend: -twist }, 'settle'),
      beat(0.34, { yaw: -0.46, pitch: 0.03, roll: 0.02, bend: -twist * 0.7 }, 'soft'),
      beat(0.52, { yaw: 0.54, pitch: 0.04, roll: -0.04, hop: 0.006, bend: twist }, 'settle'),
      beat(0.68, { yaw: 0.5, pitch: 0.02, roll: -0.02, bend: twist * 0.7 }, 'soft'),
      beat(0.88, {}, 'snap'),
      beat(1, {}, 'soft'),
    ],
    u,
  )
}

function clipUp(u: number, twist: number): Pose {
  return poseAt(
    [
      beat(0, {}, 'soft'),
      beat(0.28, { yaw: 0.06, pitch: -0.32, roll: 0.02, hop: 0.01, bend: twist * 0.35 }, 'settle'),
      beat(0.55, { yaw: 0.06, pitch: -0.3, roll: 0.02, bend: twist * 0.3 }, 'soft'),
      beat(1, {}, 'snap'),
    ],
    u,
  )
}

function clipBack(u: number, twist: number): Pose {
  return poseAt(
    [
      beat(0, {}, 'soft'),
      beat(0.16, { yaw: 0.9, pitch: -0.02, roll: 0.05, hop: 0.04, bend: twist * 0.45 }, 'bounce'),
      beat(0.3, { yaw: 1.6, pitch: 0.02, roll: -0.02, hop: 0.03, bend: twist * 0.3 }, 'bounce'),
      beat(0.48, { yaw: 2.42, pitch: 0.05, roll: 0.04, hop: 0.008, bend: twist * 0.5 }, 'settle'),
      beat(0.66, { yaw: 2.42, pitch: 0.05, roll: 0.03, bend: twist * 0.4 }, 'soft'),
      beat(1, {}, 'snap'),
    ],
    u,
  )
}

function clipGlass(u: number, twist: number): Pose {
  return poseAt(
    [
      beat(0, {}, 'soft'),
      beat(0.22, { pitch: -0.34, roll: 0.02, hop: 0.02, bend: twist * 0.2, push: 0.22 }, 'settle'),
      beat(0.48, { pitch: -0.46, roll: 0.02, hop: 0.03, bend: 0.08, push: 0.42, flat: 0.08 }, 'soft'),
      beat(0.6, { pitch: -0.52, roll: 0.03, hop: 0.035, bend: 0.1, push: 0.52, flat: 0.15 }, 'soft'),
      beat(0.68, { yaw: 0.04, pitch: -0.58, roll: 0.05, hop: 0.028, bend: 0.04, shake: 1, push: 0.68, flat: 1 }, 'fall'),
      beat(0.78, { yaw: -0.06, pitch: -0.22, roll: -0.04, hop: 0.016, bend: 0.02, shake: 0.4, push: 0.28, flat: 0.25 }, 'bounce'),
      beat(0.88, { yaw: 0.12, pitch: 0.08, roll: -0.03, hop: 0.006, push: 0.02 }, 'settle'),
      beat(1, {}, 'snap'),
    ],
    u,
  )
}

function clipRun(u: number): Pose {
  const t = clamp01(u)
  const profile = 1.5
  const leanBack = -0.4
  const leanFwd = 0.64
  const inner = 0.64

  if (t < 0.1) {
    const k = applyEase(t / 0.1, 'settle')
    return {
      ...restPose(),
      at: t,
      yaw: profile * k,
      pitch: leanBack * 0.45 * k,
      hop: 0.018 * k,
      bend: 0.04,
      ease: 'settle',
    }
  }

  const runUntil = 0.72
  if (t < runUntil) {
    const runT = (t - 0.1) / (runUntil - 0.1)
    const full = 5
    const s = runT * (full + 0.5)
    const lap = Math.min(Math.floor(s), full)
    const frac = s - Math.floor(s)
    const steps = s * 8.5
    const gait = Math.abs(Math.sin(steps * Math.PI))
    if (lap < full) {
      return {
        ...restPose(),
        at: t,
        yaw: profile,
        pitch: leanBack,
        roll: Math.sin(steps * Math.PI) * 0.11,
        hop: gait * 0.068,
        bend: 0.07,
        x: lapX(frac, inner),
        ease: 'soft',
      }
    }
    const brake = applyEase(clamp01(frac / 0.5), 'snap')
    return {
      ...restPose(),
      at: t,
      yaw: profile,
      pitch: mix(leanBack, leanFwd, brake),
      roll: mix(Math.sin(steps * Math.PI) * 0.11, -0.1, brake),
      hop: mix(gait * 0.068, 0.01, brake),
      bend: mix(0.07, 0.02, brake),
      flat: 0.48 * brake * brake,
      x: mix(-inner, 0, brake),
      ease: 'snap',
    }
  }

  if (t < 0.82) {
    const k = applyEase((t - runUntil) / 0.1, 'bounce')
    return {
      ...restPose(),
      at: t,
      yaw: profile,
      pitch: mix(leanFwd, leanFwd * 0.78, k),
      roll: mix(-0.1, -0.04, k),
      hop: 0.01,
      flat: mix(0.48, 0.22, k),
      ease: 'bounce',
    }
  }

  const k = applyEase((t - 0.82) / 0.18, 'settle')
  const pant = Math.abs(Math.sin(t * 24)) * 0.01 * (1 - k)
  return {
    ...restPose(),
    at: t,
    yaw: mix(profile, 0, k),
    pitch: mix(leanFwd * 0.78, 0, k),
    roll: mix(-0.04, 0, k),
    hop: pant,
    flat: mix(0.22, 0, k),
    ease: 'settle',
  }
}

function clipWhoosh(u: number, twist: number): Pose {
  const t = clamp01(u)
  const away = Math.PI
  const step = (rate: number) => Math.abs(Math.sin(t * rate * Math.PI))

  if (t < 0.16) {
    const k = applyEase(t / 0.16, 'settle')
    return {
      ...restPose(),
      at: t,
      yaw: away * k,
      pitch: -0.14 * k,
      hop: step(10) * 0.03 * k,
      bend: twist * 0.22 * k,
      ease: 'settle',
    }
  }

  if (t < 0.34) {
    const k = applyEase((t - 0.16) / 0.18, 'soft')
    return {
      ...restPose(),
      at: t,
      yaw: away,
      pitch: -0.3,
      roll: Math.sin(t * 36) * 0.08,
      hop: step(16) * 0.06,
      bend: twist * 0.12,
      push: mix(0, -0.18, k),
      ease: 'soft',
    }
  }

  if (t < 0.42) {
    const k = applyEase((t - 0.34) / 0.08, 'settle')
    return {
      ...restPose(),
      at: t,
      yaw: away,
      pitch: mix(-0.3, 0.34, k),
      hop: mix(0.04, -0.014, k),
      push: mix(-0.18, -0.14, k),
      ease: 'settle',
    }
  }

  if (t < 0.54) {
    const k = applyEase((t - 0.42) / 0.12, 'settle')
    return {
      ...restPose(),
      at: t,
      yaw: mix(away, 0, k),
      pitch: mix(0.34, 0.16, k),
      hop: mix(-0.014, 0.01, k),
      push: -0.14,
      ease: 'settle',
    }
  }

  if (t < 0.66) {
    const k = applyEase((t - 0.54) / 0.12, 'fall')
    const pump = step(22) * 0.018 * (1 - k)
    return {
      ...restPose(),
      at: t,
      pitch: mix(0.16, 0.58, k),
      hop: mix(0.01, 0.028, k) + pump,
      bend: 0.06,
      push: mix(-0.14, 0.56, k),
      flat: 0.18 * k,
      ease: 'fall',
    }
  }

  if (t < 0.72) {
    const k = applyEase((t - 0.66) / 0.06, 'fall')
    return {
      ...restPose(),
      at: t,
      pitch: mix(0.58, 0.72, k),
      hop: 0.02,
      shake: mix(0.25, 1, k),
      push: mix(0.56, 0.68, k),
      flat: mix(0.18, 0.82, k),
      ease: 'fall',
    }
  }

  if (t < 0.76) {
    return { ...restPose(), at: t, gone: 1, shake: 0.12, ease: 'snap' }
  }

  if (t < 0.88) {
    const k = applyEase((t - 0.76) / 0.12, 'soft')
    return { ...restPose(), at: t, gone: 1, spin: k, ease: 'soft' }
  }

  if (t < 0.9) {
    return { ...restPose(), at: t, gone: 1, spin: 1, ease: 'soft' }
  }

  if (t < 0.96) {
    const k = applyEase((t - 0.9) / 0.06, 'bounce')
    return {
      ...restPose(),
      at: t,
      yaw: mix(0.48, 0.2, k),
      pitch: mix(0.1, 0.24, k),
      roll: mix(-0.1, 0.04, k),
      hop: 0.012 * (1 - k),
      x: mix(-0.5, 0.04, k),
      spin: 1,
      ease: 'bounce',
    }
  }

  const k = applyEase((t - 0.96) / 0.04, 'settle')
  return {
    ...restPose(),
    at: t,
    yaw: mix(0.2, 0, k),
    pitch: mix(0.24, 0, k),
    x: mix(0.04, 0, k),
    spin: 1,
    ease: 'settle',
  }
}

function clipButts(u: number): Pose {
  const pose = poseAt(
    [
      beat(0, {}, 'soft'),
      beat(0.08, { pitch: 0.28, hop: 0.01, push: -0.1 }, 'settle'),
      beat(0.13, { pitch: 0.52, hop: 0.02, push: 0.58, flat: 0.45 }, 'fall'),
      beat(0.2, { pitch: 0.18, hop: 0.006, push: 0.16, flat: 0.08 }, 'bounce'),
      beat(0.28, { pitch: 0.32, push: -0.12 }, 'settle'),
      beat(0.33, { yaw: -0.06, pitch: 0.58, hop: 0.024, push: 0.64, flat: 0.55 }, 'fall'),
      beat(0.4, { pitch: 0.16, push: 0.14, flat: 0.06 }, 'bounce'),
      beat(0.48, { pitch: 0.36, roll: 0.04, push: -0.14 }, 'settle'),
      beat(0.53, { yaw: 0.08, pitch: 0.62, hop: 0.028, push: 0.7, flat: 0.7 }, 'fall'),
      beat(0.6, { pitch: 0.2, push: 0.18, flat: 0.1 }, 'bounce'),
      beat(0.68, { pitch: 0.4, hop: 0.012, push: -0.16 }, 'settle'),
      beat(0.73, { yaw: -0.04, pitch: 0.72, hop: 0.03, push: 0.76, flat: 0.85 }, 'fall'),
      beat(0.82, { yaw: 0.12, pitch: 0.22, roll: 0.1, hop: 0.008, push: 0.08 }, 'bounce'),
      beat(0.9, { yaw: -0.1, pitch: 0.12, roll: -0.08 }, 'settle'),
      beat(1, {}, 'snap'),
    ],
    u,
  )
  pose.shake = Math.max(pose.shake, glassRattle(u, [0.13, 0.33, 0.53, 0.73]))
  return pose
}

function glassRattle(u: number, hits: readonly number[]): number {
  let peak = 0
  for (let i = 0; i < hits.length; i += 1) {
    const hit = hits[i]
    if (hit === undefined || u < hit) continue
    const age = (u - hit) / 0.1
    if (age > 1) continue
    const punch = (1 - age) * (1 - age)
    peak = Math.max(peak, punch * (0.72 + i * 0.1))
  }
  return peak
}

function clipSad(u: number, twist: number): Pose {
  const pose = poseAt(
    [
      beat(0, {}, 'soft'),
      beat(0.16, { yaw: -0.12, pitch: 0.22, roll: 0.06, hop: -0.02, bend: -twist * 0.4 }, 'settle'),
      beat(0.32, { yaw: -0.18, pitch: 0.42, roll: 0.1, hop: -0.045, bend: -twist * 0.55 }, 'soft'),
      beat(0.48, { yaw: -0.08, pitch: 0.52, roll: -0.08, hop: -0.055, bend: -twist * 0.35 }, 'settle'),
      beat(0.62, { yaw: -0.16, pitch: 0.58, roll: 0.12, hop: -0.06, bend: -twist * 0.5 }, 'soft'),
      beat(0.74, { yaw: -0.1, pitch: 0.5, roll: 0.08, hop: -0.05, bend: -twist * 0.4 }, 'soft'),
      beat(0.88, { yaw: -0.04, pitch: 0.18, hop: -0.016 }, 'settle'),
      beat(1, {}, 'snap'),
    ],
    u,
  )
  if (u > 0.2 && u < 0.78) {
    const sniff = (u - 0.2) / 0.58
    pose.hop += Math.sin(sniff * 22) * 0.006
    pose.roll += Math.sin(sniff * 7) * 0.045
    pose.shake = Math.max(pose.shake, Math.abs(Math.sin(sniff * 14)) * 0.12)
  }
  return pose
}

function allClips(): readonly Clip[] {
  return [
    { id: 'sides', duration: 4.2, play: clipSides },
    { id: 'up', duration: 3.1, play: clipUp },
    { id: 'back', duration: 4.6, play: clipBack },
    { id: 'glass', duration: 4.4, play: clipGlass },
    { id: 'run', duration: 4.2, play: (progress) => clipRun(progress) },
    { id: 'whoosh', duration: 7.4, play: clipWhoosh },
    { id: 'butts', duration: 4.8, play: (progress) => clipButts(progress) },
    { id: 'sad', duration: 5.8, play: clipSad },
  ]
}

function pickClip(lastId: string): Clip {
  const pool = allClips().filter((clip) => clip.id !== lastId)
  return pool[Math.floor(Math.random() * pool.length)] ?? allClips()[0]!
}

function shuffleClips(): Clip[] {
  const deck = [...allClips()]
  for (let i = deck.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    const a = deck[i]
    const b = deck[j]
    if (!a || !b) continue
    deck[i] = b
    deck[j] = a
  }
  return deck
}

function makePlayer(twist: number, pauseMin: number, pauseMax: number): (seconds: number) => Pose {
  const firstRound = shuffleClips()
  let roundIndex = 0
  let clip = firstRound[0] ?? allClips()[0]!
  let lastId = ''
  let phase: 'pause' | 'play' = 'pause'
  let until = 0
  let playAt = 0
  let primed = false

  return (seconds: number): Pose => {
    if (!primed) {
      primed = true
      lastId = clip.id
      until = seconds + pauseMin + Math.random() * (pauseMax - pauseMin)
      phase = 'pause'
      return restPose()
    }
    if (phase === 'pause') {
      if (seconds < until) return restPose()
      phase = 'play'
      playAt = seconds
    }
    const progress = (seconds - playAt) / clip.duration
    if (progress >= 1) {
      lastId = clip.id
      roundIndex += 1
      if (roundIndex < firstRound.length) {
        clip = firstRound[roundIndex] ?? pickClip(lastId)
      } else {
        clip = pickClip(lastId)
      }
      until = seconds + pauseMin + Math.random() * (pauseMax - pauseMin)
      phase = 'pause'
      return restPose()
    }
    return clip.play(progress, twist)
  }
}

function driveShell(shell: HTMLElement | null, amount: number, spin: number, time: number): void {
  if (!shell) return
  const turns = ((spin % 1) + 1) % 1
  if (amount < 0.02 && turns < 0.002) {
    shell.style.transform = ''
    return
  }
  const x = Math.sin(time * 88) * 16 * amount
  const y = Math.cos(time * 71) * 12 * amount
  const r = Math.sin(time * 54) * 3.4 * amount
  const flip = (turns * 360).toFixed(1)
  shell.style.transform = `perspective(560px) rotateY(${flip}deg) translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) rotate(${r.toFixed(2)}deg)`
}

type BendUniforms = {
  look: { value: number }
  tilt: { value: number }
  yMin: { value: number }
  yMax: { value: number }
  pivotX: { value: number }
  pivotZ: { value: number }
}

function hookNeckBend(material: MeshPhysicalMaterial, bend: BendUniforms): void {
  material.customProgramCacheKey = () => 'paola-mascot-neck'
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uLook = bend.look
    shader.uniforms.uTilt = bend.tilt
    shader.uniforms.uYMin = bend.yMin
    shader.uniforms.uYMax = bend.yMax
    shader.uniforms.uPivotX = bend.pivotX
    shader.uniforms.uPivotZ = bend.pivotZ
    shader.vertexShader = `
      uniform float uLook;
      uniform float uTilt;
      uniform float uYMin;
      uniform float uYMax;
      uniform float uPivotX;
      uniform float uPivotZ;
      ${shader.vertexShader}
    `
      .replace(
        '#include <beginnormal_vertex>',
        `#include <beginnormal_vertex>
        float neckN = smoothstep(uYMin, uYMax, position.y);
        neckN = neckN * neckN;
        float neckNa = uLook * neckN;
        float neckNc = cos(neckNa);
        float neckNs = sin(neckNa);
        objectNormal = vec3(
          objectNormal.x * neckNc - objectNormal.z * neckNs,
          objectNormal.y,
          objectNormal.x * neckNs + objectNormal.z * neckNc
        );`,
      )
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        float neckT = smoothstep(uYMin, uYMax, transformed.y);
        neckT = pow(neckT, 1.2);
        float neckA = uLook * neckT;
        float neckC = cos(neckA);
        float neckS = sin(neckA);
        vec3 neckP = transformed - vec3(uPivotX, 0.0, uPivotZ);
        transformed.x = neckP.x * neckC - neckP.z * neckS + uPivotX;
        transformed.z = neckP.x * neckS + neckP.z * neckC + uPivotZ;
        transformed.x += uTilt * neckT * 0.05;
        transformed.y += abs(uLook) * neckT * 0.01;`,
      )
  }
}

function paintGlassMaps(
  THREE: typeof import('three'),
  diffuse: Texture,
  metalSrc: Texture,
  roughSrc: Texture,
): { metal: Texture; rough: Texture; coat: Texture } {
  const picture = textureImage(diffuse)
  const width = picture.width
  const height = picture.height
  const albedo = readPixels(picture, width, height)
  const metalPx = readPixels(textureImage(metalSrc), width, height)
  const roughPx = readPixels(textureImage(roughSrc), width, height)
  const metalOut = new ImageData(width, height)
  const roughOut = new ImageData(width, height)
  const coatOut = new ImageData(width, height)
  for (let i = 0; i < albedo.data.length; i += 4) {
    const r = albedo.data[i] ?? 0
    const g = albedo.data[i + 1] ?? 0
    const b = albedo.data[i + 2] ?? 0
    const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const sat = max === 0 ? 0 : (max - min) / max
    const lens = lum < 0.3 && sat < 0.25 ? 1 : 0
    const bodyMetal = metalPx.data[i] ?? 0
    const bodyRough = roughPx.data[i] ?? 255
    const metal = Math.round(mix(Math.max(bodyMetal, 28), 235, lens))
    const rough = Math.round(mix(Math.min(bodyRough, 168), 16, lens))
    const coat = Math.round(mix(40, 255, lens))
    metalOut.data[i] = metal
    metalOut.data[i + 1] = metal
    metalOut.data[i + 2] = metal
    metalOut.data[i + 3] = 255
    roughOut.data[i] = rough
    roughOut.data[i + 1] = rough
    roughOut.data[i + 2] = rough
    roughOut.data[i + 3] = 255
    coatOut.data[i] = coat
    coatOut.data[i + 1] = coat
    coatOut.data[i + 2] = coat
    coatOut.data[i + 3] = 255
  }
  return {
    metal: canvasTexture(THREE, metalOut),
    rough: canvasTexture(THREE, roughOut),
    coat: canvasTexture(THREE, coatOut),
  }
}

function textureImage(texture: Texture): HTMLImageElement | HTMLCanvasElement {
  const image = texture.image as HTMLImageElement | HTMLCanvasElement | ImageBitmap
  if (image instanceof HTMLImageElement || image instanceof HTMLCanvasElement) return image
  const canvas = document.createElement('canvas')
  canvas.width = Number(image.width)
  canvas.height = Number(image.height)
  canvas.getContext('2d')?.drawImage(image as CanvasImageSource, 0, 0)
  return canvas
}

function readPixels(image: CanvasImageSource, width: number, height: number): ImageData {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) return new ImageData(width, height)
  ctx.drawImage(image, 0, 0, width, height)
  return ctx.getImageData(0, 0, width, height)
}

function canvasTexture(THREE: typeof import('three'), pixels: ImageData): Texture {
  const canvas = document.createElement('canvas')
  canvas.width = pixels.width
  canvas.height = pixels.height
  canvas.getContext('2d')?.putImageData(pixels, 0, 0)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.NoColorSpace
  texture.flipY = true
  texture.needsUpdate = true
  return texture
}

async function boot(): Promise<void> {
  const el = host.value
  if (!el) return

  try {
    const THREE = await import('three')
    const { OBJLoader } = await import('three/addons/loaders/OBJLoader.js')
    if (dead || !host.value) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(32, 1, 0.05, 20)
    camera.position.set(0, 0.12, 2.4)
    camera.lookAt(0, 0.02, 0)

    const webgl = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    webgl.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    webgl.setClearColor(0x000000, 0)
    webgl.outputColorSpace = THREE.SRGBColorSpace
    webgl.toneMapping = THREE.ACESFilmicToneMapping
    webgl.toneMappingExposure = 1.12
    el.appendChild(webgl.domElement)
    renderer = webgl

    const { RoomEnvironment } = await import('three/addons/environments/RoomEnvironment.js')
    if (dead) return
    const pmrem = new THREE.PMREMGenerator(webgl)
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    pmrem.dispose()

    scene.add(new THREE.HemisphereLight(0x70c0f8, 0x001028, 0.85))
    const key = new THREE.DirectionalLight(0xffffff, 1.15)
    key.position.set(1.4, 2.2, 2.4)
    scene.add(key)
    const rim = new THREE.DirectionalLight(0x48b4fc, 0.7)
    rim.position.set(-2, 0.4, -1.2)
    scene.add(rim)
    const spark = new THREE.PointLight(0xffffff, 2.4, 6)
    spark.position.set(0.45, 0.55, 1.7)
    scene.add(spark)
    const cool = new THREE.PointLight(0x7ad0ff, 1.6, 6)
    cool.position.set(-0.7, 0.15, 1.35)
    scene.add(cool)

    const textures = new THREE.TextureLoader()
    const [diffuse, metalSrc, roughSrc] = await Promise.all([
      textures.loadAsync(MASCOT_3D.diffuse),
      textures.loadAsync(MASCOT_3D.metallic),
      textures.loadAsync(MASCOT_3D.roughness),
    ])
    if (dead) return
    diffuse.colorSpace = THREE.SRGBColorSpace
    const glass = paintGlassMaps(THREE, diffuse, metalSrc, roughSrc)

    const material = new THREE.MeshPhysicalMaterial({
      map: diffuse,
      metalnessMap: glass.metal,
      roughnessMap: glass.rough,
      clearcoatMap: glass.coat,
      metalness: 1,
      roughness: 1,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      ior: 1.52,
      iridescence: 0.35,
      iridescenceIOR: 1.3,
      envMapIntensity: 1.55,
    })

    const object = await new OBJLoader().loadAsync(MASCOT_3D.obj)
    if (dead) return
    object.traverse((child) => {
      const mesh = child as Mesh
      if (mesh.isMesh) {
        mesh.material = material
      }
    })

    const box = new THREE.Box3().setFromObject(object)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    object.position.sub(center)
    const span = Math.max(size.x, size.y, size.z) || 1
    object.scale.setScalar(1.35 / span)
    scene.add(object)
    const restY = object.position.y
    const restZ = object.position.z
    const restX = object.position.x
    const restScale = object.scale.x

    const look = prefersReducedMotion() ? null : MASCOT_3D.look
    const bend = {
      look: { value: 0 },
      tilt: { value: 0 },
      yMin: { value: box.min.y + size.y * (look?.from ?? 0.18) },
      yMax: { value: box.min.y + size.y * (look?.to ?? 0.95) },
      pivotX: { value: center.x },
      pivotZ: { value: center.z },
    }
    hookNeckBend(material, bend)
    material.needsUpdate = true

    const fit = (): void => {
      const node = host.value
      if (!node || !renderer) return
      const w = node.clientWidth
      const h = node.clientHeight
      renderer.setSize(w, h, false)
      camera.aspect = w / Math.max(h, 1)
      camera.updateProjectionMatrix()
    }
    fit()
    window.addEventListener('resize', fit)

    const nextPose = look ? makePlayer(look.yaw, look.pauseMin, look.pauseMax) : null

    const tick = (now: number): void => {
      if (dead) {
        window.removeEventListener('resize', fit)
        driveShell(host.value?.parentElement ?? null, 0, 0, 0)
        return
      }
      if (look && nextPose) {
        const pose = nextPose(now * 0.001)
        const hidden = pose.gone > 0.5
        object.visible = !hidden
        object.rotation.y = pose.yaw
        object.rotation.x = pose.pitch
        object.rotation.z = pose.roll
        object.position.y = restY + pose.hop
        object.position.z = restZ + pose.push
        object.position.x = restX + pose.x
        const grow = 1 + pose.push * 0.95
        object.scale.set(
          restScale * grow * (1 + pose.flat * 0.22),
          restScale * grow * (1 + pose.flat * 0.1),
          restScale * grow * (1 - pose.flat * 0.45),
        )
        bend.look.value = pose.bend
        bend.tilt.value = pose.roll * 0.35
        const aim = Math.min(1, Math.max(0, pose.push) / 0.48)
        camera.position.set(0, 0.12 + 0.36 * aim, 2.4 - 0.06 * aim)
        camera.lookAt(0, 0.02 + 0.32 * aim, 0)
        driveShell(host.value?.parentElement ?? null, pose.shake, pose.spin, now * 0.001)
      }
      renderer?.render(scene, camera)
      frame = window.requestAnimationFrame(tick)
    }
    frame = window.requestAnimationFrame(tick)
  } catch {
    failed.value = true
  }
}
</script>

<template>
  <MascotFlash v-if="failed" />
  <div v-else ref="host" class="mascot-3d" role="img" aria-label="Cámara 360" />
</template>
