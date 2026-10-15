export type PollKind = 'single' | 'multiple' | 'ranking' | 'scale' | 'text' | 'grid'
export type PollStatus = 'draft' | 'open' | 'closed'
export type PollAudience = 'public' | 'account'
/** `any`: se muestra si eligieron alguna de las opciones; `none`: si no eligieron ninguna. */
export type PollConditionMode = 'any' | 'none'
/** Cómo se pinta la pregunta; `auto` decide según el tipo y lo largo de las opciones. */
export type PollDisplay = 'auto' | 'chips' | 'cards' | 'gate' | 'deck' | 'table'
/** Estilo de escalas y cuadrículas: números sueltos, pista con color o caritas. */
export type PollTone = 'plain' | 'track' | 'faces'

export type PollOption = {
  readonly id: string
  readonly label: string
  readonly imageSrc?: string
  /** Pide escribir cuál («Otro: ___»). */
  readonly isOther?: boolean
  /** Al elegirla se desmarcan las demás («Ninguna», «No recuerdo»). */
  readonly exclusive?: boolean
}

export type PollRow = {
  readonly id: string
  readonly label: string
  /** Número del documento original («a», «13»). */
  readonly code?: string
}

export type PollCondition = {
  readonly questionId: string
  readonly optionIds: readonly string[]
  readonly mode: PollConditionMode
}

export type PollQuestion = {
  readonly id: string
  readonly kind: PollKind
  readonly prompt: string
  readonly help?: string
  /** Título de sección que arranca en esta pregunta. */
  readonly section?: string
  /** Número del documento original; sin código la pregunta no se numera. */
  readonly code?: string
  readonly display?: PollDisplay
  readonly tone?: PollTone
  readonly required: boolean
  readonly maxChoices?: number
  readonly scaleMin?: number
  readonly scaleMax?: number
  readonly scaleMinLabel?: string
  readonly scaleMaxLabel?: string
  /** En cuadrícula, `options` son las columnas y `rows` las filas. */
  readonly options: readonly PollOption[]
  readonly rows?: readonly PollRow[]
  readonly showIf?: PollCondition
}

export type OptionTally = {
  readonly optionId: string
  readonly count: number
  readonly percent: number
  readonly averageRank?: number
}

export type RowResult = {
  readonly rowId: string
  readonly answered: number
  readonly options: readonly OptionTally[]
}

export type QuestionResult = {
  readonly questionId: string
  readonly answered: number
  readonly options: readonly OptionTally[]
  readonly average?: number
  readonly distribution?: readonly { readonly value: number; readonly count: number }[]
  readonly texts?: readonly string[]
  readonly otherTexts?: readonly string[]
  readonly rows?: readonly RowResult[]
}

export type PollResults = {
  readonly responses: number
  readonly questions: readonly QuestionResult[]
}

export type Poll = {
  readonly id: string
  readonly title: string
  readonly description?: string
  readonly audience: PollAudience
  readonly status: PollStatus
  readonly featured: boolean
  readonly outingId?: string
  readonly outingTitle?: string
  readonly closesAt?: string
  readonly createdAt: string
  readonly questions: readonly PollQuestion[]
  readonly isOpen: boolean
  readonly hasVoted: boolean
  /** Encuesta de rodada: la ven todos, la votan los inscritos. */
  readonly ridersOnly: boolean
  readonly isInscribed: boolean
  readonly results?: PollResults
}

/** Respuesta en curso de una pregunta, antes de enviarla. */
export type BallotAnswer = {
  readonly optionIds: readonly string[]
  readonly ranking: readonly string[]
  readonly value: number | null
  readonly text: string
  /** Lo escrito en la opción «Otro». */
  readonly otherText: string
  /** Cuadrícula: fila → columna elegida. */
  readonly grid: Readonly<Record<string, string>>
}

export type Ballot = Readonly<Record<string, BallotAnswer>>

export type AnswerPayload = {
  readonly questionId: string
  readonly optionIds?: readonly string[]
  readonly ranking?: readonly string[]
  readonly value?: number
  readonly text?: string
  readonly otherText?: string
  readonly grid?: Readonly<Record<string, string>>
}

export const EMPTY_ANSWER: BallotAnswer = { optionIds: [], ranking: [], value: null, text: '', otherText: '', grid: {} }

export function choiceLimit(question: PollQuestion): number {
  if (question.kind === 'single') return 1
  return question.maxChoices ?? question.options.length
}

