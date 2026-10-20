import { describe, expect, it } from 'vitest'
import { insightCharts, questionCharts } from '@modules/polls/application/pollCharts.ts'
import type { PollQuestion, PollResults } from '@modules/polls/domain/entities/Poll.ts'
import type { PollInsights } from '@modules/polls/domain/ports/PollsPort.ts'

const questions: PollQuestion[] = [
  {
    id: 'q1',
    kind: 'single',
    prompt: '¿Rodas en Bogotá?',
    required: true,
    options: [
      { id: 'si', label: 'Sí' },
      { id: 'no', label: 'No' },
    ],
  },
  { id: 'q2', kind: 'text', prompt: 'Cuéntanos', required: false, options: [] },
  {
    id: 'q3',
    kind: 'scale',
    prompt: '¿Qué tal?',
    required: true,
    scaleMin: 1,
    scaleMax: 3,
    options: [],
  },
  {
    id: 'q4',
    kind: 'grid',
    prompt: 'Califica',
    required: true,
    options: [
      { id: 'b', label: 'Bien' },
      { id: 'm', label: 'Mal' },
    ],
    rows: [
      { id: 'r1', label: 'Ruta' },
      { id: 'r2', label: 'Comida' },
    ],
  },
  {
    id: 'q5',
    kind: 'single',
    prompt: 'Sin votos',
    required: false,
    options: [{ id: 'x', label: 'X' }],
  },
]

const results: PollResults = {
  responses: 3,
  questions: [
    { questionId: 'q1', answered: 3, options: [{ optionId: 'no', count: 1, percent: 33 }, { optionId: 'si', count: 2, percent: 67 }] },
    { questionId: 'q2', answered: 2, options: [] },
    {
      questionId: 'q3',
      answered: 3,
      options: [],
      average: 2.3,
      distribution: [
        { value: 1, count: 0 },
        { value: 2, count: 2 },
        { value: 3, count: 1 },
      ],
    },
    {
      questionId: 'q4',
      answered: 3,
      options: [],
      rows: [
        { rowId: 'r1', answered: 3, options: [{ optionId: 'b', count: 3, percent: 100 }] },
        { rowId: 'r2', answered: 3, options: [{ optionId: 'b', count: 1, percent: 33 }, { optionId: 'm', count: 2, percent: 67 }] },
      ],
    },
    { questionId: 'q5', answered: 0, options: [] },
  ],
}

describe('questionCharts', () => {
  it('grafica las preguntas con votos y deja por fuera las abiertas', () => {
    const charts = questionCharts(questions, results)
    expect(charts.map((chart) => chart.id)).toEqual(['q1', 'q3', 'q4'])
  })

  it('respeta el orden de las opciones y arranca en dona si son pocas', () => {
    const [choice] = questionCharts(questions, results)
    expect(choice?.labels).toEqual(['Sí', 'No'])
    expect(choice?.series[0]?.values).toEqual([2, 1])
    expect(choice?.types[0]).toBe('donut')
  })

  it('arma una serie por columna en las cuadrículas', () => {
    const grid = questionCharts(questions, results).find((chart) => chart.id === 'q4')
    expect(grid?.labels).toEqual(['Ruta', 'Comida'])
    expect(grid?.series.map((serie) => serie.values)).toEqual([
      [3, 1],
      [0, 2],
    ])
  })
})

describe('insightCharts', () => {
  const insights: PollInsights = {
    stats: { impressions: 10, visits: 4, visitors: 3, responses: 2 },
    series: [],
    visitors: [
      { key: 'u:1', impressions: 1, visits: 1, firstSeen: '', lastSeen: '', responded: true },
      { key: 'a:abc', impressions: 2, visits: 0, firstSeen: '', lastSeen: '', responded: false },
      { key: 'a:def', impressions: 1, visits: 1, firstSeen: '', lastSeen: '', responded: true },
    ],
    responses: [
      { id: '1', createdAt: '2026-10-19T09:30:00', userId: '1', answers: [] },
      { id: '2', createdAt: '2026-10-18T21:10:00', answers: [] },
    ],
  }

  it('cuenta quién respondió, cuentas y horarios', () => {
    const charts = insightCharts(insights, [], (day) => day)
    const byId = new Map(charts.map((chart) => [chart.id, chart]))
    expect(byId.get('responded')?.series[0]?.values).toEqual([2, 1])
    expect(byId.get('accounts')?.series[0]?.values).toEqual([1, 2])
    expect(byId.get('response-accounts')?.series[0]?.values).toEqual([1, 1])
    const hours = byId.get('hours')?.series[0]?.values ?? []
    expect(hours[9]).toBe(1)
    expect(hours[21]).toBe(1)
    const weekdays = byId.get('weekdays')?.series[0]?.values ?? []
    expect(weekdays[0]).toBe(1)
    expect(weekdays[6]).toBe(1)
  })

  it('sin visitantes ni respuestas deja solo el tráfico', () => {
    const charts = insightCharts({ ...insights, visitors: [], responses: [] }, [], (day) => day)
    expect(charts.map((chart) => chart.id)).toEqual(['overview', 'daily'])
  })
})
