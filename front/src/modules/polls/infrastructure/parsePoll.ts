import type {
  OptionTally,
  Poll,
  PollAudience,
  PollKind,
  PollOption,
  PollQuestion,
  PollResults,
  PollStatus,
  QuestionResult,
} from '@modules/polls/domain/entities/Poll.ts'
import type { OperatorPoll } from '@modules/polls/domain/ports/PollsPort.ts'

type Row = Record<string, unknown>

const KINDS: readonly PollKind[] = ['single', 'multiple', 'ranking', 'scale', 'text']
const STATUSES: readonly PollStatus[] = ['draft', 'open', 'closed']

function asRow(value: unknown): Row | null {
  return value && typeof value === 'object' ? (value as Row) : null
}

function str(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value : undefined
}

function num(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined
}

function list(value: unknown): Row[] {
  return Array.isArray(value) ? value.map(asRow).filter((row): row is Row => row !== null) : []
}

function parseOption(row: Row): PollOption | null {
  const id = str(row.id)
  const label = str(row.label)
  if (!id || !label) return null
  return { id, label, imageSrc: str(row.imageSrc) }
}

function parseQuestion(row: Row): PollQuestion | null {
  const id = str(row.id)
  const prompt = str(row.prompt)
  const kind = KINDS.find((item) => item === row.kind)
  if (!id || !prompt || !kind) return null
  return {
    id,
    kind,
    prompt,
    help: str(row.help),
    required: row.required !== false,
    maxChoices: num(row.maxChoices),
    scaleMin: num(row.scaleMin),
    scaleMax: num(row.scaleMax),
    scaleMinLabel: str(row.scaleMinLabel),
    scaleMaxLabel: str(row.scaleMaxLabel),
    options: list(row.options)
      .map(parseOption)
      .filter((item): item is PollOption => item !== null),
  }
}

function parseTally(row: Row): OptionTally | null {
  const optionId = str(row.optionId)
  if (!optionId) return null
  return { optionId, count: num(row.count) ?? 0, percent: num(row.percent) ?? 0, averageRank: num(row.averageRank) }
}

function parseQuestionResult(row: Row): QuestionResult | null {
  const questionId = str(row.questionId)
  if (!questionId) return null
  return {
    questionId,
    answered: num(row.answered) ?? 0,
    options: list(row.options)
      .map(parseTally)
      .filter((item): item is OptionTally => item !== null),
    average: num(row.average),
    distribution: Array.isArray(row.distribution)
      ? list(row.distribution).map((item) => ({ value: num(item.value) ?? 0, count: num(item.count) ?? 0 }))
      : undefined,
    texts: Array.isArray(row.texts) ? row.texts.filter((item): item is string => typeof item === 'string') : undefined,
  }
}

export function parseResults(value: unknown): PollResults | undefined {
  const row = asRow(value)
  if (!row) return undefined
  return {
    responses: num(row.responses) ?? 0,
    questions: list(row.questions)
      .map(parseQuestionResult)
      .filter((item): item is QuestionResult => item !== null),
  }
}

function parseBase(row: Row): Omit<Poll, 'isOpen' | 'hasVoted' | 'ridersOnly' | 'isInscribed' | 'results'> | null {
  const id = str(row.id)
  const title = str(row.title)
  if (!id || !title) return null
  const questions = list(row.questions)
    .map(parseQuestion)
    .filter((item): item is PollQuestion => item !== null)
  if (!questions.length) return null
  const audience: PollAudience = row.audience === 'account' ? 'account' : 'public'
  return {
    id,
    title,
    description: str(row.description),
    audience,
    status: STATUSES.find((item) => item === row.status) ?? 'draft',
    featured: row.featured === true,
    outingId: str(row.outingId),
    outingTitle: str(row.outingTitle),
    closesAt: str(row.closesAt),
    createdAt: str(row.createdAt) ?? '',
    questions,
  }
}

export function parsePoll(value: unknown): Poll | null {
  const row = asRow(value)
  if (!row) return null
  const base = parseBase(row)
  if (!base) return null
  return {
    ...base,
    isOpen: row.isOpen === true,
    hasVoted: row.hasVoted === true,
    ridersOnly: row.ridersOnly === true,
    isInscribed: row.isInscribed === true,
    results: parseResults(row.results),
  }
}

export function parsePollList(value: unknown): Poll[] {
  return list(value)
    .map(parsePoll)
    .filter((item): item is Poll => item !== null)
}

export function parseOperatorPollList(value: unknown): OperatorPoll[] {
  return list(value)
    .map((row) => {
      const base = parseBase(row)
      if (!base) return null
      return { ...base, results: parseResults(row.results) ?? { responses: 0, questions: [] } }
    })
    .filter((item): item is OperatorPoll => item !== null)
}