export function rowsOf(question: PollQuestion): readonly PollRow[] {
  return question.rows ?? []
}

/** Estado inicial: las preguntas de ordenar arrancan con el orden publicado. */
export function emptyBallot(poll: Pick<Poll, 'questions'>): Ballot {
  const ballot: Record<string, BallotAnswer> = {}
  for (const question of poll.questions) {
    ballot[question.id] = {
      ...EMPTY_ANSWER,
      ranking: question.kind === 'ranking' ? question.options.map((option) => option.id) : [],
    }
  }
  return ballot
}

function otherPicked(question: PollQuestion, answer: BallotAnswer): boolean {
  return question.options.some((option) => option.isOther && answer.optionIds.includes(option.id))
}

/** «Otro» elegido sin escribir cuál. */
export function needsOtherText(question: PollQuestion, answer: BallotAnswer | undefined): boolean {
  return Boolean(answer) && otherPicked(question, answer!) && !answer!.otherText.trim()
}

export function isAnswered(question: PollQuestion, answer: BallotAnswer | undefined): boolean {
  if (!answer) return false
  switch (question.kind) {
    case 'single':
    case 'multiple':
      return answer.optionIds.length > 0 && !needsOtherText(question, answer)
    case 'ranking':
      return answer.ranking.length === question.options.length
    case 'scale':
      return answer.value !== null
    case 'text':
      return answer.text.trim().length > 0
    case 'grid':
      return rowsOf(question).every((row) => Boolean(answer.grid[row.id]))
  }
}

function hasAny(question: PollQuestion, answer: BallotAnswer | undefined): boolean {
  if (!answer) return false
  if (question.kind === 'grid') return Object.keys(answer.grid).length > 0
  if (question.kind === 'single' || question.kind === 'multiple') return answer.optionIds.length > 0
  return isAnswered(question, answer)
}

export function toggleChoice(question: PollQuestion, answer: BallotAnswer, optionId: string): BallotAnswer {
  if (question.kind === 'single') return { ...answer, optionIds: [optionId] }
  if (answer.optionIds.includes(optionId)) {
    return { ...answer, optionIds: answer.optionIds.filter((id) => id !== optionId) }
  }
  const option = question.options.find((item) => item.id === optionId)
  if (option?.exclusive) return { ...answer, optionIds: [optionId] }
  const exclusive = new Set(question.options.filter((item) => item.exclusive).map((item) => item.id))
  const kept = answer.optionIds.filter((id) => !exclusive.has(id))
  if (kept.length >= choiceLimit(question)) return answer
  return { ...answer, optionIds: [...kept, optionId] }
}

export function pickCell(answer: BallotAnswer, rowId: string, optionId: string): BallotAnswer {
  return { ...answer, grid: { ...answer.grid, [rowId]: optionId } }
}

export function moveRank(answer: BallotAnswer, from: number, to: number): BallotAnswer {
  if (from === to || from < 0 || to < 0 || from >= answer.ranking.length || to >= answer.ranking.length) return answer
  const ranking = [...answer.ranking]
  const [item] = ranking.splice(from, 1)
  if (item === undefined) return answer
  ranking.splice(to, 0, item)
  return { ...answer, ranking }
}

/** Preguntas que se muestran según lo respondido hasta ahora. */
export function visibleQuestions(poll: Pick<Poll, 'questions'>, ballot: Ballot): readonly PollQuestion[] {
  const shown = new Set<string>()
  return poll.questions.filter((question) => {
    const condition = question.showIf
    let visible = true
    if (condition) {
      const chosen = ballot[condition.questionId]?.optionIds ?? []
      const hit = chosen.some((id) => condition.optionIds.includes(id))
      visible = shown.has(condition.questionId) && (condition.mode === 'any' ? hit : !hit)
    }
    if (visible) shown.add(question.id)
    return visible
  })
}

/** Preguntas obligatorias que faltan por responder. */
export function missingRequired(poll: Pick<Poll, 'questions'>, ballot: Ballot): readonly PollQuestion[] {
  return visibleQuestions(poll, ballot).filter(
    (question) => (question.required || needsOtherText(question, ballot[question.id])) && !isAnswered(question, ballot[question.id]),
  )
}

