import { fail } from '../../../http/fail.js'
import { HTTP_STATUS } from '../../../http/constants.js'
import type { Parsed } from '../../../http/types.js'
import { optionalText } from '../../../shared/text.js'
import {
  POLL_AUDIENCES,
  POLL_CONDITION_MODES,
  POLL_KINDS,
  POLL_LIMITS,
  POLL_MESSAGES,
  POLL_STATUSES,
} from '../constants/polls.constants.js'
import type {
  AnswerInput,
  AnswerRow,
  Poll,
  PollAudience,
  PollCondition,
  PollConditionMode,
  PollKind,
  PollOption,
  PollQuestion,
  PollRow,
  PollStatus,
} from '../interfaces/polls.interface.js'

const CHOICE_KINDS: readonly PollKind[] = ['single', 'multiple', 'ranking', 'grid']
const PICK_KINDS: readonly PollKind[] = ['single', 'multiple']

export type OptionDraft = Omit<PollOption, 'id'>

/** Condición por posiciones: la pregunta y sus opciones aún no tienen id. */
export type ConditionDraft = {
  question: number
  options: number[]
  mode: PollConditionMode
}

export type QuestionDraft = Omit<PollQuestion, 'id' | 'options' | 'rows' | 'showIf'> & {
  options: OptionDraft[]
  rows: string[]
  showIf?: ConditionDraft
}

export type PollDraft = {
  title: string
  description?: string
  audience: PollAudience
  status: PollStatus
  featured: boolean
  outingId?: string
  closesAt?: string
  questions: QuestionDraft[]
}

export type PollPatch = {
  status?: PollStatus
  featured?: boolean
  closesAt?: string | null
}

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function optionalInt(value: unknown): number | undefined {
  if (value === null || value === undefined || value === '') return undefined
  const parsed = Number(value)
  return Number.isInteger(parsed) ? parsed : undefined
}

function isOneOf<T extends string>(list: readonly T[], value: unknown): value is T {
  return typeof value === 'string' && (list as readonly string[]).includes(value)
}

function parseClosesAt(value: unknown): Parsed<string | undefined> {
  const raw = optionalText(value)
  if (!raw) return { ok: true, value: undefined }
  const date = new Date(raw)
  if (Number.isNaN(date.valueOf())) return fail(HTTP_STATUS.BAD_REQUEST, POLL_MESSAGES.DATE_INVALID)
  return { ok: true, value: date.toISOString().slice(0, 19).replace('T', ' ') }
}

function asRecord(value: unknown): Record<string, unknown> {
  return (value && typeof value === 'object' ? value : {}) as Record<string, unknown>
}

function parseCondition(raw: unknown, index: number, previous: readonly QuestionDraft[]): Parsed<ConditionDraft | undefined> {
  if (raw === null || raw === undefined) return { ok: true, value: undefined }
  const row = asRecord(raw)
  const question = optionalInt(row.question)
  const target = question === undefined ? undefined : previous[question]
  const mode = row.mode ?? 'any'
  const options = Array.isArray(row.options) ? [...new Set(row.options.map(Number))] : []
  if (
    question === undefined ||
    question >= index ||
    !target ||
    !PICK_KINDS.includes(target.kind) ||
    !isOneOf(POLL_CONDITION_MODES, mode) ||
    !options.length ||
    options.some((option) => !Number.isInteger(option) || option < 0 || option >= target.options.length)
  ) {
    return fail(HTTP_STATUS.BAD_REQUEST, POLL_MESSAGES.CONDITION_INVALID)
  }
  return { ok: true, value: { question, options, mode } }
}

