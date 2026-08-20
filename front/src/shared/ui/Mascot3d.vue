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
  if (shell) {
    shell.style.transform = ''
    shell.style.borderRadius = ''
  }
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

function mixAngle(a: number, b: number, k: number): number {
  let delta = ((b - a + Math.PI) % (2 * Math.PI)) - Math.PI
  if (delta < -Math.PI) delta += 2 * Math.PI
  return a + delta * k
}

function mixPose(a: Pose, b: Pose, k: number): Pose {
  return {
    at: mix(a.at, b.at, k),
    yaw: mixAngle(a.yaw, b.yaw, k),
    pitch: mix(a.pitch, b.pitch, k),
    roll: mix(a.roll, b.roll, k),
    hop: mix(a.hop, b.hop, k),
    bend: mix(a.bend, b.bend, k),
    shake: mix(a.shake, b.shake, k),
    push: mix(a.push, b.push, k),
    flat: mix(a.flat, b.flat, k),
    x: mix(a.x, b.x, k),
    spin: mix(a.spin, b.spin, k),
    gone: mix(a.gone, b.gone, k),
    ease: b.ease,
  }
}

function softenClip(pose: Pose, u: number): Pose {
  const lead = 0.03
  const tail = 0.045
  if (u < lead) {
    return mixPose(REST_POSE, pose, applyEase(u / lead, 'soft'))
  }
  if (u > 1 - tail) {
    return mixPose(pose, REST_POSE, applyEase((u - (1 - tail)) / tail, 'soft'))
  }
  return pose
}

const REST_POSE: Pose = {
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

const TEXTURE_MAX = 1024
const SHELL_IDLE_MS = 50

function restPose(): Pose {
  return REST_POSE
}

function beat(at: number, pose: Partial<PoseBeat>, ease: EaseKind): PoseBeat {
  return { ...restPose(), ...pose, at, ease }
}

function poseAt(beats: readonly PoseBeat[], u: number): Pose {
  const t = clamp01(u)
  const last = beats[beats.length - 1]
  if (last && t >= last.at) return { ...last, at: t }
  let from = beats[0]
  let to = beats[1]
  for (let i = 0; i < beats.length - 1; i += 1) {
    const a = beats[i]
    const b = beats[i + 1]
    if (!a || !b) continue
    if (t >= a.at && t < b.at) {
      from = a
      to = b
      break
    }
  }
  if (!from || !to) return restPose()
  const span = to.at - from.at || 1
  const k = clamp01(applyEase((t - from.at) / span, to.ease))
  return {
    at: t,
    yaw: mixAngle(from.yaw, to.yaw, k),
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
      beat(0.18, { yaw: -0.72, pitch: 0.08, roll: 0.08, hop: 0.014, bend: -twist }, 'soft'),
      beat(0.34, { yaw: -0.66, pitch: 0.05, roll: 0.05, bend: -twist * 0.75 }, 'soft'),
      beat(0.43, { yaw: 0, pitch: 0.03, hop: 0.008, roll: 0.01, bend: 0 }, 'soft'),
      beat(0.52, { yaw: 0.78, pitch: 0.07, roll: -0.08, hop: 0.014, bend: twist }, 'soft'),
      beat(0.68, { yaw: 0.72, pitch: 0.04, roll: -0.05, bend: twist * 0.75 }, 'soft'),
      beat(0.94, { yaw: 0.04, pitch: 0.005, roll: -0.005, bend: twist * 0.04 }, 'soft'),
      beat(1, {}, 'soft'),
    ],
    u,
  )
}

function clipUp(u: number, twist: number): Pose {
  return poseAt(
    [
      beat(0, {}, 'soft'),
      beat(0.28, { yaw: 0.1, pitch: -0.48, roll: 0.05, hop: 0.018, bend: twist * 0.55 }, 'soft'),
      beat(0.55, { yaw: 0.08, pitch: -0.44, roll: 0.04, bend: twist * 0.48 }, 'soft'),
      beat(0.94, { pitch: -0.03, hop: 0.002, bend: twist * 0.05 }, 'soft'),
      beat(1, {}, 'soft'),
    ],
    u,
  )
}

