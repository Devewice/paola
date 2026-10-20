<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import type { PollsModule } from '@modules/polls/composition.ts'
import { POLLS_ADMIN_COPY, POLLS_LOCALE } from '@modules/polls/constants/copy.ts'
import type { OperatorPoll, PollDayPoint, PollInsights } from '@modules/polls/domain/ports/PollsPort.ts'
import { insightCharts, questionCharts } from '@modules/polls/application/pollCharts.ts'
import PollResults from '@modules/polls/presentation/PollResults.vue'
import AdminModal from '@ui/AdminModal.vue'
import Button from '@ui/Button.vue'
import ChartDeck from '@ui/ChartDeck.vue'
import Chip from '@ui/Chip.vue'
import FilterPills from '@ui/FilterPills.vue'
import Tabs from '@ui/Tabs.vue'
import { showToast } from '@ui/toast.ts'

const props = defineProps<{
  module: PollsModule
  clave: string
  poll: OperatorPoll
}>()

const emit = defineEmits<{ changed: []; edit: [] }>()

const copy = POLLS_ADMIN_COPY
const SERIES_DAYS = 30

const tab = ref('summary')
const tabs = [
  { id: 'summary', label: copy.tabSummary },
  { id: 'results', label: copy.tabResults },
  { id: 'responses', label: copy.tabResponses },
  { id: 'visitors', label: copy.tabVisitors },
]
const insights = ref<PollInsights | null>(null)
const loading = ref(false)
const busy = ref(false)
const pendingDelete = ref<string | null>(null)
const clearOpen = ref(false)
const visitorFilter = ref('all')
const visitorPills = [
  { id: 'all', label: copy.visitorFilterAll },
  { id: 'pending', label: copy.visitorFilterPending },
  { id: 'done', label: copy.visitorFilterDone },
]

const dateTime = new Intl.DateTimeFormat(POLLS_LOCALE, { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })
const dayLabel = new Intl.DateTimeFormat(POLLS_LOCALE, { day: 'numeric', month: 'short' })

function formatDate(iso: string): string {
  const date = new Date(iso)
  return Number.isNaN(date.valueOf()) ? '' : dateTime.format(date)
}

async function load() {
  loading.value = true
  const result = await props.module.insights(props.poll.id, props.clave)
  loading.value = false
  if (!result.ok) {
    showToast(result.error.message || copy.insightsFail, 'bad')
    return
  }
  insights.value = result.value
}

const stats = computed(() => insights.value?.stats ?? { ...props.poll.stats, responses: props.poll.results.responses })
const respondedVisitors = computed(() => (insights.value?.visitors ?? []).filter((visitor) => visitor.responded).length)
const conversion = computed(() => {
  const visitors = insights.value?.visitors.length ?? 0
  return visitors ? `${Math.round((respondedVisitors.value / visitors) * 100)}%` : '—'
})

const kpis = computed(() => [
  { id: 'impressions', label: copy.kpiImpressions, value: String(stats.value.impressions), hint: copy.hintImpressions },
  { id: 'visitors', label: copy.kpiVisitors, value: String(stats.value.visitors), hint: copy.hintVisitors },
  { id: 'visits', label: copy.kpiVisits, value: String(stats.value.visits), hint: copy.hintVisits },
  { id: 'responses', label: copy.kpiResponses, value: String(stats.value.responses), hint: copy.hintResponses },
  { id: 'conversion', label: copy.kpiConversion, value: conversion.value, hint: copy.hintConversion },
])

const funnel = computed(() => {
  const steps = [
    { id: 'impressions', label: copy.kpiImpressions, value: stats.value.impressions },
    { id: 'visitors', label: copy.kpiVisitors, value: stats.value.visitors },
    { id: 'responses', label: copy.kpiResponses, value: stats.value.responses },
  ]
  const top = Math.max(1, ...steps.map((step) => step.value))
  return steps.map((step) => ({ ...step, width: `${Math.max(step.value ? 4 : 0, (step.value / top) * 100)}%` }))
})

function isoDay(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

/** Los 30 días completos, con ceros donde no hubo movimiento. */
const series = computed((): PollDayPoint[] => {
  const byDay = new Map((insights.value?.series ?? []).map((point) => [point.day, point]))
  const today = new Date()
  return Array.from({ length: SERIES_DAYS }, (_, index) => {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (SERIES_DAYS - 1 - index))
    const day = isoDay(date)
    return byDay.get(day) ?? { day, impressions: 0, visits: 0, responses: 0 }
  })
})
const seriesMax = computed(() => Math.max(1, ...series.value.map((point) => Math.max(point.impressions, point.visits, point.responses))))
const seriesEmpty = computed(() => series.value.every((point) => !point.impressions && !point.visits && !point.responses))

