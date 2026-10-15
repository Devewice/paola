import { POLLS_DRAFT_STORAGE_PREFIX } from '@modules/polls/constants/copy.ts'
import { EMPTY_ANSWER, type Ballot, type BallotAnswer } from '@modules/polls/domain/entities/Poll.ts'
import type { BallotDraftPort } from '@modules/polls/domain/ports/PollsPort.ts'

function strings(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []
}

function toAnswer(value: unknown): BallotAnswer {
  const row = (value && typeof value === 'object' ? value : {}) as Record<string, unknown>
  const grid: Record<string, string> = {}
  if (row.grid && typeof row.grid === 'object') {
    for (const [rowId, optionId] of Object.entries(row.grid as Record<string, unknown>)) {
      if (typeof optionId === 'string') grid[rowId] = optionId
    }
  }
  return {
    ...EMPTY_ANSWER,
    optionIds: strings(row.optionIds),
    ranking: strings(row.ranking),
    value: typeof row.value === 'number' ? row.value : null,
    text: typeof row.text === 'string' ? row.text : '',
    otherText: typeof row.otherText === 'string' ? row.otherText : '',
    grid,
  }
}

/** Borrador por encuesta en `localStorage`; sin storage, simplemente no se guarda. */
export class BrowserBallotDrafts implements BallotDraftPort {
  load(pollId: string): Ballot | null {
    try {
      const raw = localStorage.getItem(`${POLLS_DRAFT_STORAGE_PREFIX}${pollId}`)
      if (!raw) return null
      const parsed = JSON.parse(raw) as Record<string, unknown>
      const ballot: Record<string, BallotAnswer> = {}
      for (const [questionId, answer] of Object.entries(parsed)) ballot[questionId] = toAnswer(answer)
      return ballot
    } catch {
      return null
    }
  }

  save(pollId: string, ballot: Ballot): void {
    try {
      localStorage.setItem(`${POLLS_DRAFT_STORAGE_PREFIX}${pollId}`, JSON.stringify(ballot))
    } catch {
      /* sin storage */
    }
  }

  clear(pollId: string): void {
    try {
      localStorage.removeItem(`${POLLS_DRAFT_STORAGE_PREFIX}${pollId}`)
    } catch {
      /* sin storage */
    }
  }
}

export class InMemoryBallotDrafts implements BallotDraftPort {
  private readonly drafts = new Map<string, Ballot>()

  load(pollId: string): Ballot | null {
    return this.drafts.get(pollId) ?? null
  }

  save(pollId: string, ballot: Ballot): void {
    this.drafts.set(pollId, ballot)
  }

  clear(pollId: string): void {
    this.drafts.delete(pollId)
  }
}