function clipBack(u: number, twist: number): Pose {
  const back = Math.PI
  return poseAt(
    [
      beat(0, {}, 'soft'),
      beat(0.1, { yaw: 0.42, pitch: -0.1, hop: 0.018, bend: twist * 0.2 }, 'soft'),
      beat(0.34, { yaw: back, pitch: 0.1, bend: twist * 0.58 }, 'soft'),
      beat(0.44, { yaw: back - 0.78, pitch: 0.1, roll: 0.08, hop: 0.014, bend: -twist * 0.85 }, 'soft'),
      beat(0.54, { yaw: back + 0.72, pitch: 0.08, roll: -0.09, hop: 0.016, bend: twist * 0.9 }, 'soft'),
      beat(0.64, { yaw: back - 0.28, pitch: -0.36, roll: -0.04, hop: 0.02, bend: twist * 0.5 }, 'soft'),
      beat(0.74, { yaw: back + 0.34, pitch: 0.12, roll: 0.06, hop: 0.014, bend: -twist * 0.65 }, 'soft'),
      beat(0.96, { yaw: 0.03, pitch: 0.01, roll: 0.005, hop: 0.002, bend: twist * 0.03 }, 'soft'),
      beat(1, {}, 'soft'),
    ],
    u,
  )
}

function clipCurious(u: number, twist: number): Pose {
  return poseAt(
    [
      beat(0, {}, 'soft'),
      beat(0.22, { pitch: -0.18, push: 0.12, bend: twist * 0.32 }, 'soft'),
      beat(0.42, { pitch: -0.36, push: 0.28, hop: 0.012, bend: twist * 0.52 }, 'soft'),
      beat(0.58, { pitch: -0.28, push: 0.22, yaw: 0.12, roll: 0.06, bend: twist * 0.4 }, 'soft'),
      beat(0.74, { pitch: -0.1, push: 0.06, yaw: 0.04, roll: 0.02, bend: twist * 0.08 }, 'soft'),
      beat(0.95, { pitch: -0.01, push: 0.005, yaw: 0.005 }, 'soft'),
      beat(1, {}, 'soft'),
    ],
    u,
  )
}

function clipSway(u: number, twist: number): Pose {
  return poseAt(
    [
      beat(0, {}, 'soft'),
      beat(0.28, { yaw: -0.32, roll: 0.06, hop: 0.01, bend: -twist * 0.38 }, 'soft'),
      beat(0.55, { yaw: 0.32, roll: -0.06, hop: 0.014, bend: twist * 0.38 }, 'soft'),
      beat(0.94, { yaw: -0.03, roll: 0.005, hop: 0.001, bend: twist * 0.03 }, 'soft'),
      beat(1, {}, 'soft'),
    ],
    u,
  )
}

function clipPeek(u: number, twist: number): Pose {
  return poseAt(
    [
      beat(0, {}, 'soft'),
      beat(0.22, { x: -0.34, yaw: -0.52, pitch: 0.08, roll: 0.1, bend: -twist * 0.48 }, 'soft'),
      beat(0.4, { x: -0.26, yaw: -0.42, pitch: 0.06, roll: 0.07, bend: -twist * 0.38 }, 'soft'),
      beat(0.49, { x: 0, yaw: 0, pitch: 0.03, roll: 0.01, bend: 0 }, 'soft'),
      beat(0.58, { x: 0.34, yaw: 0.56, pitch: 0.06, roll: -0.1, bend: twist * 0.52 }, 'soft'),
      beat(0.93, { x: 0.04, yaw: 0.05, pitch: 0.01, roll: -0.01, bend: twist * 0.05 }, 'soft'),
      beat(1, {}, 'soft'),
    ],
    u,
  )
}

function clipDream(u: number, twist: number): Pose {
  return poseAt(
    [
      beat(0, {}, 'soft'),
      beat(0.24, { pitch: -0.32, roll: 0.05, hop: 0.014, bend: twist * 0.42 }, 'soft'),
      beat(0.48, { pitch: -0.46, roll: -0.05, hop: 0.022, bend: twist * 0.58 }, 'soft'),
      beat(0.68, { pitch: -0.36, yaw: 0.14, roll: 0.06, bend: twist * 0.45 }, 'soft'),
      beat(0.94, { pitch: -0.03, hop: 0.002, yaw: 0.02, roll: 0.005, bend: twist * 0.05 }, 'soft'),
      beat(1, {}, 'soft'),
    ],
    u,
  )
}

