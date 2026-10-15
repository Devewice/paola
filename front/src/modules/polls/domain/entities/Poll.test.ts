import { describe, expect, it } from 'vitest'
import {
  canVote,
  emptyBallot,
  missingRequired,
  moveRank,
  needsTicket,
  toPayload,
  toggleChoice,
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
      q1: { optionIds: ['b'], ranking: [], value: null, text: '' },
      q4: { optionIds: [], ranking: [], value: 4, text: '' },
      q5: { optionIds: [], ranking: [], value: null, text: '  buena ruta ' },
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
