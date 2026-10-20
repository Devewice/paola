<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { GALLERY_COPY, VIEWER_LIMITS } from './galleryCopy.ts'

type Photo = { readonly src: string; readonly alt: string }

const props = defineProps<{
  photos: readonly Photo[]
  /** Foto abierta; `null` cierra el visor. */
  modelValue: number | null
}>()

const emit = defineEmits<{ 'update:modelValue': [value: number | null] }>()

const copy = GALLERY_COPY
const stage = ref<HTMLElement | null>(null)
const image = ref<HTMLImageElement | null>(null)
const closeBtn = ref<HTMLButtonElement | null>(null)

const scale = ref(1)
const tx = ref(0)
const ty = ref(0)
/** Con transición (doble toque, restablecer); sin ella mientras el dedo arrastra. */
const easing = ref(false)

const open = computed(() => props.modelValue !== null && props.photos.length > 0)
const index = computed(() => Math.min(Math.max(props.modelValue ?? 0, 0), Math.max(props.photos.length - 1, 0)))
const photo = computed(() => props.photos[index.value])
const many = computed(() => props.photos.length > 1)
const zoomed = computed(() => scale.value > 1.01)

const transform = computed(() => `translate3d(${tx.value}px, ${ty.value}px, 0) scale(${scale.value})`)

function reset(animate = true) {
  easing.value = animate
  scale.value = 1
  tx.value = 0
  ty.value = 0
}

function close() {
  emit('update:modelValue', null)
}

function go(step: number) {
  const total = props.photos.length
  if (total < 2) return
  reset(false)
  emit('update:modelValue', (index.value + step + total) % total)
}

/** Tamaño real de la foto en pantalla a escala 1 (la caja es todo el visor; la foto va contenida). */
function fitted(): { width: number; height: number } {
  const box = stage.value?.getBoundingClientRect()
  const img = image.value
  if (!box || !img?.naturalWidth || !img.naturalHeight) return { width: box?.width ?? 0, height: box?.height ?? 0 }
  const ratio = Math.min(box.width / img.naturalWidth, box.height / img.naturalHeight)
  return { width: img.naturalWidth * ratio, height: img.naturalHeight * ratio }
}

function clampPan() {
  const box = stage.value?.getBoundingClientRect()
  if (!box) return
  const size = fitted()
  const maxX = Math.max(0, (size.width * scale.value - box.width) / 2)
  const maxY = Math.max(0, (size.height * scale.value - box.height) / 2)
  tx.value = Math.min(maxX, Math.max(-maxX, tx.value))
  ty.value = Math.min(maxY, Math.max(-maxY, ty.value))
}

/** Punto de pantalla relativo al centro del visor. */
function local(x: number, y: number): { x: number; y: number } {
  const box = stage.value?.getBoundingClientRect()
  if (!box) return { x: 0, y: 0 }
  return { x: x - box.left - box.width / 2, y: y - box.top - box.height / 2 }
}

/** Cambia la escala dejando quieto el punto `at` (el que está bajo los dedos o el cursor). */
function zoomAt(next: number, at: { x: number; y: number }) {
  const target = Math.min(VIEWER_LIMITS.MAX_SCALE, Math.max(1, next))
  const factor = target / scale.value
  tx.value = at.x - (at.x - tx.value) * factor
  ty.value = at.y - (at.y - ty.value) * factor
  scale.value = target
  if (target === 1) {
    tx.value = 0
    ty.value = 0
  }
  clampPan()
}

const pointers = new Map<number, { x: number; y: number }>()
let pinch: { distance: number; scale: number; mid: { x: number; y: number }; tx: number; ty: number } | null = null
let drag: { x: number; y: number; tx: number; ty: number; moved: boolean } | null = null
let lastTap = { time: 0, x: 0, y: 0 }