function clipNod(u: number, twist: number): Pose {
  return poseAt(
    [
      beat(0, {}, 'soft'),
      beat(0.16, { pitch: 0.24, hop: 0.012, bend: twist * 0.28 }, 'soft'),
      beat(0.3, { pitch: 0.04, hop: 0.004, bend: twist * 0.08 }, 'soft'),
      beat(0.44, { pitch: 0.2, hop: 0.01, bend: twist * 0.24 }, 'soft'),
      beat(0.58, { pitch: 0.04, hop: 0.003, bend: twist * 0.06 }, 'soft'),
      beat(0.94, { pitch: 0.03, roll: 0.01, bend: twist * 0.04 }, 'soft'),
      beat(1, {}, 'soft'),
    ],
    u,
  )
}

function clipPeace(u: number, twist: number): Pose {
  return poseAt(
    [
      beat(0, {}, 'soft'),
      beat(0.3, { pitch: 0.1, roll: 0.05, hop: -0.014, bend: twist * 0.28, yaw: -0.12 }, 'soft'),
      beat(0.55, { pitch: 0.06, yaw: -0.22, roll: 0.06, hop: -0.02, bend: twist * 0.2 }, 'soft'),
      beat(0.94, { pitch: 0.01, yaw: 0.03, hop: -0.002, bend: twist * 0.04 }, 'soft'),
      beat(1, {}, 'soft'),
    ],
    u,
  )
}

function clipJelly(u: number, twist: number): Pose {
  const t = clamp01(u)
  const fadeIn = clamp01(t / 0.05)
  const fadeOut = t > 0.93 ? clamp01((1 - t) / 0.07) : 1
  const amp = fadeIn * fadeOut
  const beat = t * Math.PI * 5.4
  const sway = Math.sin(beat)
  const wobble = Math.sin(beat + 0.55)
  const neck = Math.sin(beat - 0.95)
  const jiggle = Math.sin(beat * 1.65 - 1.2)
  const squash = Math.abs(sway) * 0.22

  return {
    ...restPose(),
    at: t,
    yaw: (sway * 0.42 + wobble * 0.14) * amp,
    roll: (sway * 0.16 + jiggle * 0.09) * amp,
    pitch: (Math.sin(beat * 2.1) * 0.06 + squash * 0.1) * amp,
    hop: (Math.abs(sway) * 0.026 + Math.sin(beat * 2.1) * 0.008) * amp,
    bend: twist * (neck * 0.82 + jiggle * 0.38) * amp,
    x: sway * 0.1 * amp,
    flat: squash * 0.42 * amp,
    ease: 'soft',
  }
}

function clipEnter(u: number, twist: number): Pose {
  const t = clamp01(u)
  if (t < 0.78) {
    const k = clamp01(applyEase(t / 0.78, 'soft'))
    return {
      ...restPose(),
      at: t,
      yaw: Math.sin(t * 9) * 0.1 * k,
      pitch: mix(0.32, 0.05, k),
      roll: mix(0.1, 0.03, k),
      hop: mix(-0.52, 0.018, k),
      bend: twist * mix(0.45, 0.14, k),
      ease: 'soft',
    }
  }
  const k = clamp01(applyEase((t - 0.78) / 0.22, 'soft'))
  const yawStart = Math.sin(0.78 * 9) * 0.1
  return {
    ...restPose(),
    at: t,
    yaw: mixAngle(yawStart, 0, k),
    pitch: mix(0.05, 0, k),
    roll: mix(0.03, 0, k),
    hop: mix(0.018, 0, k),
    bend: twist * mix(0.14, 0, k),
    ease: 'soft',
  }
}

const ENTRY_CLIP: Clip = { id: 'enter', duration: 2.5, play: clipEnter }

