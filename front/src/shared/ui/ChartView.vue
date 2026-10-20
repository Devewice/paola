<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { CHART_COPY, CHART_LIMITS, CHART_PALETTE, type ChartSeries, type ChartType } from './chartCopy.ts'

const props = defineProps<{
  type: ChartType
  labels: readonly string[]
  series: readonly ChartSeries[]
  compact?: boolean
}>()

const copy = CHART_COPY
const grown = ref(false)

onMounted(() => {
  requestAnimationFrame(() => {
    grown.value = true
  })
})

const multi = computed(() => props.series.length > 1)
const allValues = computed(() => props.series.flatMap((serie) => serie.values))
const max = computed(() => Math.max(1, ...allValues.value))
const empty = computed(() => allValues.value.every((value) => !value))

function color(index: number): string {
  return CHART_PALETTE[index % CHART_PALETTE.length] ?? CHART_PALETTE[0]
}

/** Una serie corta: color por categoría (igual que en la dona). Larga o varias: color por serie. */
function barColor(labelIndex: number, serieIndex: number): string {
  if (multi.value || props.labels.length > CHART_PALETTE.length) return color(serieIndex)
  return color(labelIndex)
}

function share(value: number): number {
  return grown.value ? (value / max.value) * 100 : 0
}

function valueOf(serie: ChartSeries, index: number): number {
  return serie.values[index] ?? 0
}

const step = computed(() => Math.ceil(props.labels.length / 6))
function showAxisLabel(index: number): boolean {
  if (props.labels.length <= CHART_LIMITS.AXIS_LABELS_MAX) return true
  return index % step.value === 0 || index === props.labels.length - 1
}

function tooltip(index: number): string {
  const values = props.series.map((serie) => (multi.value ? `${serie.label}: ${valueOf(serie, index)}` : String(valueOf(serie, index))))
  return `${props.labels[index] ?? ''} · ${values.join(' · ')}`
}

const ariaLabel = computed(() => props.labels.map((_, index) => tooltip(index)).join('; '))

const slices = computed(() => {
  const serie = props.series[0]
  if (!serie) return []
  const total = serie.values.reduce((sum, value) => sum + value, 0) || 1
  let offset = 0
  return props.labels.map((label, index) => {
    const value = valueOf(serie, index)
    const percent = (value / total) * 100
    const slice = { label, value, percent, offset, color: color(index) }
    offset += percent
    return slice
  })
})
const sliceTotal = computed(() => slices.value.reduce((sum, slice) => sum + slice.value, 0))

const LINE_W = 100
const LINE_H = 50
const LINE_TOP = 4

function pointX(index: number): number {
  const count = props.labels.length
  return count > 1 ? (index / (count - 1)) * LINE_W : LINE_W / 2
}

function pointY(value: number): number {
  return LINE_H - (value / max.value) * (LINE_H - LINE_TOP)
}

const lines = computed(() =>
  props.series.map((serie, serieIndex) => {
    const points = props.labels.map((_, index) => `${pointX(index)},${pointY(valueOf(serie, index))}`)
    return {
      id: serie.id,
      color: color(serieIndex),
      points: points.join(' '),
      area: `M0,${LINE_H} L${points.join(' L')} L${LINE_W},${LINE_H} Z`,
      dots: props.labels.map((_, index) => ({
        index,
        left: `${pointX(index)}%`,
        top: `${(pointY(valueOf(serie, index)) / LINE_H) * 100}%`,
      })),
    }
  }),
)
</script>