function distance(a: { x: number; y: number }, b: { x: number; y: number }): number {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

function startPinch() {
  const [a, b] = [...pointers.values()]
  if (!a || !b) return
  pinch = {
    distance: distance(a, b) || 1,
    scale: scale.value,
    mid: local((a.x + b.x) / 2, (a.y + b.y) / 2),
    tx: tx.value,
    ty: ty.value,
  }
  drag = null
}

function onPointerDown(event: PointerEvent) {
  if ((event.target as HTMLElement).closest('button')) return
  try {
    stage.value?.setPointerCapture(event.pointerId)
  } catch {
    /* Sin captura el gesto sigue funcionando dentro del visor. */
  }
  pointers.set(event.pointerId, { x: event.clientX, y: event.clientY })
  easing.value = false
  if (pointers.size === 2) {
    startPinch()
    return
  }
  drag = { x: event.clientX, y: event.clientY, tx: tx.value, ty: ty.value, moved: false }
}

function onPointerMove(event: PointerEvent) {
  if (!pointers.has(event.pointerId)) return
  pointers.set(event.pointerId, { x: event.clientX, y: event.clientY })

  if (pinch && pointers.size >= 2) {
    const [a, b] = [...pointers.values()]
    if (!a || !b) return
    const mid = local((a.x + b.x) / 2, (a.y + b.y) / 2)
    const next = Math.min(VIEWER_LIMITS.MAX_SCALE, Math.max(1, (pinch.scale * distance(a, b)) / pinch.distance))
    const factor = next / pinch.scale
    tx.value = mid.x - (pinch.mid.x - pinch.tx) * factor
    ty.value = mid.y - (pinch.mid.y - pinch.ty) * factor
    scale.value = next
    clampPan()
    return
  }

  if (!drag) return
  const dx = event.clientX - drag.x
  const dy = event.clientY - drag.y
  if (Math.hypot(dx, dy) > VIEWER_LIMITS.TAP_SLOP_PX) drag.moved = true
  if (zoomed.value) {
    tx.value = drag.tx + dx
    ty.value = drag.ty + dy
    clampPan()
  } else if (Math.abs(dx) >= Math.abs(dy)) {
    tx.value = many.value ? dx : dx * 0.3
    ty.value = 0
  } else {
    ty.value = Math.max(0, dy)
    tx.value = 0
  }
}

function onPointerUp(event: PointerEvent) {
  if (!pointers.has(event.pointerId)) return
  pointers.delete(event.pointerId)

  if (pinch) {
    if (pointers.size < 2) pinch = null
    if (pointers.size === 1) {
      const [rest] = [...pointers.values()]
      if (rest) drag = { x: rest.x, y: rest.y, tx: tx.value, ty: ty.value, moved: true }
    }
    if (!zoomed.value) reset()
    return
  }

  const current = drag
  drag = null
  if (!current) return
  const dx = event.clientX - current.x
  const dy = event.clientY - current.y

  if (!current.moved) {
    handleTap(event)
    return
  }
  if (zoomed.value) return
  if (Math.abs(dx) >= Math.abs(dy) && Math.abs(dx) > VIEWER_LIMITS.SWIPE_PX && many.value) {
    go(dx < 0 ? 1 : -1)
    return
  }
  if (dy > VIEWER_LIMITS.CLOSE_SWIPE_PX) {
    close()
    return
  }
  reset()
}

function onPointerCancel(event: PointerEvent) {
  pointers.delete(event.pointerId)
  pinch = null
  drag = null
  if (!zoomed.value) reset()
}

/** Doble toque: acerca donde tocaste; si ya estaba acercada, restablece. */
function handleTap(event: PointerEvent) {
  const now = event.timeStamp
  const near = Math.hypot(event.clientX - lastTap.x, event.clientY - lastTap.y) < VIEWER_LIMITS.DOUBLE_TAP_PX
  if (now - lastTap.time < VIEWER_LIMITS.DOUBLE_TAP_MS && near) {
    lastTap = { time: 0, x: 0, y: 0 }
    easing.value = true
    if (zoomed.value) reset()
    else zoomAt(VIEWER_LIMITS.DOUBLE_TAP_SCALE, local(event.clientX, event.clientY))
    return
  }
  lastTap = { time: now, x: event.clientX, y: event.clientY }
}

function onWheel(event: WheelEvent) {
  easing.value = false
  const factor = Math.exp(-event.deltaY * VIEWER_LIMITS.WHEEL_SPEED)
  zoomAt(scale.value * factor, local(event.clientX, event.clientY))
}

function onKey(event: KeyboardEvent) {
  if (!open.value) return
  if (event.key === 'Escape') close()
  else if (event.key === 'ArrowRight') go(1)
  else if (event.key === 'ArrowLeft') go(-1)
  else if (event.key === '+' || event.key === '=') {
    easing.value = true
    zoomAt(scale.value * 1.5, { x: 0, y: 0 })
  } else if (event.key === '-') {
    easing.value = true
    zoomAt(scale.value / 1.5, { x: 0, y: 0 })
  } else if (event.key === '0') reset()
}

let previousOverflow = ''
let returnFocus: HTMLElement | null = null

watch(
  open,
  (isOpen) => {
    if (typeof document === 'undefined') return
    if (isOpen) {
      returnFocus = document.activeElement as HTMLElement | null
      previousOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', onKey)
      reset(false)
      void nextTick(() => closeBtn.value?.focus())
    } else {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKey)
      pointers.clear()
      returnFocus?.focus?.()
    }
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  if (typeof document === 'undefined') return
  if (open.value) document.body.style.overflow = previousOverflow
  window.removeEventListener('keydown', onKey)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="photo-viewer">
      <div v-if="open && photo" class="photo-viewer" role="dialog" aria-modal="true" :aria-label="copy.viewer">
        <header class="photo-viewer__bar">
          <span v-if="many" class="photo-viewer__count">{{ index + 1 }} / {{ photos.length }}</span>
          <button ref="closeBtn" type="button" class="photo-viewer__close" :aria-label="copy.close" @click="close">
            {{ copy.closeGlyph }}
          </button>
        </header>

        <div
          ref="stage"
          class="photo-viewer__stage"
          :class="{ 'is-zoomed': zoomed }"
          @pointerdown="onPointerDown"
          @pointermove="onPointerMove"
          @pointerup="onPointerUp"
          @pointercancel="onPointerCancel"
          @wheel.prevent="onWheel"
        >
          <img
            ref="image"
            :key="photo.src"
            class="photo-viewer__img"
            :class="{ 'is-easing': easing }"
            :src="photo.src"
            :alt="photo.alt"
            :style="{ transform }"
            draggable="false"
            @transitionend="easing = false"
          />
        </div>

        <template v-if="many">
          <button type="button" class="photo-viewer__arrow photo-viewer__arrow--prev" :aria-label="copy.prev" @click="go(-1)">
            {{ copy.prevGlyph }}
          </button>
          <button type="button" class="photo-viewer__arrow photo-viewer__arrow--next" :aria-label="copy.next" @click="go(1)">
            {{ copy.nextGlyph }}
          </button>
        </template>

        <footer class="photo-viewer__foot">
          <p v-if="photo.alt" class="photo-viewer__caption">{{ photo.alt }}</p>
          <p class="photo-viewer__hint">{{ zoomed ? copy.hintZoomed : copy.hint }}</p>
        </footer>
      </div>
    </Transition>
  </Teleport>
</template>
