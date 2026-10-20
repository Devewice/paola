import { randomUUID } from 'node:crypto'
import type { Knex } from 'knex'
import { getDb } from '../../../db/knex.js'
import { POLL_TABLES } from '../constants/polls.constants.js'
import type {
  AnswerRow,
  Poll,
  PollCondition,
  PollDayPoint,
  PollOption,
  PollRow,
  PollStats,
  PollViewKind,
  PollVisitor,
  Voter,
} from '../interfaces/polls.interface.js'
import type { PollDraft, PollPatch, QuestionDraft } from '../schemas/polls.schema.js'
import { toOption, toPollBase, toQuestion, toRow } from '../schemas/polls.schema.js'

export type StoredAnswer = AnswerRow & { responseId: string }

export type PollFilter = {
  includeDrafts: boolean
  outingId?: string
  featured?: boolean
  ids?: readonly string[]
}

async function hydrate(rows: Record<string, unknown>[]): Promise<Poll[]> {
  if (!rows.length) return []
  const pollIds = rows.map((row) => String(row.id))
  const questionRows = (await getDb()(POLL_TABLES.QUESTIONS)
    .whereIn('poll_id', pollIds)
    .orderBy('position', 'asc')) as Record<string, unknown>[]
  const questionIds = questionRows.map((row) => String(row.id))
  const optionRows = questionIds.length
    ? ((await getDb()(POLL_TABLES.OPTIONS)
        .whereIn('question_id', questionIds)
        .orderBy('position', 'asc')) as Record<string, unknown>[])
    : []
  const gridRows = questionIds.length
    ? ((await getDb()(POLL_TABLES.ROWS)
        .whereIn('question_id', questionIds)
        .orderBy('position', 'asc')) as Record<string, unknown>[])
    : []

  const optionsByQuestion = new Map<string, PollOption[]>()
  for (const row of optionRows) {
    const key = String(row.question_id)
    optionsByQuestion.set(key, [...(optionsByQuestion.get(key) ?? []), toOption(row)])
  }
  const rowsByQuestion = new Map<string, PollRow[]>()
  for (const row of gridRows) {
    const key = String(row.question_id)
    rowsByQuestion.set(key, [...(rowsByQuestion.get(key) ?? []), toRow(row)])
  }

  return rows.map((row) => ({
    ...toPollBase(row),
    questions: questionRows
      .filter((question) => String(question.poll_id) === String(row.id))
      .map((question) =>
        toQuestion(
          question,
          optionsByQuestion.get(String(question.id)) ?? [],
          rowsByQuestion.get(String(question.id)) ?? [],
        ),
      ),
  }))
}

export async function findPolls(filter: PollFilter): Promise<Poll[]> {
  const query = getDb()(POLL_TABLES.POLLS)
    .leftJoin('outings', 'outings.id', `${POLL_TABLES.POLLS}.outing_id`)
    .select(`${POLL_TABLES.POLLS}.*`, 'outings.title as outing_title')
    .orderBy(`${POLL_TABLES.POLLS}.created_at`, 'desc')
  if (!filter.includeDrafts) query.whereNot(`${POLL_TABLES.POLLS}.status`, 'draft')
  if (filter.outingId) query.where(`${POLL_TABLES.POLLS}.outing_id`, filter.outingId)
  if (filter.featured) query.where(`${POLL_TABLES.POLLS}.featured`, true)
  if (filter.ids) query.whereIn(`${POLL_TABLES.POLLS}.id`, [...filter.ids])
  return hydrate((await query) as Record<string, unknown>[])
}

export async function findPoll(id: string, includeDrafts: boolean): Promise<Poll | null> {
  const [poll] = await findPolls({ includeDrafts, ids: [id] })
  return poll ?? null
}

export async function outingExists(id: string): Promise<boolean> {
  const row = await getDb()('outings').select('id').where({ id }).first()
  return Boolean(row)
}

export async function findInscribedOutingIds(userId: string | null, outingIds: readonly string[]): Promise<Set<string>> {
  if (!userId || !outingIds.length) return new Set()
  const rows = (await getDb()('tickets')
    .whereIn('outing_id', [...outingIds])
    .where({ user_id: userId })
    .select('outing_id as outingId')) as Record<string, unknown>[]
  return new Set(rows.map((row) => String(row.outingId)))
}

