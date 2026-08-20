<script setup lang="ts">
import {
  Comment,
  Fragment,
  cloneVNode,
  computed,
  defineComponent,
  nextTick,
  onBeforeUnmount,
  ref,
  useSlots,
  type PropType,
  type VNode,
} from 'vue'
import { prefersReducedMotion } from '@shared/motion/prefersReducedMotion.ts'
import Icon from '@ui/Icon.vue'

const TILT_MAX = 6
const FLIP_MS = 560

const SlotFace = defineComponent({
  name: 'SlotFace',
  props: {
    vnode: { type: Object as PropType<VNode | null>, default: null },
  },
  setup(props) {
    return () => (props.vnode ? cloneVNode(props.vnode) : null)
  },
})

const slots = useSlots()

function flatten(nodes: VNode[] | undefined): VNode[] {
  if (!nodes) return []
  const out: VNode[] = []
  for (const node of nodes) {
    if (node.type === Comment) continue
    if (node.type === Fragment && Array.isArray(node.children)) {
      out.push(...flatten(node.children as VNode[]))
      continue
    }
    if (typeof node.type === 'object' || typeof node.type === 'string') out.push(node)
  }
  return out
}

const faces = computed(() => flatten(slots.default?.()))
const count = computed(() => faces.value.length)
const front = ref(0)
const back = ref(1)
const flipped = ref(false)
const reverse = ref(false)
const snapping = ref(false)
const busy = ref(false)
const panelTilting = ref(false)
const panelRotate = ref({ x: 0, y: 0 })
const panelShine = ref({ x: 50, y: 50 })

const panelTiltStyle = computed(() => ({
  transform: `rotateX(${panelRotate.value.x}deg) rotateY(${panelRotate.value.y}deg)`,
  '--tilt-mx': `${panelShine.value.x}%`,
  '--tilt-my': `${panelShine.value.y}%`,
}))

const flipClass = computed(() => ({
  'is-flipped': flipped.value,
  'is-reverse': reverse.value,
  'is-snapping': snapping.value,
}))

function reduced(): boolean {
  return prefersReducedMotion()
}

function onPanelMove(event: PointerEvent): void {
  if (busy.value || event.pointerType === 'touch' || reduced()) return
  const el = event.currentTarget
  if (!(el instanceof HTMLElement)) return
  const box = el.getBoundingClientRect()
  if (box.width < 1 || box.height < 1) return
  const px = (event.clientX - box.left) / box.width
  const py = (event.clientY - box.top) / box.height
  panelTilting.value = true
  panelRotate.value = { x: -((py * 2 - 1) * TILT_MAX), y: (px * 2 - 1) * TILT_MAX }
  panelShine.value = { x: px * 100, y: py * 100 }
}

function resetTilt(): void {
  panelTilting.value = false
  panelRotate.value = { x: 0, y: 0 }
  panelShine.value = { x: 50, y: 50 }
}

function wrap(index: number): number {
  const total = count.value
  if (total < 1) return 0
  return (index + total) % total
}

let flipTimer = 0

function clearFlipTimer(): void {
  window.clearTimeout(flipTimer)
}

async function finishFlip(): Promise<void> {
  if (!flipped.value) return
  clearFlipTimer()
  front.value = back.value
  snapping.value = true
  flipped.value = false
  await nextTick()
  requestAnimationFrame(() => {
    snapping.value = false
    busy.value = false
  })
}

function onFlipTransitionEnd(event: TransitionEvent): void {
  if (event.target !== event.currentTarget) return
  if (event.propertyName !== 'transform') return
  void finishFlip()
}

async function go(step: number): Promise<void> {
  if (busy.value || count.value < 2) return
  const next = wrap(front.value + step)
  if (reduced()) {
    front.value = next
    back.value = wrap(next + 1)
    return
  }
  busy.value = true
  resetTilt()
  reverse.value = step < 0
  back.value = next
  await nextTick()
  flipped.value = true
  clearFlipTimer()
  flipTimer = window.setTimeout(() => {
    void finishFlip()
  }, FLIP_MS + 80)
}

function onKey(event: KeyboardEvent): void {
  if (event.key === 'ArrowRight') {
    event.preventDefault()
    void go(1)
  } else if (event.key === 'ArrowLeft') {
    event.preventDefault()
    void go(-1)
  }
}

onBeforeUnmount(() => {
  clearFlipTimer()
})
</script>

<template>
  <div
    class="kit-hero-deck"
    :class="{ 'is-busy': busy }"
    :style="{ '--flip-ms': `${FLIP_MS}ms` }"
    tabindex="0"
    role="group"
    aria-roledescription="carrusel"
    :aria-label="`Corte del día, ${front + 1} de ${count}`"
    @keydown="onKey"
  >
    <button
      v-if="count > 1"
      type="button"
      class="kit-hero-deck__nav kit-hero-deck__nav--prev"
      aria-label="Anterior"
      :disabled="busy"
      @click="go(-1)"
    >
      <Icon name="arrow" size="sm" tone="white" :circle="false" class="kit-hero-deck__chev kit-hero-deck__chev--prev" />
    </button>

    <div class="kit-hero-deck__scene">
      <div class="kit-hero-deck__flip" :class="flipClass" @transitionend="onFlipTransitionEnd">
        <div class="kit-hero-deck__face kit-hero-deck__face--front">
          <aside
            class="kit-hero__panel"
            :class="{ 'is-tilting': panelTilting && !busy }"
            :style="panelTiltStyle"
            @pointermove="onPanelMove"
            @pointerleave="resetTilt"
          >
            <SlotFace :key="`f-${front}`" :vnode="faces[front] ?? null" />
          </aside>
        </div>
        <div class="kit-hero-deck__face kit-hero-deck__face--back" aria-hidden="true">
          <aside class="kit-hero__panel">
            <SlotFace :key="`b-${back}`" :vnode="faces[back] ?? null" />
          </aside>
        </div>
      </div>
    </div>

    <button
      v-if="count > 1"
      type="button"
      class="kit-hero-deck__nav kit-hero-deck__nav--next"
      aria-label="Siguiente"
      :disabled="busy"
      @click="go(1)"
    >
      <Icon name="arrow" size="sm" tone="white" :circle="false" class="kit-hero-deck__chev" />
    </button>

    <div v-if="count > 1" class="kit-hero-deck__dots" aria-hidden="true">
      <span
        v-for="(_, index) in faces"
        :key="index"
        class="kit-hero-deck__dot"
        :class="{ 'is-on': index === front }"
      />
    </div>
  </div>
</template>