function parseQuestion(raw: unknown, index: number, previous: readonly QuestionDraft[]): Parsed<QuestionDraft> {
  const row = asRecord(raw)
  if (!isOneOf(POLL_KINDS, row.kind)) return fail(HTTP_STATUS.BAD_REQUEST, POLL_MESSAGES.KIND_INVALID)
  const kind = row.kind
  const prompt = text(row.prompt)
  if (prompt.length < POLL_LIMITS.PROMPT_MIN || prompt.length > POLL_LIMITS.PROMPT_MAX) {
    return fail(HTTP_STATUS.BAD_REQUEST, POLL_MESSAGES.PROMPT_REQUIRED)
  }
  const picks = PICK_KINDS.includes(kind)
  const options: OptionDraft[] = (Array.isArray(row.options) ? row.options : [])
    .map((item) => {
      const option = asRecord(item)
      return {
        label: text(option.label).slice(0, POLL_LIMITS.OPTION_MAX),
        imageSrc: optionalText(option.imageSrc),
        isOther: picks && option.isOther === true,
        exclusive: kind === 'multiple' && option.exclusive === true,
      }
    })
    .filter((option) => option.label.length > 0)

  const condition = parseCondition(row.showIf, index, previous)
  if (!condition.ok) return condition

  const question: QuestionDraft = {
    kind,
    prompt,
    help: optionalText(row.help),
    section: optionalText(row.section)?.slice(0, POLL_LIMITS.SECTION_MAX),
    required: row.required !== false,
    options: [],
    rows: [],
    showIf: condition.value,
  }

  if (CHOICE_KINDS.includes(kind)) {
    if (options.length < POLL_LIMITS.OPTIONS_MIN || options.length > POLL_LIMITS.OPTIONS_MAX) {
      return fail(HTTP_STATUS.BAD_REQUEST, POLL_MESSAGES.OPTIONS_REQUIRED)
    }
    if (options.filter((option) => option.isOther).length > 1) {
      return fail(HTTP_STATUS.BAD_REQUEST, POLL_MESSAGES.OTHER_ONCE)
    }
    question.options = options
    if (kind === 'grid') {
      const rows = (Array.isArray(row.rows) ? row.rows : [])
        .map((item) => text(typeof item === 'string' ? item : asRecord(item).label).slice(0, POLL_LIMITS.OPTION_MAX))
        .filter(Boolean)
      if (rows.length < POLL_LIMITS.ROWS_MIN || rows.length > POLL_LIMITS.ROWS_MAX) {
        return fail(HTTP_STATUS.BAD_REQUEST, POLL_MESSAGES.ROWS_REQUIRED)
      }
      question.rows = rows
    }
    if (kind === 'multiple') {
      const max = optionalInt(row.maxChoices)
      question.maxChoices = max && max > 0 && max <= options.length ? max : undefined
    }
  }

  if (kind === 'scale') {
    const min = optionalInt(row.scaleMin) ?? 1
    const max = optionalInt(row.scaleMax) ?? 5
    if (min < POLL_LIMITS.SCALE_MIN || max > POLL_LIMITS.SCALE_MAX || min >= max) {
      return fail(HTTP_STATUS.BAD_REQUEST, POLL_MESSAGES.SCALE_INVALID)
    }
    question.scaleMin = min
    question.scaleMax = max
    question.scaleMinLabel = optionalText(row.scaleMinLabel)
    question.scaleMaxLabel = optionalText(row.scaleMaxLabel)
  }

  return { ok: true, value: question }
}

export function parsePollDraft(draft: Record<string, unknown>): Parsed<PollDraft> {
  const title = text(draft.title)
  if (title.length < POLL_LIMITS.TITLE_MIN || title.length > POLL_LIMITS.TITLE_MAX) {
    return fail(HTTP_STATUS.BAD_REQUEST, POLL_MESSAGES.TITLE_REQUIRED)
  }
  const audience = draft.audience ?? 'public'
  if (!isOneOf(POLL_AUDIENCES, audience)) return fail(HTTP_STATUS.BAD_REQUEST, POLL_MESSAGES.AUDIENCE_INVALID)
  const status = draft.status ?? 'draft'
  if (!isOneOf(POLL_STATUSES, status)) return fail(HTTP_STATUS.BAD_REQUEST, POLL_MESSAGES.STATUS_INVALID)
  const closesAt = parseClosesAt(draft.closesAt)
  if (!closesAt.ok) return closesAt

  const rawQuestions = Array.isArray(draft.questions) ? draft.questions : []
  if (!rawQuestions.length) return fail(HTTP_STATUS.BAD_REQUEST, POLL_MESSAGES.QUESTIONS_REQUIRED)
  if (rawQuestions.length > POLL_LIMITS.QUESTIONS_MAX) {
    return fail(HTTP_STATUS.BAD_REQUEST, POLL_MESSAGES.QUESTIONS_TOO_MANY)
  }
  const questions: QuestionDraft[] = []
  for (const [index, raw] of rawQuestions.entries()) {
    const parsed = parseQuestion(raw, index, questions)
    if (!parsed.ok) return parsed
    questions.push(parsed.value)
  }

  return {
    ok: true,
    value: {
      title,
      description: optionalText(draft.description),
      audience,
      status,
      featured: draft.featured === true,
      outingId: optionalText(draft.outingId),
      closesAt: closesAt.value,
      questions,
    },
  }
}

