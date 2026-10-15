import { appError, type AppError } from '@core/errors/AppError.ts'
import { err, ok, type Result } from '@core/result.ts'
import { POLLS_EDITOR_MESSAGES, POLLS_LIMITS } from '@modules/polls/constants/copy.ts'
import type {
  PollAudience,
  PollConditionMode,
  PollDisplay,
  PollKind,
  PollStatus,
  PollTone,
} from '@modules/polls/domain/entities/Poll.ts'
import type {
  ConditionDraft,
  OptionDraft,
  PollDraft,
  QuestionDraft,
  RowDraft,
} from '@modules/polls/domain/ports/PollsPort.ts'

export type OptionForm = { label: string; imageSrc: string; isOther?: boolean; exclusive?: boolean }

export type QuestionForm = {
  kind: PollKind
  prompt: string
  help: string
  section?: string
  /** Número del documento; vacío = sin número. */
  code?: string
  display?: PollDisplay
  tone?: PollTone
  required: boolean
  maxChoices: string
  scaleMin: string
  scaleMax: string
  scaleMinLabel: string
  scaleMaxLabel: string
  options: OptionForm[]
  /** Filas de la cuadrícula y su número del documento (misma posición). */
  rows?: string[]
  rowCodes?: string[]
  /** Posición (como texto) de la pregunta de la que depende; vacío = siempre visible. */
  showIfQuestion?: string
  showIfOptions?: number[]
  showIfMode?: PollConditionMode
}

export type PollForm = {
  title: string
  description: string
  audience: PollAudience
  status: PollStatus
  featured: boolean
  outingId: string
  closesAt: string
  questions: QuestionForm[]
}

const CHOICE_KINDS: readonly PollKind[] = ['single', 'multiple', 'ranking', 'grid']
export const CONDITION_KINDS: readonly PollKind[] = ['single', 'multiple']

export function emptyOption(): OptionForm {
  return { label: '', imageSrc: '', isOther: false, exclusive: false }
}

export function emptyQuestion(kind: PollKind = 'single'): QuestionForm {
  return {
    kind,
    prompt: '',
    help: '',
    section: '',
    code: '',
    display: 'auto',
    tone: 'plain',
    required: true,
    maxChoices: '',
    scaleMin: '1',
    scaleMax: '5',
    scaleMinLabel: '',
    scaleMaxLabel: '',
    options: [emptyOption(), emptyOption()],
    rows: ['', ''],
    rowCodes: ['', ''],
    showIfQuestion: '',
    showIfOptions: [],
    showIfMode: 'any',
  }
}

export function emptyPollForm(): PollForm {
  return {
    title: '',
    description: '',
    audience: 'public',
    status: 'open',
    featured: false,
    outingId: '',
    closesAt: '',
    questions: [emptyQuestion()],
  }
}

function optional(value: string | undefined): string | undefined {
  const trimmed = (value ?? '').trim()
  return trimmed || undefined
}

function toInt(value: string): number | undefined {
  if (!value.trim()) return undefined
  const parsed = Number(value)
  return Number.isInteger(parsed) ? parsed : undefined
}

function fail(message: string, index?: number): Result<never, AppError> {
  const where = index === undefined ? '' : ` (${POLLS_EDITOR_MESSAGES.question} ${index + 1})`
  return err(appError('VALIDATION', `${message}${where}`))
}

/** Lo armado hasta ahora, para resolver condiciones contra preguntas anteriores. */
type Built = {
  readonly kind: PollKind
  /** Posición en el formulario → posición tras descartar opciones vacías (-1 si se descartó). */
  readonly optionMap: readonly number[]
}

function buildCondition(form: QuestionForm, index: number, built: readonly Built[]): Result<ConditionDraft | undefined, AppError> {
  const raw = (form.showIfQuestion ?? '').trim()
  if (!raw) return ok(undefined)
  const question = Number(raw)
  const target = Number.isInteger(question) && question >= 0 && question < index ? built[question] : undefined
  if (!target || !CONDITION_KINDS.includes(target.kind)) return fail(POLLS_EDITOR_MESSAGES.conditionInvalid, index)
  const options = [...new Set(form.showIfOptions ?? [])]
    .map((option) => target.optionMap[option] ?? -1)
    .filter((option) => option >= 0)
  if (!options.length) return fail(POLLS_EDITOR_MESSAGES.conditionOptions, index)
  return ok({ question, options, mode: form.showIfMode ?? 'any' })
}

