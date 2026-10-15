import { describe, expect, it } from 'vitest'
import {
  EMPTY_ANSWER,
  canVote,
  emptyBallot,
  missingRequired,
  moveRank,
  needsTicket,
  pickCell,
  toPayload,
  toggleChoice,
  visibleQuestions,
  type Poll,
  type PollQuestion,
} from '@modules/polls/domain/entities/Poll.ts'

const options = [
  { id: 'a', label: 'Anapoima' },
  { id: 'b', label: 'La Vega' },
  { id: 'c', label: 'Choachí' },
]

const single: PollQuestion = { id: 'q1', kind: 'single', prompt: '¿A dónde?', required: true, options }
const multiple: PollQuestion = { id: 'q2', kind: 'multiple', prompt: '¿Qué llevas?', required: false, maxChoices: 2, options }
const ranking: PollQuestion = { id: 'q3', kind: 'ranking', prompt: 'Ordena', required: true, options }
const scale: PollQuestion = { id: 'q4', kind: 'scale', prompt: '¿Qué tal?', required: true, scaleMin: 1, scaleMax: 5, options: [] }
const text: PollQuestion = { id: 'q5', kind: 'text', prompt: 'Cuéntame', required: false, options: [] }

const poll = { questions: [single, multiple, ranking, scale, text] }

describe('papeleta de encuesta', () => {
  it('arranca el orden con las opciones publicadas', () => {
    expect(emptyBallot(poll).q3?.ranking).toEqual(['a', 'b', 'c'])
  })

  it('una sola opción reemplaza la anterior', () => {
    const ballot = emptyBallot(poll)
    const first = toggleChoice(single, ballot.q1!, 'a')
    expect(toggleChoice(single, first, 'b').optionIds).toEqual(['b'])
  })

  it('respeta el máximo de opciones en selección múltiple', () => {
    let answer = emptyBallot(poll).q2!
    answer = toggleChoice(multiple, answer, 'a')
    answer = toggleChoice(multiple, answer, 'b')
    answer = toggleChoice(multiple, answer, 'c')
    expect(answer.optionIds).toEqual(['a', 'b'])
    expect(toggleChoice(multiple, answer, 'a').optionIds).toEqual(['b'])
  })

  it('mueve elementos al ordenar', () => {
    const answer = emptyBallot(poll).q3!
    expect(moveRank(answer, 2, 0).ranking).toEqual(['c', 'a', 'b'])
    expect(moveRank(answer, 0, 9).ranking).toEqual(['a', 'b', 'c'])
  })

  it('lista las obligatorias sin responder', () => {
    const ballot = emptyBallot(poll)
    expect(missingRequired(poll, ballot).map((question) => question.id)).toEqual(['q1', 'q4'])
  })

  it('arma el envío solo con lo respondido', () => {
    const ballot = {
      ...emptyBallot(poll),
      q1: { ...EMPTY_ANSWER, optionIds: ['b'] },
      q4: { ...EMPTY_ANSWER, value: 4 },
      q5: { ...EMPTY_ANSWER, text: '  buena ruta ' },
    }
    expect(toPayload(poll, ballot)).toEqual([
      { questionId: 'q1', optionIds: ['b'] },
      { questionId: 'q3', ranking: ['a', 'b', 'c'] },
      { questionId: 'q4', value: 4 },
      { questionId: 'q5', text: 'buena ruta' },
    ])
  })

  it('exige cuenta solo cuando la encuesta lo pide', () => {
    const base: Pick<Poll, 'isOpen' | 'hasVoted' | 'audience' | 'ridersOnly' | 'isInscribed'> = {
      isOpen: true,
      hasVoted: false,
      audience: 'account',
      ridersOnly: false,
      isInscribed: false,
    }
    expect(canVote(base, false)).toBe(false)
    expect(canVote(base, true)).toBe(true)
    expect(canVote({ ...base, audience: 'public' }, false)).toBe(true)
    expect(canVote({ ...base, hasVoted: true }, true)).toBe(false)
  })

  it('en encuestas de rodada solo votan los inscritos', () => {
    const ride = { isOpen: true, hasVoted: false, audience: 'public' as const, ridersOnly: true, isInscribed: false }
    expect(canVote(ride, true)).toBe(false)
    expect(needsTicket(ride)).toBe(true)
    expect(canVote({ ...ride, isInscribed: true }, true)).toBe(true)
    expect(needsTicket({ ...ride, isInscribed: true })).toBe(false)
    expect(needsTicket({ ...ride, isOpen: false })).toBe(false)
  })
})

