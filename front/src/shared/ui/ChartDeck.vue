<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import ChartView from './ChartView.vue'
import Segmented from './Segmented.vue'
import { CHART_COPY, CHART_LIMITS, type ChartSlide, type ChartType } from './chartCopy.ts'

const props = defineProps<{
  slides: readonly ChartSlide[]
  /** Deja escoger el tipo de gráfica de cada pantalla. */
  pickable?: boolean
  compact?: boolean
}>()

const copy = CHART_COPY
const index = ref(0)
const direction = ref<'next' | 'prev'>('next')
const chosen = ref<Record<string, ChartType>>({})

watch(
  () => props.slides.length,
  (length) => {
    if (index.value >= length) index.value = Math.max(0, length - 1)
  },
)

const slide = computed(() => props.slides[index.value])
const type = computed((): ChartType => {
  const current = slide.value
  if (!current) return 'bars'
  const picked = chosen.value[current.id]
  return picked && current.types.includes(picked) ? picked : (current.types[0] ?? 'bars')
})
const typeOptions = computed(() => (slide.value?.types ?? []).map((value) => ({ value, label: copy.types[value] })))
const showDots = computed(() => props.slides.length > 1 && props.slides.length <= CHART_LIMITS.DOTS_MAX)

function go(target: number) {
  const count = props.slides.length
  if (count < 2) return
  direction.value = target > index.value ? 'next' : 'prev'
  index.value = (target + count) % count
}

function pick(value: string) {
  const current = slide.value
  if (current) chosen.value = { ...chosen.value, [current.id]: value as ChartType }
}

let swipeStart: number | null = null

function onPointerDown(event: PointerEvent) {
  swipeStart = event.clientX
}

function onPointerUp(event: PointerEvent) {
  if (swipeStart === null) return
  const delta = event.clientX - swipeStart
  swipeStart = null
  if (Math.abs(delta) < CHART_LIMITS.SWIPE_PX) return
  go(delta < 0 ? index.value + 1 : index.value - 1)
}
</script>

<template>
  <section
    v-if="slide"
    class="chart-deck"
    :class="{ 'chart-deck--compact': compact }"
    tabindex="0"
    @keydown.left.prevent="go(index - 1)"
    @keydown.right.prevent="go(index + 1)"
  >
    <header class="chart-deck__head">
      <div class="chart-deck__heading">
        <p class="chart-deck__kicker">
          <span v-if="slides.length > 1">{{ index + 1 }} {{ copy.of }} {{ slides.length }}</span>
          <span v-if="slide.kicker">{{ slide.kicker }}</span>
        </p>
        <h4 class="chart-deck__title">{{ slide.title }}</h4>
        <p v-if="slide.caption" class="chart-deck__caption">{{ slide.caption }}</p>
      </div>
      <div v-if="slides.length > 1" class="chart-deck__nav">
        <button type="button" class="chart-deck__arrow" :aria-label="copy.prev" @click="go(index - 1)">{{ copy.prevGlyph }}</button>
        <button type="button" class="chart-deck__arrow" :aria-label="copy.next" @click="go(index + 1)">{{ copy.nextGlyph }}</button>
      </div>
    </header>

    <div v-if="pickable && typeOptions.length > 1" class="chart-deck__types" :aria-label="copy.typePicker">
      <Segmented :model-value="type" :options="typeOptions" @update:model-value="pick" />
    </div>

    <div class="chart-deck__stage" @pointerdown="onPointerDown" @pointerup="onPointerUp" @pointercancel="swipeStart = null">
      <Transition :name="`chart-deck-${direction}`" mode="out-in">
        <ChartView :key="`${slide.id}:${type}`" :type="type" :labels="slide.labels" :series="slide.series" :compact="compact" />
      </Transition>
    </div>

    <nav v-if="showDots" class="chart-deck__dots">
      <button
        v-for="(item, dot) in slides"
        :key="item.id"
        type="button"
        class="chart-deck__dot"
        :class="{ 'is-on': dot === index }"
        :aria-label="`${copy.goTo} ${dot + 1}: ${item.title}`"
        :aria-current="dot === index ? 'true' : undefined"
        @click="go(dot)"
      />
    </nav>
  </section>
</template>
