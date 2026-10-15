import { randomUUID } from 'node:crypto'
import type { Knex } from 'knex'
import { getDb } from '../../../db/knex.js'
import { POLL_TABLES } from '../constants/polls.constants.js'
import type { AnswerRow, Poll, PollCondition, PollOption, PollRow, Voter } from '../interfaces/polls.interface.js'
import type { PollDraft, PollPatch } from '../schemas/polls.schema.js'
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
          question.rows.map((label, index) => ({
            id: randomUUID(),
            question_id: questionId,
            position: index,
            label,
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
  if (patch.closesAt !== undefined) changes.closes_at = patch.closesAt
  if (!Object.keys(changes).length) return 1
  return getDb().transaction(async (trx): Promise<number> => {
    if (patch.featured) await trx(POLL_TABLES.POLLS).whereNot({ id }).update({ featured: false })
    return Number(await trx(POLL_TABLES.POLLS).where({ id }).update(changes))
  })
}

export async function deletePoll(id: string): Promise<number> {
  return getDb()(POLL_TABLES.POLLS).where({ id }).delete()
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