/** `db` e `id` existen para migraciones que siembran una encuesta fija. */
export async function insertPoll(draft: PollDraft, options: { db?: Knex; id?: string } = {}): Promise<string> {
  const pollId = options.id ?? randomUUID()
  await (options.db ?? getDb()).transaction(async (trx) => {
    if (draft.featured) await trx(POLL_TABLES.POLLS).update({ featured: false })
    await trx(POLL_TABLES.POLLS).insert({
      id: pollId,
      title: draft.title,
      description: draft.description ?? null,
      audience: draft.audience,
      status: draft.status,
      featured: draft.featured,
      outing_id: draft.outingId ?? null,
      closes_at: draft.closesAt ?? null,
      ...(draft.showResults === false ? { show_results: false } : {}),
    })
    const inserted: { id: string; optionIds: string[] }[] = []
    for (const [position, question] of draft.questions.entries()) {
      const questionId = randomUUID()
      const optionIds = question.options.map(() => randomUUID())
      let showIf: PollCondition | null = null
      if (question.showIf) {
        const target = inserted[question.showIf.question]
        if (target) {
          showIf = {
            questionId: target.id,
            optionIds: question.showIf.options.map((index) => target.optionIds[index] ?? '').filter(Boolean),
            mode: question.showIf.mode,
          }
        }
      }
      await trx(POLL_TABLES.QUESTIONS).insert({
        id: questionId,
        poll_id: pollId,
        position,
        kind: question.kind,
        prompt: question.prompt,
        help: question.help ?? null,
        section: question.section ?? null,
        required: question.required,
        max_choices: question.maxChoices ?? null,
        scale_min: question.scaleMin ?? null,
        scale_max: question.scaleMax ?? null,
        scale_min_label: question.scaleMinLabel ?? null,
        scale_max_label: question.scaleMaxLabel ?? null,
        show_if: showIf ? JSON.stringify(showIf) : null,
        ...(question.code ? { code: question.code } : {}),
        ...(question.display ? { display: question.display } : {}),
        ...(question.tone ? { tone: question.tone } : {}),
      })
      if (question.options.length) {
        await trx(POLL_TABLES.OPTIONS).insert(
          question.options.map((option, index) => ({
            id: optionIds[index],
            question_id: questionId,
            position: index,
            label: option.label,
            image_src: option.imageSrc ?? null,
            is_other: option.isOther === true,
            exclusive: option.exclusive === true,
          })),
        )
      }
      if (question.rows.length) {
        await trx(POLL_TABLES.ROWS).insert(
          question.rows.map((row, index) => ({
            id: randomUUID(),
            question_id: questionId,
            position: index,
            label: row.label,
            ...(row.code ? { code: row.code } : {}),
          })),
        )
      }
      inserted.push({ id: questionId, optionIds })
    }
  })
  return pollId
}

export async function updatePoll(id: string, patch: PollPatch): Promise<number> {
  const changes: Record<string, unknown> = {}
  if (patch.status !== undefined) changes.status = patch.status
  if (patch.featured !== undefined) changes.featured = patch.featured
  if (patch.showResults !== undefined) changes.show_results = patch.showResults
  if (patch.closesAt !== undefined) changes.closes_at = patch.closesAt
  if (!Object.keys(changes).length) return 1
  return getDb().transaction(async (trx): Promise<number> => {
    if (patch.featured) await trx(POLL_TABLES.POLLS).whereNot({ id }).update({ featured: false })
    return Number(await trx(POLL_TABLES.POLLS).where({ id }).update(changes))
  })
}

function questionColumns(question: QuestionDraft, showIf: PollCondition | null): Record<string, unknown> {
  return {
    kind: question.kind,
    prompt: question.prompt,
    help: question.help ?? null,
    section: question.section ?? null,
    required: question.required,
    max_choices: question.maxChoices ?? null,
    scale_min: question.scaleMin ?? null,
    scale_max: question.scaleMax ?? null,
    scale_min_label: question.scaleMinLabel ?? null,
    scale_max_label: question.scaleMaxLabel ?? null,
    show_if: showIf ? JSON.stringify(showIf) : null,
    code: question.code ?? null,
    display: question.display ?? null,
    tone: question.tone ?? null,
  }
}

function resolveCondition(
  question: QuestionDraft,
  saved: readonly { id: string; optionIds: string[] }[],
): PollCondition | null {
  if (!question.showIf) return null
  const target = saved[question.showIf.question]
  if (!target) return null
  return {
    questionId: target.id,
    optionIds: question.showIf.options.map((index) => target.optionIds[index] ?? '').filter(Boolean),
    mode: question.showIf.mode,
  }
}