export function parsePollPatch(draft: Record<string, unknown>): Parsed<PollPatch> {
  const patch: PollPatch = {}
  if (draft.status !== undefined) {
    if (!isOneOf(POLL_STATUSES, draft.status)) return fail(HTTP_STATUS.BAD_REQUEST, POLL_MESSAGES.STATUS_INVALID)
    patch.status = draft.status
  }
  if (typeof draft.featured === 'boolean') patch.featured = draft.featured
  if (draft.closesAt !== undefined) {
    if (draft.closesAt === null || draft.closesAt === '') {
      patch.closesAt = null
    } else {
      const closesAt = parseClosesAt(draft.closesAt)
      if (!closesAt.ok) return closesAt
      patch.closesAt = closesAt.value ?? null
    }
  }
  return { ok: true, value: patch }
}

function answerFor(inputs: readonly AnswerInput[], questionId: string): AnswerInput | undefined {
  return inputs.find((item) => item.questionId === questionId)
}

function toGrid(value: unknown): Record<string, string> | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined
  const grid: Record<string, string> = {}
  for (const [rowId, optionId] of Object.entries(value as Record<string, unknown>)) {
    if (typeof optionId === 'string' && optionId) grid[rowId] = optionId
  }
  return grid
}

function toAnswerInputs(raw: unknown): AnswerInput[] {
  if (!Array.isArray(raw)) return []
  return raw
    .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === 'object')
    .map((item) => ({
      questionId: text(item.questionId),
      optionIds: Array.isArray(item.optionIds) ? item.optionIds.map(String) : undefined,
      ranking: Array.isArray(item.ranking) ? item.ranking.map(String) : undefined,
      value: typeof item.value === 'number' ? item.value : undefined,
      text: typeof item.text === 'string' ? item.text : undefined,
      otherText: typeof item.otherText === 'string' ? item.otherText : undefined,
      grid: toGrid(item.grid),
    }))
}

/**
 * Se muestra si no tiene condición, o si la pregunta de la que depende se mostró y su respuesta la cumple.
 * `picked` solo trae las preguntas visibles (sin responder = lista vacía).
 */
export function isQuestionVisible(question: PollQuestion, picked: ReadonlyMap<string, readonly string[]>): boolean {
  const condition = question.showIf
  if (!condition) return true
  const chosen = picked.get(condition.questionId)
  if (!chosen) return false
  const hit = chosen.some((id) => condition.optionIds.includes(id))
  return condition.mode === 'any' ? hit : !hit
}

/** Valida las respuestas contra la estructura de la encuesta y devuelve las filas a guardar. */
export function parseAnswers(poll: Poll, raw: unknown): Parsed<AnswerRow[]> {
  const inputs = toAnswerInputs(raw)
  const rows: AnswerRow[] = []
  const picked = new Map<string, string[]>()
  const empty = (questionId: string): AnswerRow => ({
    questionId,
    optionId: null,
    rowId: null,
    rank: null,
    valueNumber: null,
    valueText: null,
  })

  for (const question of poll.questions) {
    if (!isQuestionVisible(question, picked)) continue
    picked.set(question.id, [])
    const input = answerFor(inputs, question.id)
    const optionIds = new Set(question.options.map((option) => option.id))
    const missing = () =>
      question.required ? fail(HTTP_STATUS.BAD_REQUEST, POLL_MESSAGES.ANSWER_REQUIRED) : null

    if (question.kind === 'single' || question.kind === 'multiple') {
      const chosen = [...new Set(input?.optionIds ?? [])]
      if (!chosen.length) {
        const result = missing()
        if (result) return result
        continue
      }
      if (chosen.some((id) => !optionIds.has(id))) return fail(HTTP_STATUS.BAD_REQUEST, POLL_MESSAGES.ANSWER_INVALID)
      const limit = question.kind === 'single' ? 1 : (question.maxChoices ?? question.options.length)
      if (chosen.length > limit) return fail(HTTP_STATUS.BAD_REQUEST, POLL_MESSAGES.TOO_MANY_CHOICES)
      const options = question.options.filter((option) => chosen.includes(option.id))
      if (chosen.length > 1 && options.some((option) => option.exclusive)) {
        return fail(HTTP_STATUS.BAD_REQUEST, POLL_MESSAGES.EXCLUSIVE_MIXED)
      }
      const otherText = (input?.otherText ?? '').trim().slice(0, POLL_LIMITS.TEXT_MAX)
      for (const option of options) {
        if (option.isOther && !otherText) return fail(HTTP_STATUS.BAD_REQUEST, POLL_MESSAGES.OTHER_TEXT_REQUIRED)
        rows.push({ ...empty(question.id), optionId: option.id, valueText: option.isOther ? otherText : null })
      }
      picked.set(question.id, chosen)
      continue
    }

    if (question.kind === 'grid') {
      const grid = input?.grid ?? {}
      const rowIds = new Set(question.rows.map((row) => row.id))
      const entries = Object.entries(grid)
      if (entries.some(([rowId, optionId]) => !rowIds.has(rowId) || !optionIds.has(optionId))) {
        return fail(HTTP_STATUS.BAD_REQUEST, POLL_MESSAGES.ANSWER_INVALID)
      }
      if (!entries.length || (question.required && entries.length < rowIds.size)) {
        const result = missing()
        if (result) return result
        if (!entries.length) continue
      }
      entries.forEach(([rowId, optionId]) => rows.push({ ...empty(question.id), rowId, optionId }))
      continue
    }

    if (question.kind === 'ranking') {
      const order = input?.ranking ?? []
      if (!order.length) {
        const result = missing()
        if (result) return result
        continue
      }
      const unique = new Set(order)
      if (unique.size !== optionIds.size || order.some((id) => !optionIds.has(id))) {
        return fail(HTTP_STATUS.BAD_REQUEST, POLL_MESSAGES.ANSWER_INVALID)
      }
      order.forEach((optionId, index) => rows.push({ ...empty(question.id), optionId, rank: index + 1 }))
      continue
    }

    if (question.kind === 'scale') {
      const value = input?.value
      if (value === undefined) {
        const result = missing()
        if (result) return result
        continue
      }
      const min = question.scaleMin ?? 1
      const max = question.scaleMax ?? 5
      if (!Number.isInteger(value) || value < min || value > max) {
        return fail(HTTP_STATUS.BAD_REQUEST, POLL_MESSAGES.ANSWER_INVALID)
      }
      rows.push({ ...empty(question.id), valueNumber: value })
      continue
    }

    const answerText = (input?.text ?? '').trim().slice(0, POLL_LIMITS.TEXT_MAX)
    if (!answerText) {
      const result = missing()
      if (result) return result
      continue
    }
    rows.push({ ...empty(question.id), valueText: answerText })
  }

  return { ok: true, value: rows }
}