describe('encuestas largas', () => {
  const filter: PollQuestion = {
    id: 'f',
    kind: 'single',
    prompt: '¿Rodas en Bogotá?',
    required: true,
    options: [
      { id: 'si', label: 'Sí' },
      { id: 'no', label: 'No' },
    ],
  }
  const training: PollQuestion = {
    id: 't',
    kind: 'multiple',
    prompt: '¿Dónde aprendiste?',
    required: true,
    showIf: { questionId: 'f', optionIds: ['si'], mode: 'any' },
    options: [
      { id: 'cea', label: 'CEA' },
      { id: 'otro', label: 'Otro', isOther: true },
      { id: 'nada', label: 'Ninguna', exclusive: true },
    ],
  }
  const contents: PollQuestion = {
    id: 'c',
    kind: 'multiple',
    prompt: '¿Qué te enseñaron?',
    required: true,
    showIf: { questionId: 't', optionIds: ['nada'], mode: 'none' },
    options: [
      { id: 'normas', label: 'Normas' },
      { id: 'senales', label: 'Señales' },
    ],
  }
  const grid: PollQuestion = {
    id: 'g',
    kind: 'grid',
    prompt: '¿Con qué frecuencia…?',
    required: true,
    showIf: { questionId: 'f', optionIds: ['si'], mode: 'any' },
    rows: [
      { id: 'vel', label: 'Respetas la velocidad' },
      { id: 'casco', label: 'Usas casco' },
    ],
    options: [
      { id: 'nunca', label: 'Nunca' },
      { id: 'siempre', label: 'Siempre' },
    ],
  }
  const survey = { questions: [filter, training, contents, grid] }

  it('oculta todo lo que depende del filtro hasta responderlo', () => {
    const ballot = emptyBallot(survey)
    expect(visibleQuestions(survey, ballot).map((question) => question.id)).toEqual(['f'])
    const yes = { ...ballot, f: { ...EMPTY_ANSWER, optionIds: ['si'] } }
    expect(visibleQuestions(survey, yes).map((question) => question.id)).toEqual(['f', 't', 'c', 'g'])
  })

  it('salta la pregunta de contenidos si no recibió formación', () => {
    const ballot = {
      ...emptyBallot(survey),
      f: { ...EMPTY_ANSWER, optionIds: ['si'] },
      t: { ...EMPTY_ANSWER, optionIds: ['nada'] },
    }
    expect(visibleQuestions(survey, ballot).map((question) => question.id)).toEqual(['f', 't', 'g'])
  })

  it('la opción exclusiva desmarca las demás y al revés', () => {
    let answer = toggleChoice(training, EMPTY_ANSWER, 'cea')
    answer = toggleChoice(training, answer, 'nada')
    expect(answer.optionIds).toEqual(['nada'])
    expect(toggleChoice(training, answer, 'cea').optionIds).toEqual(['cea'])
  })

  it('«Otro» sin texto cuenta como pendiente y se envía con lo escrito', () => {
    const base = {
      ...emptyBallot(survey),
      f: { ...EMPTY_ANSWER, optionIds: ['si'] },
      c: { ...EMPTY_ANSWER, optionIds: ['normas'] },
      g: pickCell(pickCell(EMPTY_ANSWER, 'vel', 'nunca'), 'casco', 'siempre'),
    }
    const blank = { ...base, t: { ...EMPTY_ANSWER, optionIds: ['otro'] } }
    expect(missingRequired(survey, blank).map((question) => question.id)).toEqual(['t'])
    const filled = { ...base, t: { ...EMPTY_ANSWER, optionIds: ['otro'], otherText: ' YouTube ' } }
    expect(missingRequired(survey, filled)).toEqual([])
    expect(toPayload(survey, filled)).toContainEqual({ questionId: 't', optionIds: ['otro'], otherText: 'YouTube' })
    expect(toPayload(survey, filled)).toContainEqual({ questionId: 'g', grid: { vel: 'nunca', casco: 'siempre' } })
  })

  it('la cuadrícula obligatoria pide todas las filas', () => {
    const ballot = {
      ...emptyBallot(survey),
      f: { ...EMPTY_ANSWER, optionIds: ['si'] },
      t: { ...EMPTY_ANSWER, optionIds: ['nada'] },
      g: pickCell(EMPTY_ANSWER, 'vel', 'nunca'),
    }
    expect(missingRequired(survey, ballot).map((question) => question.id)).toEqual(['g'])
  })

  it('no envía respuestas de preguntas ocultas', () => {
    const ballot = {
      ...emptyBallot(survey),
      f: { ...EMPTY_ANSWER, optionIds: ['no'] },
      t: { ...EMPTY_ANSWER, optionIds: ['cea'] },
    }
    expect(toPayload(survey, ballot)).toEqual([{ questionId: 'f', optionIds: ['no'] }])
  })
})