function ids(rows: readonly Record<string, unknown>[]): string[] {
  return rows.map((row) => String(row.id))
}

/**
 * Reescribe la encuesta conservando lo que trae `id`: así las respuestas a preguntas y opciones
 * que siguen ahí no se pierden. Lo que se quita se borra con sus respuestas; si una pregunta
 * cambia de tipo, sus respuestas viejas ya no cuadran y también se borran.
 */
export async function replacePoll(id: string, draft: PollDraft): Promise<boolean> {
  return getDb().transaction(async (trx): Promise<boolean> => {
    const poll = await trx(POLL_TABLES.POLLS).where({ id }).first('id')
    if (!poll) return false
    if (draft.featured) await trx(POLL_TABLES.POLLS).whereNot({ id }).update({ featured: false })
    await trx(POLL_TABLES.POLLS).where({ id }).update({
      title: draft.title,
      description: draft.description ?? null,
      audience: draft.audience,
      status: draft.status,
      featured: draft.featured,
      show_results: draft.showResults,
      outing_id: draft.outingId ?? null,
      closes_at: draft.closesAt ?? null,
    })

    const oldQuestions = (await trx(POLL_TABLES.QUESTIONS).where({ poll_id: id }).select('id', 'kind')) as Record<string, unknown>[]
    const oldKind = new Map(oldQuestions.map((row) => [String(row.id), String(row.kind)]))
    const oldQuestionIds = [...oldKind.keys()]
    const oldOptions = oldQuestionIds.length
      ? ((await trx(POLL_TABLES.OPTIONS).whereIn('question_id', oldQuestionIds).select('id', 'question_id')) as Record<string, unknown>[])
      : []
    const oldRows = oldQuestionIds.length
      ? ((await trx(POLL_TABLES.ROWS).whereIn('question_id', oldQuestionIds).select('id', 'question_id')) as Record<string, unknown>[])
      : []
    const optionOwner = new Map(oldOptions.map((row) => [String(row.id), String(row.question_id)]))
    const rowOwner = new Map(oldRows.map((row) => [String(row.id), String(row.question_id)]))

    const keptQuestions = new Set<string>()
    const keptOptions = new Set<string>()
    const keptRows = new Set<string>()
    const saved: { id: string; optionIds: string[] }[] = []

    for (const [position, question] of draft.questions.entries()) {
      const reused = question.id && oldKind.has(question.id) && !keptQuestions.has(question.id) ? question.id : undefined
      const questionId = reused ?? randomUUID()
      keptQuestions.add(questionId)
      const kindChanged = Boolean(reused) && oldKind.get(questionId) !== question.kind
      if (kindChanged) await trx(POLL_TABLES.ANSWERS).where({ question_id: questionId }).delete()

      const keep = (draftId: string | undefined, owners: Map<string, string>, kept: Set<string>) =>
        draftId && reused && !kindChanged && owners.get(draftId) === questionId && !kept.has(draftId) ? draftId : undefined

      const columns = { position, ...questionColumns(question, resolveCondition(question, saved)) }
      if (reused) await trx(POLL_TABLES.QUESTIONS).where({ id: questionId }).update(columns)
      else await trx(POLL_TABLES.QUESTIONS).insert({ id: questionId, poll_id: id, ...columns })

      const optionIds: string[] = []
      for (const [index, option] of question.options.entries()) {
        const existing = keep(option.id, optionOwner, keptOptions)
        const optionId = existing ?? randomUUID()
        keptOptions.add(optionId)
        optionIds.push(optionId)
        const values = {
          position: index,
          label: option.label,
          image_src: option.imageSrc ?? null,
          is_other: option.isOther === true,
          exclusive: option.exclusive === true,
        }
        if (existing) await trx(POLL_TABLES.OPTIONS).where({ id: optionId }).update(values)
        else await trx(POLL_TABLES.OPTIONS).insert({ id: optionId, question_id: questionId, ...values })
      }

      for (const [index, row] of question.rows.entries()) {
        const existing = keep(row.id, rowOwner, keptRows)
        const rowId = existing ?? randomUUID()
        keptRows.add(rowId)
        const values = { position: index, label: row.label, code: row.code ?? null }
        if (existing) await trx(POLL_TABLES.ROWS).where({ id: rowId }).update(values)
        else await trx(POLL_TABLES.ROWS).insert({ id: rowId, question_id: questionId, ...values })
      }

      saved.push({ id: questionId, optionIds })
    }

    const goneOptions = ids(oldOptions).filter((optionId) => !keptOptions.has(optionId))
    if (goneOptions.length) {
      await trx(POLL_TABLES.ANSWERS).whereIn('option_id', goneOptions).delete()
      await trx(POLL_TABLES.OPTIONS).whereIn('id', goneOptions).delete()
    }
    const goneRows = ids(oldRows).filter((rowId) => !keptRows.has(rowId))
    if (goneRows.length) {
      await trx(POLL_TABLES.ANSWERS).whereIn('row_id', goneRows).delete()
      await trx(POLL_TABLES.ROWS).whereIn('id', goneRows).delete()
    }
    const goneQuestions = oldQuestionIds.filter((questionId) => !keptQuestions.has(questionId))
    if (goneQuestions.length) {
      await trx(POLL_TABLES.ANSWERS).whereIn('question_id', goneQuestions).delete()
      await trx(POLL_TABLES.QUESTIONS).whereIn('id', goneQuestions).delete()
    }
    return true
  })
}