function barHeight(value: number): string {
  return `${(value / seriesMax.value) * 100}%`
}

function shortDay(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number)
  return dayLabel.format(new Date(year ?? 0, (month ?? 1) - 1, day ?? 1))
}

function pointLabel(point: PollDayPoint): string {
  return `${shortDay(point.day)} · ${copy.kpiImpressions} ${point.impressions} · ${copy.kpiVisits} ${point.visits} · ${copy.kpiResponses} ${point.responses}`
}

const axisLabels = computed(() => {
  const days = series.value
  return [days[0], days[Math.floor(days.length / 2)], days[days.length - 1]]
    .filter((point): point is PollDayPoint => Boolean(point))
    .map((point) => shortDay(point.day))
})

const charts = computed(() => [
  ...(insights.value ? insightCharts(insights.value, series.value, shortDay) : []),
  ...questionCharts(props.poll.questions, props.poll.results),
])

const visitors = computed(() => {
  const list = insights.value?.visitors ?? []
  if (visitorFilter.value === 'pending') return list.filter((visitor) => !visitor.responded)
  if (visitorFilter.value === 'done') return list.filter((visitor) => visitor.responded)
  return list
})

function visitorName(name: string | undefined, key: string): string {
  return name ?? `${copy.visitorAnon} · ${key.slice(-4).toUpperCase()}`
}

function promptOf(questionId: string): string {
  return props.poll.questions.find((question) => question.id === questionId)?.prompt ?? ''
}

function whatsappHref(phone: string): string {
  return `https://wa.me/${phone.replace(/\D/g, '')}`
}

async function confirmDeleteResponse() {
  const responseId = pendingDelete.value
  if (!responseId) return
  busy.value = true
  const result = await props.module.removeResponse(props.poll.id, responseId, props.clave)
  busy.value = false
  pendingDelete.value = null
  if (!result.ok) {
    showToast(result.error.message || copy.responseDeleteFail, 'bad')
    return
  }
  showToast(copy.responseDeleteOk, 'ok')
  emit('changed')
  await load()
}

async function confirmClear() {
  busy.value = true
  const result = await props.module.clearResponses(props.poll.id, props.clave)
  busy.value = false
  clearOpen.value = false
  if (!result.ok) {
    showToast(result.error.message || copy.responseDeleteFail, 'bad')
    return
  }
  showToast(copy.clearOk, 'ok')
  emit('changed')
  await load()
}

watch(
  () => props.poll.id,
  () => {
    insights.value = null
    tab.value = 'summary'
    void load()
  },
)

onMounted(() => void load())

defineExpose({ reload: load })
</script>

