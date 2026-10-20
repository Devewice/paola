import type {
  OptionTally,
  Poll,
  PollAudience,
  PollCondition,
  PollConditionMode,
  PollDisplay,
  PollKind,
  PollTone,
  PollOption,
  PollQuestion,
  PollResults,
  PollRow,
  PollStatus,
  QuestionResult,
  RowResult,
} from '@modules/polls/domain/entities/Poll.ts'
import type {
  OperatorPoll,
  PollDayPoint,
  PollInsights,
  PollResponseEntry,
  PollStats,
  PollVisitor,
} from '@modules/polls/domain/ports/PollsPort.ts'

type Row = Record<string, unknown>

const KINDS: readonly PollKind[] = ['single', 'multiple', 'ranking', 'scale', 'text', 'grid']
const MODES: readonly PollConditionMode[] = ['any', 'none']
const DISPLAYS: readonly PollDisplay[] = ['auto', 'chips', 'cards', 'gate', 'deck', 'table']
const TONES: readonly PollTone[] = ['plain', 'track', 'faces']
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
  return {
    id,
    label,
    imageSrc: str(row.imageSrc),
    isOther: row.isOther === true || undefined,
    exclusive: row.exclusive === true || undefined,
  }
}

function parseRow(row: Row): PollRow | null {
  const id = str(row.id)
  const label = str(row.label)
  return id && label ? { id, label, code: str(row.code) } : null
}

function parseCondition(value: unknown): PollCondition | undefined {
  const row = asRow(value)
  if (!row) return undefined
  const questionId = str(row.questionId)
  const mode = MODES.find((item) => item === row.mode)
  const optionIds = Array.isArray(row.optionIds) ? row.optionIds.filter((id): id is string => typeof id === 'string') : []
  return questionId && mode && optionIds.length ? { questionId, optionIds, mode } : undefined
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
    section: str(row.section),
    code: str(row.code),
    display: DISPLAYS.find((item) => item === row.display),
    tone: TONES.find((item) => item === row.tone),
    rows: list(row.rows)
      .map(parseRow)
      .filter((item): item is PollRow => item !== null),
    showIf: parseCondition(row.showIf),
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
    otherTexts: Array.isArray(row.otherTexts)
      ? row.otherTexts.filter((item): item is string => typeof item === 'string')
      : undefined,
    rows: Array.isArray(row.rows)
      ? list(row.rows)
          .map((item): RowResult | null => {
            const rowId = str(item.rowId)
            if (!rowId) return null
            return {
              rowId,
              answered: num(item.answered) ?? 0,
              options: list(item.options)
                .map(parseTally)
                .filter((tally): tally is OptionTally => tally !== null),
            }
          })
          .filter((item): item is RowResult => item !== null)
      : undefined,
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
    showResults: row.showResults !== false,
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

function parseStats(value: unknown): PollStats {
  const row = asRow(value) ?? {}
  return { impressions: num(row.impressions) ?? 0, visits: num(row.visits) ?? 0, visitors: num(row.visitors) ?? 0 }
}

export function parseOperatorPollList(value: unknown): OperatorPoll[] {
  return list(value)
    .map((row) => {
      const base = parseBase(row)
      if (!base) return null
      return {
        ...base,
        results: parseResults(row.results) ?? { responses: 0, questions: [] },
        stats: parseStats(row.stats),
      }
    })
    .filter((item): item is OperatorPoll => item !== null)
}

function parseVisitor(row: Row): PollVisitor | null {
  const key = str(row.key)
  if (!key) return null
  return {
    key,
    userId: str(row.userId),
    name: str(row.name),
    whatsapp: str(row.whatsapp),
    impressions: num(row.impressions) ?? 0,
    visits: num(row.visits) ?? 0,
    firstSeen: str(row.firstSeen) ?? '',
    lastSeen: str(row.lastSeen) ?? '',
    responded: row.responded === true,
  }
}

function parseResponseEntry(row: Row): PollResponseEntry | null {
  const id = str(row.id)
  if (!id) return null
  return {
    id,
    createdAt: str(row.createdAt) ?? '',
    userId: str(row.userId),
    name: str(row.name),
    answers: list(row.answers)
      .map((item) => {
        const questionId = str(item.questionId)
        const text = str(item.text)
        return questionId && text ? { questionId, text } : null
      })
      .filter((item): item is { questionId: string; text: string } => item !== null),
  }
}

export function parseInsights(value: unknown): PollInsights {
  const row = asRow(value) ?? {}
  const stats = asRow(row.stats) ?? {}
  return {
    stats: { ...parseStats(stats), responses: num(stats.responses) ?? 0 },
    series: list(row.series)
      .map((item) => {
        const day = str(item.day)
        return day
          ? { day, impressions: num(item.impressions) ?? 0, visits: num(item.visits) ?? 0, responses: num(item.responses) ?? 0 }
          : null
      })
      .filter((item): item is PollDayPoint => item !== null),
    visitors: list(row.visitors)
      .map(parseVisitor)
      .filter((item): item is PollVisitor => item !== null),
    responses: list(row.responses)
      .map(parseResponseEntry)
      .filter((item): item is PollResponseEntry => item !== null),
  }
}