export async function deletePoll(id: string): Promise<number> {
  return getDb()(POLL_TABLES.POLLS).where({ id }).delete()
}

export async function deleteResponse(pollId: string, responseId: string): Promise<number> {
  return getDb()(POLL_TABLES.RESPONSES).where({ id: responseId, poll_id: pollId }).delete()
}

export async function clearResponses(pollId: string): Promise<number> {
  return getDb()(POLL_TABLES.RESPONSES).where({ poll_id: pollId }).delete()
}

export async function findPublishedPollIds(pollIds: readonly string[]): Promise<string[]> {
  if (!pollIds.length) return []
  const rows = (await getDb()(POLL_TABLES.POLLS)
    .whereIn('id', [...pollIds])
    .whereNot('status', 'draft')
    .select('id')) as Record<string, unknown>[]
  return ids(rows)
}

/** Guarda una vista por encuesta salvo que ese visitante ya tenga una igual reciente. */
export async function recordViews(
  pollIds: readonly string[],
  viewer: Voter,
  kind: PollViewKind,
  cooldownMinutes: number,
): Promise<number> {
  if (!pollIds.length) return 0
  const recent = (await getDb()(POLL_TABLES.VIEWS)
    .whereIn('poll_id', [...pollIds])
    .where({ viewer_key: viewer.key, kind })
    .whereRaw('created_at >= NOW() - INTERVAL ? MINUTE', [cooldownMinutes])
    .select('poll_id as pollId')) as Record<string, unknown>[]
  const skip = new Set(recent.map((row) => String(row.pollId)))
  const rows = pollIds
    .filter((pollId) => !skip.has(pollId))
    .map((pollId) => ({ poll_id: pollId, viewer_key: viewer.key, user_id: viewer.userId, kind }))
  if (rows.length) await getDb()(POLL_TABLES.VIEWS).insert(rows)
  return rows.length
}

export async function countViews(pollIds: readonly string[]): Promise<Map<string, PollStats>> {
  const result = new Map<string, PollStats>()
  if (!pollIds.length) return result
  const rows = (await getDb()(POLL_TABLES.VIEWS)
    .whereIn('poll_id', [...pollIds])
    .groupBy('poll_id')
    .select(
      'poll_id as pollId',
      getDb().raw("SUM(kind = 'impression') as impressions"),
      getDb().raw("SUM(kind = 'visit') as visits"),
      getDb().raw('COUNT(DISTINCT viewer_key) as visitors'),
    )) as Record<string, unknown>[]
  for (const row of rows) {
    result.set(String(row.pollId), {
      impressions: Number(row.impressions ?? 0),
      visits: Number(row.visits ?? 0),
      visitors: Number(row.visitors ?? 0),
    })
  }
  return result
}

type UserCard = { name?: string; whatsapp?: string }

async function findUserCards(userIds: readonly string[]): Promise<Map<string, UserCard>> {
  const result = new Map<string, UserCard>()
  const unique = [...new Set(userIds.filter(Boolean))]
  if (!unique.length) return result
  const rows = (await getDb()(POLL_TABLES.USERS)
    .whereIn('id', unique)
    .select('id', 'alias', 'display_name as displayName', 'full_name as fullName', 'whatsapp')) as Record<string, unknown>[]
  for (const row of rows) {
    const name = [row.displayName, row.fullName, row.alias].find((value) => typeof value === 'string' && value.trim())
    result.set(String(row.id), {
      name: typeof name === 'string' ? name.trim() : undefined,
      whatsapp: typeof row.whatsapp === 'string' && row.whatsapp.trim() ? row.whatsapp.trim() : undefined,
    })
  }
  return result
}

