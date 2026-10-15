import { appError, type AppError } from '@core/errors/AppError.ts'
import { err, ok, type Result } from '@core/result.ts'
import { POLLS_EDITOR_MESSAGES, POLLS_LIMITS } from '@modules/polls/constants/copy.ts'
import type { PollAudience, PollKind, PollStatus } from '@modules/polls/domain/entities/Poll.ts'
import type { PollDraft, QuestionDraft } from '@modules/polls/domain/ports/PollsPort.ts'

export type OptionForm = { label: string; imageSrc: string }

export type QuestionForm = {
  kind: PollKind
  prompt: string
  help: string
  required: boolean
  maxChoices: string
  scaleMin: string
  scaleMax: string
  scaleMinLabel: string
  scaleMaxLabel: string
  options: OptionForm[]
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

const CHOICE_KINDS: readonly PollKind[] = ['single', 'multiple', 'ranking']

export function emptyOption(): OptionForm {
  return { label: '', imageSrc: '' }
}

export function emptyQuestion(kind: PollKind = 'single'): QuestionForm {
  return {
    kind,
    prompt: '',
    help: '',
    required: true,
    maxChoices: '',
    scaleMin: '1',
    scaleMax: '5',
    scaleMinLabel: '',
    scaleMaxLabel: '',
    options: [emptyOption(), emptyOption()],
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

function optional(value: string): string | undefined {
  const trimmed = value.trim()
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

function buildQuestion(form: QuestionForm, index: number): Result<QuestionDraft, AppError> {
  const prompt = form.prompt.trim()
  if (!prompt) return fail(POLLS_EDITOR_MESSAGES.promptRequired, index)
  const base = { kind: form.kind, prompt, help: optional(form.help), required: form.required, options: [] }

  if (CHOICE_KINDS.includes(form.kind)) {
    const options = form.options
      .map((option) => ({ label: option.label.trim(), imageSrc: optional(option.imageSrc) }))
      .filter((option) => option.label)
    if (options.length < POLLS_LIMITS.OPTIONS_MIN) return fail(POLLS_EDITOR_MESSAGES.optionsRequired, index)
    if (options.length > POLLS_LIMITS.OPTIONS_MAX) return fail(POLLS_EDITOR_MESSAGES.optionsTooMany, index)
    const max = form.kind === 'multiple' ? toInt(form.maxChoices) : undefined
    if (max !== undefined && (max < 1 || max > options.length)) return fail(POLLS_EDITOR_MESSAGES.maxInvalid, index)
    return ok({ ...base, options, maxChoices: max })
  }

  if (form.kind === 'scale') {
    const min = toInt(form.scaleMin) ?? 1
    const max = toInt(form.scaleMax) ?? 5
    if (min < POLLS_LIMITS.SCALE_MIN || max > POLLS_LIMITS.SCALE_MAX || min >= max) {
      return fail(POLLS_EDITOR_MESSAGES.scaleInvalid, index)
    }
    return ok({
      ...base,
      scaleMin: min,
      scaleMax: max,
      scaleMinLabel: optional(form.scaleMinLabel),
      scaleMaxLabel: optional(form.scaleMaxLabel),
    })
  }

  return ok(base)
}

export function buildPollDraft(form: PollForm): Result<PollDraft, AppError> {
  const title = form.title.trim()
  if (!title) return fail(POLLS_EDITOR_MESSAGES.titleRequired)
  if (!form.questions.length) return fail(POLLS_EDITOR_MESSAGES.questionsRequired)
  if (form.questions.length > POLLS_LIMITS.QUESTIONS_MAX) return fail(POLLS_EDITOR_MESSAGES.questionsTooMany)

  const questions: QuestionDraft[] = []
  for (const [index, question] of form.questions.entries()) {
    const built = buildQuestion(question, index)
    if (!built.ok) return built
    questions.push(built.value)
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