<template>
  <div class="poll-dash">
    <div class="poll-dash__toolbar">
      <Tabs v-model="tab" :tabs="tabs" />
      <div class="poll-dash__toolbar-actions">
        <Button size="sm" variant="ghost" :disabled="loading" @click="load">{{ copy.refreshCta }}</Button>
        <Button size="sm" variant="ghost" @click="emit('edit')">{{ copy.editCta }}</Button>
      </div>
    </div>

    <p v-if="loading && !insights" class="admin-empty">{{ copy.loading }}</p>

    <template v-else-if="tab === 'summary'">
      <dl class="poll-dash__kpis">
        <div v-for="kpi in kpis" :key="kpi.id" class="poll-dash__kpi" :title="kpi.hint">
          <dt>{{ kpi.label }}</dt>
          <dd>{{ kpi.value }}</dd>
          <small>{{ kpi.hint }}</small>
        </div>
      </dl>

      <ChartDeck v-if="charts.length" :key="poll.id" :slides="charts" pickable />

      <section class="poll-dash__panel">
        <h4 class="poll-dash__title">{{ copy.funnelTitle }}</h4>
        <ul class="poll-dash__funnel">
          <li v-for="step in funnel" :key="step.id" class="poll-dash__step" :class="`poll-dash__step--${step.id}`">
            <span class="poll-dash__step-label">{{ step.label }}</span>
            <span class="poll-dash__step-track"><span :style="{ width: step.width }" /></span>
            <strong class="poll-dash__step-value">{{ step.value }}</strong>
          </li>
        </ul>
      </section>

      <section class="poll-dash__panel">
        <header class="poll-dash__panel-head">
          <h4 class="poll-dash__title">{{ copy.seriesTitle }}</h4>
          <ul class="poll-dash__legend">
            <li class="poll-dash__legend-item poll-dash__legend-item--impressions">{{ copy.kpiImpressions }}</li>
            <li class="poll-dash__legend-item poll-dash__legend-item--visits">{{ copy.kpiVisits }}</li>
            <li class="poll-dash__legend-item poll-dash__legend-item--responses">{{ copy.kpiResponses }}</li>
          </ul>
        </header>
        <p v-if="seriesEmpty" class="admin-empty">{{ copy.seriesEmpty }}</p>
        <div v-else class="poll-dash__chart" role="img" :aria-label="copy.seriesAria">
          <div v-for="point in series" :key="point.day" class="poll-dash__day" :title="pointLabel(point)">
            <span class="poll-dash__bar poll-dash__bar--impressions" :style="{ height: barHeight(point.impressions) }" />
            <span class="poll-dash__bar poll-dash__bar--visits" :style="{ height: barHeight(point.visits) }" />
            <span class="poll-dash__bar poll-dash__bar--responses" :style="{ height: barHeight(point.responses) }" />
          </div>
        </div>
        <div v-if="!seriesEmpty" class="poll-dash__axis" aria-hidden="true">
          <span v-for="label in axisLabels" :key="label">{{ label }}</span>
        </div>
        <p class="poll-dash__note">{{ copy.trackingNote }}</p>
      </section>
    </template>

    <PollResults v-else-if="tab === 'results'" :questions="poll.questions" :results="poll.results" show-texts />

    <section v-else-if="tab === 'responses'" class="poll-dash__stack">
      <header class="poll-dash__panel-head">
        <p class="meta-text">
          {{ copy.responsesShown(insights?.responses.length ?? 0, stats.responses) || `${stats.responses} ${copy.kpiResponses.toLowerCase()}` }}
        </p>
        <Button v-if="stats.responses > 0" size="sm" variant="danger" :disabled="busy" @click="clearOpen = true">
          {{ copy.clearCta }}
        </Button>
      </header>
      <p v-if="!insights?.responses.length" class="admin-empty">{{ copy.responsesEmpty }}</p>
      <ul v-else class="poll-dash__responses">
        <li v-for="entry in insights.responses" :key="entry.id" class="poll-dash__response">
          <header class="poll-dash__response-head">
            <div>
              <strong>{{ entry.name ?? copy.anonymous }}</strong>
              <span class="admin-list__meta">{{ formatDate(entry.createdAt) }}</span>
            </div>
            <Button size="sm" variant="ghost" :disabled="busy" @click="pendingDelete = entry.id">{{ copy.responseDelete }}</Button>
          </header>
          <dl class="poll-dash__answers">
            <div v-for="answer in entry.answers" :key="answer.questionId" class="poll-dash__answer">
              <dt>{{ promptOf(answer.questionId) }}</dt>
              <dd>{{ answer.text }}</dd>
            </div>
          </dl>
        </li>
      </ul>
    </section>

    <section v-else class="poll-dash__stack">
      <FilterPills v-model="visitorFilter" :pills="visitorPills" />
      <p v-if="!visitors.length" class="admin-empty">{{ copy.visitorsEmpty }}</p>
      <ul v-else class="poll-dash__visitors">
        <li v-for="visitor in visitors" :key="visitor.key" class="poll-dash__visitor">
          <div class="poll-dash__visitor-main">
            <strong>{{ visitorName(visitor.name, visitor.key) }}</strong>
            <span class="admin-list__meta">
              {{ copy.visitorCounts(visitor.impressions, visitor.visits) }} · {{ copy.visitorLastSeen }}
              {{ formatDate(visitor.lastSeen) }}
            </span>
            <a v-if="visitor.whatsapp" class="admin-link" :href="whatsappHref(visitor.whatsapp)" target="_blank" rel="noopener noreferrer">
              {{ visitor.whatsapp }}
            </a>
          </div>
          <Chip :tone="visitor.responded ? 'abierto' : 'cerrado'">
            {{ visitor.responded ? copy.respondedYes : copy.respondedNo }}
          </Chip>
        </li>
      </ul>
    </section>

    <AdminModal
      :model-value="pendingDelete !== null"
      :title="copy.responseDeleteTitle"
      :copy="copy.responseDeleteCopy"
      tone="danger"
      @update:model-value="pendingDelete = $event ? pendingDelete : null"
    >
      <template #actions>
        <Button variant="ghost" size="sm" @click="pendingDelete = null">{{ copy.cancelCta }}</Button>
        <Button variant="danger" size="sm" :disabled="busy" @click="confirmDeleteResponse">{{ copy.deleteYes }}</Button>
      </template>
    </AdminModal>

    <AdminModal v-model="clearOpen" :title="copy.clearTitle" :copy="copy.clearCopy(stats.responses)" tone="danger">
      <template #actions>
        <Button variant="ghost" size="sm" @click="clearOpen = false">{{ copy.cancelCta }}</Button>
        <Button variant="danger" size="sm" :disabled="busy" @click="confirmClear">{{ copy.deleteYes }}</Button>
      </template>
    </AdminModal>
  </div>
</template>