export function toPollBase(row: Record<string, unknown>): Omit<Poll, 'questions'> {
  return {
    id: String(row.id),
    title: String(row.title),
    description: optionalText(row.description),
    audience: row.audience === 'account' ? 'account' : 'public',
    status: isOneOf(POLL_STATUSES, row.status) ? row.status : 'draft',
    featured: Boolean(row.featured),
    outingId: optionalText(row.outing_id),
    outingTitle: optionalText(row.outing_title),
    closesAt: row.closes_at ? new Date(String(row.closes_at)).toISOString() : undefined,
    createdAt: row.created_at ? new Date(String(row.created_at)).toISOString() : new Date().toISOString(),
  }
}

function parseStoredCondition(value: unknown): PollCondition | undefined {
  if (typeof value !== 'string' || !value) return undefined
  try {
    const row = asRecord(JSON.parse(value))
    const questionId = text(row.questionId)
    const optionIds = Array.isArray(row.optionIds) ? row.optionIds.map(String) : []
    if (!questionId || !optionIds.length || !isOneOf(POLL_CONDITION_MODES, row.mode)) return undefined
    return { questionId, optionIds, mode: row.mode }
  } catch {
    return undefined
  }
}

export function toQuestion(row: Record<string, unknown>, options: PollOption[], rows: PollRow[]): PollQuestion {
  const optionalNumber = (value: unknown) => (value === null || value === undefined ? undefined : Number(value))
  return {
    id: String(row.id),
    kind: isOneOf(POLL_KINDS, row.kind) ? row.kind : 'single',
    prompt: String(row.prompt),
    help: optionalText(row.help),
    section: optionalText(row.section),
    required: Boolean(row.required),
    maxChoices: optionalNumber(row.max_choices),
    scaleMin: optionalNumber(row.scale_min),
    scaleMax: optionalNumber(row.scale_max),
    scaleMinLabel: optionalText(row.scale_min_label),
    scaleMaxLabel: optionalText(row.scale_max_label),
    options,
    rows,
    showIf: parseStoredCondition(row.show_if),
  }
}

export function toOption(row: Record<string, unknown>): PollOption {
  return {
    id: String(row.id),
    label: String(row.label),
    imageSrc: optionalText(row.image_src),
    isOther: Boolean(row.is_other) || undefined,
    exclusive: Boolean(row.exclusive) || undefined,
  }
}

export function toRow(row: Record<string, unknown>): PollRow {
  return { id: String(row.id), label: String(row.label) }
}