<template>
  <div class="chart-view" :class="[`chart-view--${type}`, { 'chart-view--compact': compact, 'is-grown': grown }]">
    <p v-if="empty" class="chart-view__empty">{{ copy.empty }}</p>

    <template v-else>
      <ul v-if="multi && type !== 'donut' && type !== 'pie'" class="chart-view__legend chart-view__legend--series">
        <li v-for="(serie, index) in series" :key="serie.id">
          <span class="chart-view__swatch" :style="{ background: color(index) }" aria-hidden="true" />
          {{ serie.label }}
        </li>
      </ul>

      <div v-if="type === 'bars'" class="chart-view__cols" role="img" :aria-label="ariaLabel" :style="{ '--chart-cols': labels.length }">
        <div v-for="(label, index) in labels" :key="index" class="chart-view__col" :title="tooltip(index)">
          <div class="chart-view__col-stack">
            <span
              v-for="(serie, serieIndex) in series"
              :key="serie.id"
              class="chart-view__col-bar"
              :style="{ height: `${share(valueOf(serie, index))}%`, background: barColor(index, serieIndex) }"
            >
              <em v-if="!multi && labels.length <= CHART_LIMITS.AXIS_LABELS_MAX" class="chart-view__col-value">
                {{ valueOf(serie, index) }}
              </em>
            </span>
          </div>
          <span class="chart-view__col-label">{{ showAxisLabel(index) ? label : '' }}</span>
        </div>
      </div>

      <ul v-else-if="type === 'hbars'" class="chart-view__rows" role="img" :aria-label="ariaLabel">
        <li v-for="(label, index) in labels" :key="index" class="chart-view__row" :title="tooltip(index)">
          <span class="chart-view__row-label">{{ label }}</span>
          <span class="chart-view__row-tracks">
            <span v-for="(serie, serieIndex) in series" :key="serie.id" class="chart-view__row-track">
              <span :style="{ width: `${share(valueOf(serie, index))}%`, background: barColor(index, serieIndex) }" />
            </span>
          </span>
          <strong class="chart-view__row-value">{{ series.map((serie) => valueOf(serie, index)).join(' · ') }}</strong>
        </li>
      </ul>

      <div v-else-if="type === 'line'" class="chart-view__line" role="img" :aria-label="ariaLabel">
        <div class="chart-view__plot">
          <svg :viewBox="`0 0 ${LINE_W} ${LINE_H}`" preserveAspectRatio="none" aria-hidden="true">
            <line v-for="tick in 4" :key="tick" x1="0" :x2="LINE_W" :y1="(LINE_H / 4) * tick" :y2="(LINE_H / 4) * tick" class="chart-view__grid" />
            <g v-for="line in lines" :key="line.id">
              <path :d="line.area" :fill="line.color" class="chart-view__area" />
              <polyline :points="line.points" :stroke="line.color" class="chart-view__stroke" />
            </g>
          </svg>
          <template v-for="line in lines" :key="`dots-${line.id}`">
            <span
              v-for="dot in line.dots"
              :key="dot.index"
              class="chart-view__dot"
              :style="{ left: dot.left, top: dot.top, background: line.color }"
              :title="tooltip(dot.index)"
            />
          </template>
          <span class="chart-view__max">{{ max }}</span>
        </div>
        <div class="chart-view__axis">
          <span v-for="(label, index) in labels" :key="index" :style="{ left: `${pointX(index)}%` }">
            {{ showAxisLabel(index) ? label : '' }}
          </span>
        </div>
      </div>

      <div v-else class="chart-view__round">
        <div class="chart-view__ring" role="img" :aria-label="ariaLabel">
          <svg viewBox="0 0 42 42" aria-hidden="true">
            <g transform="rotate(-90 21 21)">
              <circle class="chart-view__ring-bg" cx="21" cy="21" :r="type === 'donut' ? 16 : 10" :stroke-width="type === 'donut' ? 7 : 20" />
              <circle
                v-for="slice in slices"
                v-show="slice.value > 0"
                :key="slice.label"
                class="chart-view__slice"
                cx="21"
                cy="21"
                :r="type === 'donut' ? 16 : 10"
                :stroke-width="type === 'donut' ? 7 : 20"
                pathLength="100"
                :stroke="slice.color"
                :stroke-dasharray="`${grown ? slice.percent : 0} 100`"
                :stroke-dashoffset="-slice.offset"
              >
                <title>{{ slice.label }} · {{ slice.value }}</title>
              </circle>
            </g>
          </svg>
          <p v-if="type === 'donut'" class="chart-view__ring-total">
            <strong>{{ sliceTotal }}</strong>
            <span>{{ copy.total }}</span>
          </p>
        </div>
        <ul class="chart-view__legend">
          <li v-for="slice in slices" :key="slice.label" :class="{ 'is-zero': !slice.value }">
            <span class="chart-view__swatch" :style="{ background: slice.color }" aria-hidden="true" />
            <span class="chart-view__legend-label">{{ slice.label }}</span>
            <strong>{{ slice.value }}</strong>
            <em>{{ Math.round(slice.percent) }}%</em>
          </li>
        </ul>
      </div>
    </template>
  </div>
</template>
