import { POLLS_ADMIN_COPY, POLLS_CHART_COPY } from '@modules/polls/constants/copy.ts'
import { questionNumber, type PollQuestion, type PollResults, type QuestionResult } from '@modules/polls/domain/entities/Poll.ts'
import type { PollDayPoint, PollInsights } from '@modules/polls/domain/ports/PollsPort.ts'

export type PollChartType = 'bars' | 'hbars' | 'donut' | 'pie' | 'line'

/** Una gráfica lista para pintar; el primer tipo de `types` es el que arranca. */
export type PollChart = {
  readonly id: string
  readonly title: string
  readonly kicker?: string
  readonly caption?: string
  readonly labels: readonly string[]
  readonly series: readonly { readonly id: string; readonly label: string; readonly values: readonly number[] }[]
  readonly types: readonly PollChartType[]
}

/** Con más opciones que esto, la dona se vuelve ilegible y arranca en barras horizontales. */
const ROUND_OPTIONS_MAX = 6
const ACCOUNT_KEY_PREFIX = 'u:'
const WEEK_DAYS = 7
const DAY_HOURS = 24

const copy = POLLS_CHART_COPY

function single(id: string, label: string, values: readonly number[]) {
  return [{ id, label, values }]
}

function choiceChart(question: PollQuestion, result: QuestionResult, kicker: string): PollChart {
  const labels = question.options.map((option) => option.label)
  const values = question.options.map((option) => result.options.find((item) => item.optionId === option.id)?.count ?? 0)
  const round = question.kind === 'single' && question.options.length <= ROUND_OPTIONS_MAX
  return {
    id: question.id,
    title: question.prompt,
    kicker,
    caption: copy.answered(result.answered),
    labels,
    series: single('votes', copy.votes, values),
    types: round ? ['donut', 'hbars', 'bars', 'pie'] : ['hbars', 'bars', 'donut', 'pie'],
  }
}

function rankingChart(question: PollQuestion, result: QuestionResult, kicker: string): PollChart {
  const labelOf = (optionId: string) => question.options.find((option) => option.id === optionId)?.label ?? ''
  return {
    id: question.id,
    title: question.prompt,
    kicker,
    caption: copy.rankCaption(result.answered),
    labels: result.options.map((option) => labelOf(option.optionId)),
    series: single('first', copy.firstPlace, result.options.map((option) => option.count)),
    types: ['hbars', 'bars', 'donut', 'pie'],
  }
}

function scaleChart(question: PollQuestion, result: QuestionResult, kicker: string): PollChart {
  const distribution = result.distribution ?? []
  return {
    id: question.id,
    title: question.prompt,
    kicker,
    caption: copy.scaleCaption(result.average?.toFixed(1) ?? '—', question.scaleMax ?? 5, result.answered),
    labels: distribution.map((item) => String(item.value)),
    series: single('votes', copy.votes, distribution.map((item) => item.count)),
    types: ['bars', 'line', 'donut', 'hbars'],
  }
}

function gridChart(question: PollQuestion, result: QuestionResult, kicker: string): PollChart | null {
  const rows = question.rows ?? []
  if (!rows.length) return null
  const countOf = (rowId: string, optionId: string) =>
    result.rows?.find((row) => row.rowId === rowId)?.options.find((option) => option.optionId === optionId)?.count ?? 0
  return {
    id: question.id,
    title: question.prompt,
    kicker,
    caption: copy.answered(result.answered),
    labels: rows.map((row) => row.label),
    series: question.options.map((option) => ({
      id: option.id,
      label: option.label,
      values: rows.map((row) => countOf(row.id, option.id)),
    })),
    types: ['hbars', 'bars', 'line'],
  }
}

/** Una gráfica por pregunta con votos; las abiertas no se grafican. */
export function questionCharts(questions: readonly PollQuestion[], results: PollResults): readonly PollChart[] {
  const charts: PollChart[] = []
  for (const question of questions) {
    const result = results.questions.find((item) => item.questionId === question.id)
    if (!result?.answered) continue
    const kicker = copy.questionKicker(questionNumber({ questions }, question))
    switch (question.kind) {
      case 'single':
      case 'multiple':
        charts.push(choiceChart(question, result, kicker))
        break
      case 'ranking':
        charts.push(rankingChart(question, result, kicker))
        break
      case 'scale':
        charts.push(scaleChart(question, result, kicker))
        break
      case 'grid': {
        const chart = gridChart(question, result, kicker)
        if (chart) charts.push(chart)
        break
      }
      case 'text':
        break
    }
  }
  return charts
}

