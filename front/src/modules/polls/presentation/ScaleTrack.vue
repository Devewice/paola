<script setup lang="ts">
import { computed, ref } from 'vue'
import type { PollTone } from '@modules/polls/domain/entities/Poll.ts'
import ScaleFace from '@modules/polls/presentation/ScaleFace.vue'

type Stop = { readonly id: string; readonly label: string }

const props = defineProps<{
  stops: readonly Stop[]
  modelValue: string | null
  tone?: PollTone
  label?: string
}>()

const emit = defineEmits<{ 'update:modelValue': [id: string]; committed: [id: string] }>()

const track = ref<HTMLElement | null>(null)
const dragging = ref(false)
const selected = computed(() => props.stops.findIndex((stop) => stop.id === props.modelValue))
const fill = computed(() => {
  if (selected.value < 0 || props.stops.length < 2) return 0
  return (selected.value / (props.stops.length - 1)) * 100
})
const faces = computed(() => props.tone === 'faces')

function moodOf(index: number): number {
  return props.stops.length > 1 ? index / (props.stops.length - 1) : 0.5
}

function stopAt(clientX: number): Stop | undefined {
  const rect = track.value?.getBoundingClientRect()
  if (!rect || !props.stops.length) return undefined
  const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
  return props.stops[Math.round(ratio * (props.stops.length - 1))]
}

function choose(stop: Stop | undefined, commit: boolean) {
  if (!stop) return
  if (stop.id !== props.modelValue) emit('update:modelValue', stop.id)
  if (commit) emit('committed', stop.id)
}

function onPointerDown(event: PointerEvent) {
  dragging.value = true
  ;(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
  choose(stopAt(event.clientX), false)
}

function onPointerMove(event: PointerEvent) {
  if (dragging.value) choose(stopAt(event.clientX), false)
}

function onPointerUp(event: PointerEvent) {
  if (!dragging.value) return
  dragging.value = false
  choose(stopAt(event.clientX), true)
}

function onKey(event: KeyboardEvent) {
  const delta = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0
  if (!delta) return
  event.preventDefault()
  event.stopPropagation()
  const from = selected.value < 0 ? (delta > 0 ? -1 : props.stops.length) : selected.value
  choose(props.stops[Math.min(props.stops.length - 1, Math.max(0, from + delta))], false)
}
</script>

<template>
  <div class="scale-track" :class="[`scale-track--${tone ?? 'plain'}`, { 'is-dragging': dragging }]">
    <div v-if="faces" class="scale-track__faces" :style="{ '--stops': stops.length }" aria-hidden="true">
      <button
        v-for="(stop, index) in stops"
        :key="stop.id"
        type="button"
        tabindex="-1"
        class="scale-track__face"
        @click="choose(stop, true)"
      >
        <ScaleFace :mood="moodOf(index)" :active="index === selected" />
      </button>
    </div>

    <div
      ref="track"
      class="scale-track__rail"
      role="radiogroup"
      :aria-label="label"
      tabindex="0"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="dragging = false"
      @keydown="onKey"
    >
      <span class="scale-track__fill" :style="{ width: `${fill}%` }" />
      <span
        v-for="(stop, index) in stops"
        :key="stop.id"
        class="scale-track__stop"
        :class="{ 'is-on': selected >= 0 && index <= selected, 'is-picked': index === selected }"
        :style="{ left: `${stops.length > 1 ? (index / (stops.length - 1)) * 100 : 50}%` }"
        role="radio"
        :aria-checked="index === selected"
        :aria-label="stop.label"
      />
    </div>

    <div class="scale-track__labels" :style="{ '--stops': stops.length }">
      <button
        v-for="(stop, index) in stops"
        :key="stop.id"
        type="button"
        tabindex="-1"
        class="scale-track__label"
        :class="{ 'is-picked': index === selected }"
        @click="choose(stop, true)"
      >
        <span class="scale-track__key" aria-hidden="true">{{ index + 1 }}</span>
        {{ stop.label }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.scale-track {
  display: grid;
  gap: 12px;
  user-select: none;
}
.scale-track__faces,
.scale-track__labels {
  display: grid;
  grid-template-columns: repeat(var(--stops), minmax(0, 1fr));
  gap: 4px;
}
.scale-track__face {
  display: grid;
  place-items: center;
  padding: 4px 0;
  border: 0;
  background: none;
  cursor: pointer;
}
.scale-track__rail {
  position: relative;
  height: 10px;
  margin: 12px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
  cursor: pointer;
  touch-action: none;
}
.scale-track__rail:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(72, 180, 252, 0.35);
}
.scale-track__fill {
  position: absolute;
  inset: 0 auto 0 0;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--navy, #001028), var(--blue, #0088f8) 60%, var(--cyan, #48b4fc));
  transition: width 200ms ease;
}
.scale-track.is-dragging .scale-track__fill {
  transition: none;
}
.scale-track__stop {
  position: absolute;
  top: 50%;
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-radius: 50%;
  background: var(--bg, #05070c);
  transform: translate(-50%, -50%);
  transition: transform 180ms ease, border-color 180ms ease, background 180ms ease, box-shadow 180ms ease;
}
.scale-track__stop.is-on {
  border-color: var(--blue, #0088f8);
  background: var(--blue, #0088f8);
}
.scale-track__stop.is-picked {
  border-color: var(--cyan, #48b4fc);
  background: var(--cyan, #48b4fc);
  transform: translate(-50%, -50%) scale(1.5);
  box-shadow: 0 0 16px rgba(72, 180, 252, 0.6);
}
.scale-track__label {
  display: grid;
  justify-items: center;
  gap: 4px;
  padding: 4px 2px;
  border: 0;
  border-radius: 8px;
  background: none;
  color: var(--muted, rgba(234, 242, 255, 0.7));
  font: 500 12px/1.25 var(--ui, Montserrat, sans-serif);
  text-align: center;
  cursor: pointer;
  transition: color 160ms ease;
}
.scale-track__label:hover,
.scale-track__label.is-picked {
  color: var(--white, #eaf2ff);
}
.scale-track__label.is-picked {
  font-weight: 700;
}
.scale-track__key {
  display: none;
  font-size: 10px;
  opacity: 0.6;
}
@media (hover: hover) {
  .scale-track__key {
    display: block;
  }
}
</style>