function buildQuestion(form: QuestionForm, index: number, built: readonly Built[]): Result<{ draft: QuestionDraft; built: Built }, AppError> {
  const prompt = form.prompt.trim()
  if (!prompt) return fail(POLLS_EDITOR_MESSAGES.promptRequired, index)
  const condition = buildCondition(form, index, built)
  if (!condition.ok) return condition
  const base: QuestionDraft = {
    kind: form.kind,
    prompt,
    help: optional(form.help),
    required: form.required,
    options: [],
    ...(optional(form.section) ? { section: optional(form.section) } : {}),
    ...(optional(form.code) ? { code: optional(form.code) } : {}),
    ...(form.display && form.display !== 'auto' ? { display: form.display } : {}),
    ...(form.tone && form.tone !== 'plain' ? { tone: form.tone } : {}),
    ...(condition.value ? { showIf: condition.value } : {}),
  }
  const done = (draft: QuestionDraft, optionMap: readonly number[] = []) =>
    ok({ draft, built: { kind: form.kind, optionMap } })

  if (CHOICE_KINDS.includes(form.kind)) {
    const picks = CONDITION_KINDS.includes(form.kind)
    const optionMap: number[] = []
    const options: OptionDraft[] = []
    for (const option of form.options) {
      const label = option.label.trim()
      if (!label) {
        optionMap.push(-1)
        continue
      }
      optionMap.push(options.length)
      options.push({
        label,
        imageSrc: optional(option.imageSrc),
        ...(picks && option.isOther ? { isOther: true } : {}),
        ...(form.kind === 'multiple' && option.exclusive ? { exclusive: true } : {}),
      })
    }
    if (options.length < POLLS_LIMITS.OPTIONS_MIN) return fail(POLLS_EDITOR_MESSAGES.optionsRequired, index)
    if (options.length > POLLS_LIMITS.OPTIONS_MAX) return fail(POLLS_EDITOR_MESSAGES.optionsTooMany, index)
    if (options.filter((option) => option.isOther).length > 1) return fail(POLLS_EDITOR_MESSAGES.otherOnce, index)

    if (form.kind === 'grid') {
      const rows: RowDraft[] = (form.rows ?? [])
        .map((row, position) => {
          const code = optional(form.rowCodes?.[position])
          return code ? { label: row.trim(), code } : { label: row.trim() }
        })
        .filter((row) => row.label)
      if (rows.length < POLLS_LIMITS.ROWS_MIN || rows.length > POLLS_LIMITS.ROWS_MAX) {
        return fail(POLLS_EDITOR_MESSAGES.rowsRequired, index)
      }
      return done({ ...base, options, rows }, optionMap)
    }

    const max = form.kind === 'multiple' ? toInt(form.maxChoices) : undefined
    if (max !== undefined && (max < 1 || max > options.length)) return fail(POLLS_EDITOR_MESSAGES.maxInvalid, index)
    return done({ ...base, options, maxChoices: max }, optionMap)
  }

  if (form.kind === 'scale') {
    const min = toInt(form.scaleMin) ?? 1
    const max = toInt(form.scaleMax) ?? 5
    if (min < POLLS_LIMITS.SCALE_MIN || max > POLLS_LIMITS.SCALE_MAX || min >= max) {
      return fail(POLLS_EDITOR_MESSAGES.scaleInvalid, index)
    }
    return done({
      ...base,
      scaleMin: min,
      scaleMax: max,
      scaleMinLabel: optional(form.scaleMinLabel),
      scaleMaxLabel: optional(form.scaleMaxLabel),
    })
  }

  return done(base)
}

export function buildPollDraft(form: PollForm): Result<PollDraft, AppError> {
  const title = form.title.trim()
  if (!title) return fail(POLLS_EDITOR_MESSAGES.titleRequired)
  if (!form.questions.length) return fail(POLLS_EDITOR_MESSAGES.questionsRequired)
  if (form.questions.length > POLLS_LIMITS.QUESTIONS_MAX) return fail(POLLS_EDITOR_MESSAGES.questionsTooMany)

  const questions: QuestionDraft[] = []
  const built: Built[] = []
  for (const [index, question] of form.questions.entries()) {
    const result = buildQuestion(question, index, built)
    if (!result.ok) return result
    questions.push(result.value.draft)
    built.push(result.value.built)
  }

  let closesAt: string | undefined
  if (form.closesAt.trim()) {
    const date = new Date(form.closesAt)
    if (Number.isNaN(date.valueOf())) return fail(POLLS_EDITOR_MESSAGES.dateInvalid)
    closesAt = date.toISOString()
  }

  return ok({
    title,
    description: optional(form.description),
    audience: form.audience,
    status: form.status,
    featured: form.featured,
    outingId: optional(form.outingId),
    closesAt,
    questions,
  })
}