export function toPayload(poll: Pick<Poll, 'questions'>, ballot: Ballot): readonly AnswerPayload[] {
  return visibleQuestions(poll, ballot)
    .filter((question) => hasAny(question, ballot[question.id]))
    .map((question) => {
      const answer = ballot[question.id] ?? EMPTY_ANSWER
      switch (question.kind) {
        case 'single':
        case 'multiple':
          return otherPicked(question, answer)
            ? { questionId: question.id, optionIds: answer.optionIds, otherText: answer.otherText.trim() }
            : { questionId: question.id, optionIds: answer.optionIds }
        case 'ranking':
          return { questionId: question.id, ranking: answer.ranking }
        case 'scale':
          return { questionId: question.id, value: answer.value ?? undefined }
        case 'text':
          return { questionId: question.id, text: answer.text.trim() }
        case 'grid':
          return { questionId: question.id, grid: answer.grid }
      }
    })
}

export function canVote(
  poll: Pick<Poll, 'isOpen' | 'hasVoted' | 'audience' | 'ridersOnly' | 'isInscribed'>,
  signedIn: boolean,
): boolean {
  if (!poll.isOpen || poll.hasVoted) return false
  if (poll.ridersOnly) return poll.isInscribed
  return poll.audience === 'public' || signedIn
}

/** Opciones cortas van en chips; largas o con imagen, en tarjetas. */
const CHIP_LABEL_MAX = 22
const CHIP_OPTIONS_MAX = 8

export function resolveDisplay(question: PollQuestion): Exclude<PollDisplay, 'auto'> | 'plain' {
  const display = question.display ?? 'auto'
  if (question.kind === 'grid') return display === 'table' ? 'table' : 'deck'
  if (question.kind !== 'single' && question.kind !== 'multiple') return 'plain'
  if (display === 'gate' && question.kind === 'single') return 'gate'
  if (display === 'chips' || display === 'cards') return display
  const short =
    question.options.length <= CHIP_OPTIONS_MAX &&
    question.options.every((option) => !option.imageSrc && !option.isOther && option.label.length <= CHIP_LABEL_MAX)
  return short ? 'chips' : 'cards'
}

/** Con códigos del documento se respetan; sin ninguno, se numera en orden. */
export function questionNumber(poll: Pick<Poll, 'questions'>, question: PollQuestion): string {
  if (poll.questions.some((item) => item.code)) return question.code ?? ''
  return String(poll.questions.indexOf(question) + 1)
}

/**
 * Preguntas como las cuenta el documento: el filtro de portada no suma y un bloque sin
 * número propio cuyas filas sí tienen número cuenta una por fila.
 */
export function countQuestions(poll: Pick<Poll, 'questions'>): number {
  return poll.questions.reduce((total, question) => {
    if (resolveDisplay(question) === 'gate') return total
    const rows = rowsOf(question)
    if (!question.code && rows.length && rows.every((row) => row.code)) return total + rows.length
    return total + 1
  }, 0)
}

export type PollStep =
  | { readonly key: string; readonly type: 'intro'; readonly gate?: PollQuestion }
  | { readonly key: string; readonly type: 'section'; readonly title: string }
  | { readonly key: string; readonly type: 'question'; readonly question: PollQuestion; readonly section?: string }
  | { readonly key: string; readonly type: 'submit' }

/**
 * Recorrido de una pregunta por pantalla: portada (con el filtro si lo hay), una pantalla
 * de entrada por sección, las preguntas visibles y el envío.
 */
export function buildSteps(poll: Pick<Poll, 'questions'>, ballot: Ballot): readonly PollStep[] {
  const visible = visibleQuestions(poll, ballot)
  const [first] = visible
  const gate = first && resolveDisplay(first) === 'gate' ? first : undefined
  const steps: PollStep[] = [{ key: 'intro', type: 'intro', gate }]
  let section: string | undefined
  for (const question of visible) {
    if (question === gate) {
      section = question.section
      continue
    }
    if (question.section && question.section !== section) {
      section = question.section
      steps.push({ key: `section:${question.id}`, type: 'section', title: question.section })
    }
    steps.push({ key: question.id, type: 'question', question, section })
  }
  steps.push({ key: 'submit', type: 'submit' })
  return steps
}

/** Abierta, sin votar y a la espera de que la persona se inscriba a la rodada. */
export function needsTicket(poll: Pick<Poll, 'isOpen' | 'hasVoted' | 'ridersOnly' | 'isInscribed'>): boolean {
  return poll.isOpen && !poll.hasVoted && poll.ridersOnly && !poll.isInscribed
}