function isoDate(value: unknown): string {
  const date = value instanceof Date ? value : new Date(String(value))
  return Number.isNaN(date.valueOf()) ? '' : date.toISOString()
}

export async function findVisitors(pollId: string, limit: number): Promise<PollVisitor[]> {
  const rows = (await getDb()(POLL_TABLES.VIEWS)
    .where({ poll_id: pollId })
    .groupBy('viewer_key')
    .select(
      'viewer_key as viewerKey',
      getDb().raw('MAX(user_id) as userId'),
      getDb().raw("SUM(kind = 'impression') as impressions"),
      getDb().raw("SUM(kind = 'visit') as visits"),
      getDb().raw('MIN(created_at) as firstSeen'),
      getDb().raw('MAX(created_at) as lastSeen'),
    )
    .orderBy('lastSeen', 'desc')
    .limit(limit)) as Record<string, unknown>[]
  const responses = (await getDb()(POLL_TABLES.RESPONSES)
    .where({ poll_id: pollId })
    .select('voter_key as voterKey', 'user_id as userId')) as Record<string, unknown>[]
  const votedKeys = new Set(responses.map((row) => String(row.voterKey)))
  const votedUsers = new Set(responses.map((row) => (row.userId ? String(row.userId) : '')).filter(Boolean))
  const users = await findUserCards(rows.map((row) => (row.userId ? String(row.userId) : '')))
  return rows.map((row) => {
    const key = String(row.viewerKey)
    const userId = row.userId ? String(row.userId) : undefined
    const card = userId ? users.get(userId) : undefined
    return {
      key,
      userId,
      name: card?.name,
      whatsapp: card?.whatsapp,
      impressions: Number(row.impressions ?? 0),
      visits: Number(row.visits ?? 0),
      firstSeen: isoDate(row.firstSeen),
      lastSeen: isoDate(row.lastSeen),
      responded: votedKeys.has(key) || Boolean(userId && votedUsers.has(userId)),
    }
  })
}

export async function findSeries(pollId: string, days: number): Promise<PollDayPoint[]> {
  const day = "DATE_FORMAT(created_at, '%Y-%m-%d')"
  const views = (await getDb()(POLL_TABLES.VIEWS)
    .where({ poll_id: pollId })
    .whereRaw('created_at >= CURDATE() - INTERVAL ? DAY', [days - 1])
    .groupByRaw(day)
    .select(
      getDb().raw(`${day} as day`),
      getDb().raw("SUM(kind = 'impression') as impressions"),
      getDb().raw("SUM(kind = 'visit') as visits"),
    )) as Record<string, unknown>[]
  const votes = (await getDb()(POLL_TABLES.RESPONSES)
    .where({ poll_id: pollId })
    .whereRaw('created_at >= CURDATE() - INTERVAL ? DAY', [days - 1])
    .groupByRaw(day)
    .select(getDb().raw(`${day} as day`), getDb().raw('COUNT(*) as responses'))) as Record<string, unknown>[]
  const points = new Map<string, PollDayPoint>()
  const point = (key: string) => {
    const current = points.get(key) ?? { day: key, impressions: 0, visits: 0, responses: 0 }
    points.set(key, current)
    return current
  }
  for (const row of views) {
    const current = point(String(row.day))
    current.impressions = Number(row.impressions ?? 0)
    current.visits = Number(row.visits ?? 0)
  }
  for (const row of votes) point(String(row.day)).responses = Number(row.responses ?? 0)
  return [...points.values()].sort((a, b) => a.day.localeCompare(b.day))
}

export type StoredResponse = { id: string; createdAt: string; userId?: string; name?: string }

export async function findResponses(pollId: string, limit: number): Promise<StoredResponse[]> {
  const rows = (await getDb()(POLL_TABLES.RESPONSES)
    .where({ poll_id: pollId })
    .orderBy('created_at', 'desc')
    .limit(limit)
    .select('id', 'created_at as createdAt', 'user_id as userId')) as Record<string, unknown>[]
  const users = await findUserCards(rows.map((row) => (row.userId ? String(row.userId) : '')))
  return rows.map((row) => {
    const userId = row.userId ? String(row.userId) : undefined
    return { id: String(row.id), createdAt: isoDate(row.createdAt), userId, name: userId ? users.get(userId)?.name : undefined }
  })
}