/** Lunes = 0, como se lee en Colombia. */
function weekdayIndex(date: Date): number {
  return (date.getDay() + WEEK_DAYS - 1) % WEEK_DAYS
}

/** Gráficas de tráfico y de quién responde; `series` ya viene con los 30 días completos. */
export function insightCharts(
  insights: PollInsights,
  series: readonly PollDayPoint[],
  dayLabel: (isoDay: string) => string,
): readonly PollChart[] {
  const admin = POLLS_ADMIN_COPY
  const { stats, visitors, responses } = insights
  const charts: PollChart[] = [
    {
      id: 'overview',
      title: copy.overviewTitle,
      kicker: copy.trafficKicker,
      labels: [admin.kpiImpressions, admin.kpiVisitors, admin.kpiVisits, admin.kpiResponses],
      series: single('total', copy.overviewTitle, [stats.impressions, stats.visitors, stats.visits, stats.responses]),
      types: ['bars', 'hbars', 'donut', 'pie'],
    },
    {
      id: 'daily',
      title: copy.dailyTitle,
      kicker: copy.trafficKicker,
      labels: series.map((point) => dayLabel(point.day)),
      series: [
        { id: 'impressions', label: admin.kpiImpressions, values: series.map((point) => point.impressions) },
        { id: 'visits', label: admin.kpiVisits, values: series.map((point) => point.visits) },
        { id: 'responses', label: admin.kpiResponses, values: series.map((point) => point.responses) },
      ],
      types: ['line', 'bars'],
    },
  ]

  if (visitors.length) {
    const responded = visitors.filter((visitor) => visitor.responded).length
    const withAccount = visitors.filter((visitor) => visitor.key.startsWith(ACCOUNT_KEY_PREFIX)).length
    charts.push(
      {
        id: 'responded',
        title: copy.respondedTitle,
        kicker: copy.peopleKicker,
        caption: copy.visitorsCaption(visitors.length),
        labels: [copy.responded, copy.notResponded],
        series: single('visitors', admin.kpiVisitors, [responded, visitors.length - responded]),
        types: ['donut', 'pie', 'bars', 'hbars'],
      },
      {
        id: 'accounts',
        title: copy.accountsTitle,
        kicker: copy.peopleKicker,
        caption: copy.visitorsCaption(visitors.length),
        labels: [copy.withAccount, copy.withoutAccount],
        series: single('visitors', admin.kpiVisitors, [withAccount, visitors.length - withAccount]),
        types: ['pie', 'donut', 'bars', 'hbars'],
      },
    )
  }

  if (responses.length) {
    const hours = Array.from({ length: DAY_HOURS }, () => 0)
    const days = Array.from({ length: WEEK_DAYS }, () => 0)
    let signed = 0
    for (const entry of responses) {
      if (entry.userId) signed += 1
      const date = new Date(entry.createdAt)
      if (Number.isNaN(date.valueOf())) continue
      hours[date.getHours()] = (hours[date.getHours()] ?? 0) + 1
      days[weekdayIndex(date)] = (days[weekdayIndex(date)] ?? 0) + 1
    }
    const caption = copy.sampleCaption(responses.length, stats.responses)
    charts.push(
      {
        id: 'hours',
        title: copy.hourTitle,
        kicker: copy.responsesKicker,
        caption,
        labels: hours.map((_, hour) => copy.hourLabel(hour)),
        series: single('responses', admin.kpiResponses, hours),
        types: ['bars', 'line'],
      },
      {
        id: 'weekdays',
        title: copy.weekdayTitle,
        kicker: copy.responsesKicker,
        caption,
        labels: copy.weekdays,
        series: single('responses', admin.kpiResponses, days),
        types: ['bars', 'line', 'donut', 'hbars'],
      },
      {
        id: 'response-accounts',
        title: copy.responseAccountsTitle,
        kicker: copy.responsesKicker,
        caption,
        labels: [copy.withAccount, copy.withoutAccount],
        series: single('responses', admin.kpiResponses, [signed, responses.length - signed]),
        types: ['donut', 'pie', 'bars'],
      },
    )
  }

  return charts
}