function playClipPose(clip: Clip, progress: number, twist: number): Pose {
  const u = clamp01(progress)
  const pose = clip.play(u, twist)
  if (clip.id === 'enter' || clip.id === 'jelly') return pose
  return softenClip(pose, u)
}
function allClips(): readonly Clip[] {
  return [
    { id: 'sides', duration: 4.2, play: clipSides },
    { id: 'up', duration: 3.1, play: clipUp },
    { id: 'back', duration: 6.2, play: clipBack },
    { id: 'curious', duration: 4.6, play: clipCurious },
    { id: 'sway', duration: 5.4, play: clipSway },
    { id: 'peek', duration: 4.8, play: clipPeek },
    { id: 'dream', duration: 5.6, play: clipDream },
    { id: 'nod', duration: 3.8, play: clipNod },
    { id: 'jelly', duration: 5.8, play: clipJelly },
    { id: 'peace', duration: 5.2, play: clipPeace },
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

function pauseUntil(seconds: number, pauseMin: number, pauseMax: number, factor = 1): number {
  const min = pauseMin * factor
  const max = pauseMax * factor
  return seconds + min + Math.random() * Math.max(0, max - min)
}

type PosePlayer = {
  pose: (seconds: number) => Pose
  animating: () => boolean
}

function makePlayer(twist: number, pauseMin: number, pauseMax: number): PosePlayer {
  const firstRound = shuffleClips()
  let roundIndex = 0
  let clip = firstRound[0] ?? allClips()[0]!
  let lastId = 'enter'
  let phase: 'enter' | 'pause' | 'play' = 'enter'
  let until = 0
  let playAt = 0
  let primed = false

  return {
    pose(seconds: number): Pose {
      if (!primed) {
        primed = true
        playAt = seconds
        phase = 'enter'
        return clipEnter(0, twist)
      }
      if (phase === 'enter') {
        const progress = (seconds - playAt) / ENTRY_CLIP.duration
        if (progress >= 1) {
          phase = 'pause'
          until = pauseUntil(seconds, pauseMin, pauseMax, 0.35)
          return REST_POSE
        }
        return playClipPose(ENTRY_CLIP, progress, twist)
      }
      if (phase === 'pause') {
        if (seconds < until) return REST_POSE
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
        until = pauseUntil(seconds, pauseMin, pauseMax, 0.7)
        phase = 'pause'
        return REST_POSE
      }
      return playClipPose(clip, progress, twist)
    },
    animating(): boolean {
      return phase !== 'pause'
    },
  }
}

function blobRadius(
  base: number,
  time: number,
  amp: number,
  freqA: number,
  freqB: number,
  phase: number,
): number {
  return base + Math.sin(time * freqA + phase) * amp + Math.cos(time * freqB + phase * 0.7) * (amp * 0.55)
}

function morphShellBlob(shell: HTMLElement, time: number): void {
  shell.style.borderRadius = [
    `${blobRadius(46, time, 5.2, 1.55, 2.35, 0).toFixed(2)}%`,
    `${blobRadius(54, time, 4.6, 1.42, 2.65, 0.8).toFixed(2)}%`,
    `${blobRadius(42, time, 5.6, 1.68, 2.15, 1.6).toFixed(2)}%`,
    `${blobRadius(58, time, 4.2, 1.48, 2.85, 2.4).toFixed(2)}%`,
    '/',
    `${blobRadius(48, time, 4.8, 1.88, 2.05, 0.5).toFixed(2)}%`,
    `${blobRadius(42, time, 4.2, 1.35, 2.75, 1.2).toFixed(2)}%`,
    `${blobRadius(58, time, 5.1, 1.72, 2.45, 2.1).toFixed(2)}%`,
    `${blobRadius(52, time, 3.8, 1.95, 2.55, 3).toFixed(2)}%`,
  ].join(' ')
}

function driveShell(
  shell: HTMLElement | null,
  amount: number,
  spin: number,
  time: number,
  animateBlob: boolean,
): void {
  if (!shell) return
  if (animateBlob) morphShellBlob(shell, time)

  const turns = ((spin % 1) + 1) % 1
  const idleR = animateBlob ? Math.sin(time * 1.85) * 0.7 + Math.sin(time * 2.7) * 0.35 : 0
  const idleSkew = animateBlob ? Math.sin(time * 2.15) * 0.5 : 0

  if (amount < 0.02 && turns < 0.002) {
    shell.style.transform = animateBlob
      ? `rotate(${idleR.toFixed(2)}deg) skewX(${idleSkew.toFixed(2)}deg)`
      : ''
    return
  }
  const x = Math.sin(time * 88) * 16 * amount
  const y = Math.cos(time * 71) * 12 * amount
  const r = Math.sin(time * 54) * 3.4 * amount + idleR
  const flip = (turns * 360).toFixed(1)
  shell.style.transform = `perspective(560px) rotateY(${flip}deg) translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) rotate(${r.toFixed(2)}deg) skewX(${idleSkew.toFixed(2)}deg)`
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

function downscaleImage(image: HTMLImageElement | HTMLCanvasElement, max: number): HTMLCanvasElement {
  const w = image.width
  const h = image.height
  const scale = Math.min(1, max / Math.max(w, h))
  const nw = Math.max(1, Math.round(w * scale))
  const nh = Math.max(1, Math.round(h * scale))
  const canvas = document.createElement('canvas')
  canvas.width = nw
  canvas.height = nh
  canvas.getContext('2d')?.drawImage(image, 0, 0, nw, nh)
  return canvas
}

function paintGlassMaps(
  THREE: typeof import('three'),
  diffuse: Texture,
  metalSrc: Texture,
  roughSrc: Texture,
): { metal: Texture; rough: Texture; coat: Texture; albedo: Texture } {
  const picture = downscaleImage(textureImage(diffuse), TEXTURE_MAX)
  const width = picture.width
  const height = picture.height
  const albedoPx = readPixels(picture, width, height)
  const metalPx = readPixels(downscaleImage(textureImage(metalSrc), TEXTURE_MAX), width, height)
  const roughPx = readPixels(downscaleImage(textureImage(roughSrc), TEXTURE_MAX), width, height)
  const albedoOut = new ImageData(width, height)
  const metalOut = new ImageData(width, height)
  const roughOut = new ImageData(width, height)
  const coatOut = new ImageData(width, height)
  for (let i = 0; i < albedoPx.data.length; i += 4) {
    const r = albedoPx.data[i] ?? 0
    const g = albedoPx.data[i + 1] ?? 0
    const b = albedoPx.data[i + 2] ?? 0
    const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const sat = max === 0 ? 0 : (max - min) / max
    const lens = lum < 0.3 && sat < 0.25 ? 1 : 0
    const bodyMetal = metalPx.data[i] ?? 0
    const bodyRough = roughPx.data[i] ?? 255
    const grain = 0.9 + (1 - lum) * 0.22

    let or = r
    let og = g
    let ob = b
    if (!lens) {
      const warm = 1.01
      or = Math.min(255, r * warm + 1)
      og = Math.min(255, g * warm + 1)
      ob = Math.min(255, b * warm)
      const mid = 148
      or = Math.min(255, Math.max(0, mid + (or - mid) * 1.06))
      og = Math.min(255, Math.max(0, mid + (og - mid) * 1.06))
      ob = Math.min(255, Math.max(0, mid + (ob - mid) * 1.06))
    }

    const metal = lens ? 210 : Math.round(bodyMetal * 0.18)
    const rough = lens ? 18 : Math.round(mix(98, 198, bodyRough / 255) * grain)
    const coat = lens ? 255 : 0

    albedoOut.data[i] = or
    albedoOut.data[i + 1] = og
    albedoOut.data[i + 2] = ob
    albedoOut.data[i + 3] = 255
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
  const albedo = canvasTexture(THREE, albedoOut)
  albedo.colorSpace = THREE.SRGBColorSpace
  return {
    albedo,
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
  texture.flipY = false
  texture.needsUpdate = true
  return texture
}

async function boot(): Promise<void> {
  const el = host.value
  if (!el) return

  try {
    const THREE = await import('three')
    const { GLTFLoader } = await import('three/addons/loaders/GLTFLoader.js')
    const { DRACOLoader } = await import('three/addons/loaders/DRACOLoader.js')
    if (dead || !host.value) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(32, 1, 0.05, 20)
    camera.position.set(0, 0.12, 2.4)
    camera.lookAt(0, 0.02, 0)

    const webgl = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' })
    webgl.setPixelRatio(Math.min(window.devicePixelRatio, 1.25))
    webgl.setClearColor(0x000000, 0)
    webgl.outputColorSpace = THREE.SRGBColorSpace
    webgl.toneMapping = THREE.ACESFilmicToneMapping
    webgl.toneMappingExposure = 0.84
    el.appendChild(webgl.domElement)
    renderer = webgl

    const { RoomEnvironment } = await import('three/addons/environments/RoomEnvironment.js')
    if (dead) return
    const pmrem = new THREE.PMREMGenerator(webgl)
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    pmrem.dispose()

    scene.add(new THREE.HemisphereLight(0x88b8e8, 0x001028, 0.54))
    const key = new THREE.DirectionalLight(0xfff6ee, 0.66)
    key.position.set(1.4, 2.2, 2.4)
    scene.add(key)
    const rim = new THREE.DirectionalLight(0x48b4fc, 0.28)
    rim.position.set(-2, 0.4, -1.2)
    scene.add(rim)
    const fill = new THREE.DirectionalLight(0xc8dff5, 0.22)
    fill.position.set(-0.8, 0.6, 2.1)
    scene.add(fill)

    const textures = new THREE.TextureLoader()
    const [diffuse, metalSrc, roughSrc] = await Promise.all([
      textures.loadAsync(MASCOT_3D.diffuse),
      textures.loadAsync(MASCOT_3D.metallic),
      textures.loadAsync(MASCOT_3D.roughness),
    ])
    if (dead) return
    const maps = paintGlassMaps(THREE, diffuse, metalSrc, roughSrc)

    const material = new THREE.MeshPhysicalMaterial({
      map: maps.albedo,
      metalnessMap: maps.metal,
      roughnessMap: maps.rough,
      clearcoatMap: maps.coat,
      metalness: 0.54,
      roughness: 0.88,
      clearcoat: 0.34,
      clearcoatRoughness: 0.34,
      ior: 1.52,
      iridescence: 0.03,
      iridescenceIOR: 1.28,
      envMapIntensity: 0.5,
      color: new THREE.Color(0xe7dccf),
    })

    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/draco/')
    const gltfLoader = new GLTFLoader()
    gltfLoader.setDRACOLoader(dracoLoader)
    const gltf = await gltfLoader.loadAsync(MASCOT_3D.model)
    const object = gltf.scene
    dracoLoader.dispose()
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

    const motion = !prefersReducedMotion()
    const player = look ? makePlayer(look.yaw, look.pauseMin, look.pauseMax) : null
    let pageVisible = !document.hidden
    let lastShellAt = 0
    let staticRendered = false

    const onResize = (): void => {
      fit()
      staticRendered = false
    }

    const onVisibility = (): void => {
      pageVisible = !document.hidden
      if (pageVisible) staticRendered = false
    }

    fit()
    window.addEventListener('resize', onResize)
    document.addEventListener('visibilitychange', onVisibility)

    const tick = (now: number): void => {
      const shell = host.value?.parentElement ?? null
      const t = now * 0.001
      if (dead) {
        window.removeEventListener('resize', onResize)
        document.removeEventListener('visibilitychange', onVisibility)
        driveShell(shell, 0, 0, t, false)
        return
      }
      if (!pageVisible) {
        frame = window.requestAnimationFrame(tick)
        return
      }

      let drawScene = false

      if (look && player) {
        const pose = player.pose(t)
        if (player.animating()) {
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
          bend.tilt.value = pose.roll * 0.55
          const aim = Math.min(1, Math.max(0, pose.push) / 0.48)
          camera.position.set(0, 0.12 + 0.36 * aim, 2.4 - 0.06 * aim)
          camera.lookAt(0, 0.02 + 0.32 * aim, 0)
          driveShell(shell, pose.shake, pose.spin, t, motion)
          drawScene = true
        } else if (now - lastShellAt >= SHELL_IDLE_MS) {
          driveShell(shell, 0, 0, t, motion)
          lastShellAt = now
        }
      } else if (!staticRendered) {
        driveShell(shell, 0, 0, t, motion)
        drawScene = true
        staticRendered = true
      }

      if (drawScene) renderer?.render(scene, camera)
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