export async function findAnswers(pollIds: readonly string[]): Promise<Map<string, StoredAnswer[]>> {
  const result = new Map<string, StoredAnswer[]>()
  if (!pollIds.length) return result
  const rows = (await getDb()(POLL_TABLES.ANSWERS)
    .join(POLL_TABLES.RESPONSES, `${POLL_TABLES.RESPONSES}.id`, `${POLL_TABLES.ANSWERS}.response_id`)
    .whereIn(`${POLL_TABLES.RESPONSES}.poll_id`, [...pollIds])
    .orderBy(`${POLL_TABLES.RESPONSES}.created_at`, 'desc')
    .select(
      `${POLL_TABLES.RESPONSES}.poll_id as pollId`,
      `${POLL_TABLES.ANSWERS}.response_id as responseId`,
      `${POLL_TABLES.ANSWERS}.question_id as questionId`,
      `${POLL_TABLES.ANSWERS}.option_id as optionId`,
      `${POLL_TABLES.ANSWERS}.row_id as rowId`,
      `${POLL_TABLES.ANSWERS}.rank as rank`,
      `${POLL_TABLES.ANSWERS}.value_number as valueNumber`,
      `${POLL_TABLES.ANSWERS}.value_text as valueText`,
    )) as Record<string, unknown>[]
  for (const row of rows) {
    const pollId = String(row.pollId)
    const answer: StoredAnswer = {
      responseId: String(row.responseId),
      questionId: String(row.questionId),
      optionId: row.optionId === null ? null : String(row.optionId),
      rowId: row.rowId === null || row.rowId === undefined ? null : String(row.rowId),
      rank: row.rank === null ? null : Number(row.rank),
      valueNumber: row.valueNumber === null ? null : Number(row.valueNumber),
      valueText: row.valueText === null ? null : String(row.valueText),
    }
    result.set(pollId, [...(result.get(pollId) ?? []), answer])
  }
  return result
}

export async function countResponses(pollIds: readonly string[]): Promise<Map<string, number>> {
  const result = new Map<string, number>()
  if (!pollIds.length) return result
  const rows = (await getDb()(POLL_TABLES.RESPONSES)
    .whereIn('poll_id', [...pollIds])
    .groupBy('poll_id')
    .select('poll_id as pollId')
    .count({ total: '*' })) as Record<string, unknown>[]
  for (const row of rows) result.set(String(row.pollId), Number(row.total))
  return result
}

export async function findVotedPollIds(voterKeys: readonly string[], pollIds: readonly string[]): Promise<Set<string>> {
  if (!voterKeys.length || !pollIds.length) return new Set()
  const rows = (await getDb()(POLL_TABLES.RESPONSES)
    .whereIn('poll_id', [...pollIds])
    .whereIn('voter_key', [...voterKeys])
    .select('poll_id as pollId')) as Record<string, unknown>[]
  return new Set(rows.map((row) => String(row.pollId)))
}

export async function insertResponse(pollId: string, voter: Voter, answers: readonly AnswerRow[]): Promise<boolean> {
  try {
    await getDb().transaction(async (trx) => {
      const responseId = randomUUID()
      await trx(POLL_TABLES.RESPONSES).insert({
        id: responseId,
        poll_id: pollId,
        voter_key: voter.key,
        user_id: voter.userId,
      })
      if (answers.length) {
        await trx(POLL_TABLES.ANSWERS).insert(
          answers.map((answer) => ({
            response_id: responseId,
            question_id: answer.questionId,
            option_id: answer.optionId,
            row_id: answer.rowId,
            rank: answer.rank,
            value_number: answer.valueNumber,
            value_text: answer.valueText,
          })),
        )
      }
    })
    return true
  } catch (error) {
    const code = (error as { code?: string }).code
    if (code === 'ER_DUP_ENTRY') return false
    throw error
  }
}

export async function findSessionUserId(sessionId: string): Promise<string | null> {
  if (!sessionId) return null
  const row = await getDb()(POLL_TABLES.SESSIONS)
    .select('user_id as userId', 'expires_at as expiresAt')
    .where({ id: sessionId })
    .first()
  if (!row?.userId) return null
  const expiresAt = new Date(String(row.expiresAt))
  if (Number.isNaN(expiresAt.valueOf()) || expiresAt.getTime() < Date.now()) return null
  return String(row.userId)
}
