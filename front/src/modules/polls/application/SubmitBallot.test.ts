import { describe, expect, it } from 'vitest'
import { ok } from '@core/result.ts'
import { SubmitBallot } from '@modules/polls/application/SubmitBallot.ts'
import { POLLS_COPY } from '@modules/polls/constants/copy.ts'
import { emptyBallot, type AnswerPayload, type Poll } from '@modules/polls/domain/entities/Poll.ts'
import type { PollsPort } from '@modules/polls/domain/ports/PollsPort.ts'

const poll: Poll = {
  id: 'p1',
  title: '¿Próxima ruta?',
  audience: 'public',
  status: 'open',
  featured: true,
  createdAt: '2026-10-14T00:00:00.000Z',
  isOpen: true,
  hasVoted: false,
  ridersOnly: false,
  isInscribed: false,
  questions: [
    {
      id: 'q1',
      kind: 'single',
      prompt: '¿A dónde?',
      required: true,
      options: [
        { id: 'a', label: 'Anapoima' },
        { id: 'b', label: 'La Vega' },
      ],
    },
  ],
}

function spyPort() {
  const calls: { pollId: string; answers: readonly AnswerPayload[] }[] = []
  const port: PollsPort = {
    list: async () => ok([]),
    get: async () => ok(null),
    vote: async (pollId, answers) => {
      calls.push({ pollId, answers })
      return ok({ ...poll, hasVoted: true })
    },
  }
  return { port, calls }
}

describe('SubmitBallot', () => {
  it('no envía si falta una obligatoria', async () => {
    const { port, calls } = spyPort()
    const result = await new SubmitBallot(port).execute(poll, emptyBallot(poll), false)
    expect(result.ok).toBe(false)
    expect(calls).toHaveLength(0)
  })

  it('bloquea encuestas con cuenta si no hay sesión', async () => {
    const { port, calls } = spyPort()
    const ballot = { q1: { optionIds: ['a'], ranking: [], value: null, text: '' } }
    const result = await new SubmitBallot(port).execute({ ...poll, audience: 'account' }, ballot, false)
    expect(result.ok).toBe(false)
    expect(calls).toHaveLength(0)
  })

  it('bloquea encuestas de rodada a quien no está inscrito', async () => {
    const { port, calls } = spyPort()
    const ballot = { q1: { optionIds: ['a'], ranking: [], value: null, text: '' } }
    const result = await new SubmitBallot(port).execute({ ...poll, ridersOnly: true }, ballot, true)
    expect(!result.ok && result.error.message).toBe(POLLS_COPY.ridersOnly)
    expect(calls).toHaveLength(0)
  })

  it('envía las respuestas y devuelve la encuesta votada', async () => {
    const { port, calls } = spyPort()
    const ballot = { q1: { optionIds: ['b'], ranking: [], value: null, text: '' } }
    const result = await new SubmitBallot(port).execute(poll, ballot, false)
    expect(result.ok && result.value.hasVoted).toBe(true)
    expect(calls).toEqual([{ pollId: 'p1', answers: [{ questionId: 'q1', optionIds: ['b'] }] }])
  })
})
