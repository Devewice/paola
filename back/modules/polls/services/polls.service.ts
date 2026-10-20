import { fail } from '../../../http/fail.js'
import { HTTP_STATUS } from '../../../http/constants.js'
import type { Parsed } from '../../../http/types.js'
import {
  POLL_ANSWER_TEXT,
  POLL_INSIGHTS,
  POLL_LIMITS,
  POLL_MESSAGES,
  POLL_VIEW_KINDS,
  POLL_VOTER_PREFIX,
} from '../constants/polls.constants.js'
import type { OperatorPollDto, PublicPollDto } from '../dtos/polls.dto.js'
import type { Poll, PollInsights, PollQuestion, PollViewKind, Voter } from '../interfaces/polls.interface.js'
import {
  clearResponses,
  countResponses,
  countViews,
  deletePoll,
  deleteResponse,
  findAnswers,
  findInscribedOutingIds,
  findPoll,
  findPolls,
  findPublishedPollIds,
  findResponses,
  findSeries,
  findSessionUserId,
  findVisitors,
  findVotedPollIds,
  insertPoll,
  insertResponse,
  outingExists,
  recordViews,
  replacePoll,
  updatePoll,
  type PollFilter,
  type StoredAnswer,
} from '../providers/polls.provider.js'
import { parseAnswers, parsePollDraft, parsePollPatch } from '../schemas/polls.schema.js'
import { tallyPoll } from './polls.results.js'

export type VoterIdentity = {
  sessionId: string
  anonKey: string
}

function isOpen(poll: Poll, now = Date.now()): boolean {
  if (poll.status !== 'open') return false
  if (poll.closesAt && new Date(poll.closesAt).getTime() <= now) return false
  return true
}

function validAnonKey(key: string): boolean {
  return key.length >= POLL_LIMITS.VOTER_KEY_MIN && key.length <= POLL_LIMITS.VOTER_KEY_MAX && /^[A-Za-z0-9-]+$/.test(key)
}

async function candidateKeys(identity: VoterIdentity): Promise<{ userId: string | null; keys: string[] }> {
  const userId = await findSessionUserId(identity.sessionId)
  const keys: string[] = []
  if (userId) keys.push(`${POLL_VOTER_PREFIX.ACCOUNT}${userId}`)
  if (validAnonKey(identity.anonKey)) keys.push(`${POLL_VOTER_PREFIX.ANON}${identity.anonKey}`)
  return { userId, keys }
}

async function toPublic(polls: Poll[], identity: VoterIdentity): Promise<PublicPollDto[]> {
  const ids = polls.map((poll) => poll.id)
  const outingIds = [...new Set(polls.map((poll) => poll.outingId).filter((id): id is string => Boolean(id)))]
  const { userId, keys } = await candidateKeys(identity)
  const [voted, answers, responses, inscribed] = await Promise.all([
    findVotedPollIds(keys, ids),
    findAnswers(ids),
    countResponses(ids),
    findInscribedOutingIds(userId, outingIds),
  ])
  return polls.map((poll) => {
    const open = isOpen(poll)
    const hasVoted = voted.has(poll.id)
    const showResults = poll.showResults && (hasVoted || !open)
    return {
      ...poll,
      isOpen: open,
      hasVoted,
      ridersOnly: Boolean(poll.outingId),
      isInscribed: poll.outingId ? inscribed.has(poll.outingId) : false,
      results: showResults
        ? tallyPoll(poll, answers.get(poll.id) ?? [], responses.get(poll.id) ?? 0, { withTexts: false, textLimit: 0 })
        : undefined,
    }
  })
}

export async function listPublicPolls(filter: Omit<PollFilter, 'includeDrafts'>, identity: VoterIdentity) {
  const polls = await findPolls({ ...filter, includeDrafts: false })
  return toPublic(polls, identity)
}

export async function readPublicPoll(id: string, identity: VoterIdentity): Promise<Parsed<PublicPollDto>> {
  const poll = await findPoll(id, false)
  if (!poll) return fail(HTTP_STATUS.NOT_FOUND, POLL_MESSAGES.NOT_FOUND)
  const [dto] = await toPublic([poll], identity)
  if (!dto) return fail(HTTP_STATUS.NOT_FOUND, POLL_MESSAGES.NOT_FOUND)
  return { ok: true, value: dto }
}

export async function vote(id: string, body: Record<string, unknown>, identity: VoterIdentity): Promise<Parsed<PublicPollDto>> {
  const poll = await findPoll(id, false)
  if (!poll) return fail(HTTP_STATUS.NOT_FOUND, POLL_MESSAGES.NOT_FOUND)
  if (!isOpen(poll)) return fail(HTTP_STATUS.CONFLICT, POLL_MESSAGES.NOT_OPEN)

  const { userId } = await candidateKeys(identity)
  if (poll.outingId) {
    const inscribed = await findInscribedOutingIds(userId, [poll.outingId])
    if (!inscribed.has(poll.outingId)) return fail(HTTP_STATUS.FORBIDDEN, POLL_MESSAGES.RIDERS_ONLY)
  }
  let voter: Voter
  if (poll.audience === 'account') {
    if (!userId) return fail(HTTP_STATUS.FORBIDDEN, POLL_MESSAGES.ACCOUNT_REQUIRED)
    voter = { key: `${POLL_VOTER_PREFIX.ACCOUNT}${userId}`, userId }
  } else if (userId) {
    voter = { key: `${POLL_VOTER_PREFIX.ACCOUNT}${userId}`, userId }
  } else {
    if (!validAnonKey(identity.anonKey)) return fail(HTTP_STATUS.BAD_REQUEST, POLL_MESSAGES.VOTER_REQUIRED)
    voter = { key: `${POLL_VOTER_PREFIX.ANON}${identity.anonKey}`, userId: null }
  }

  const voted = await findVotedPollIds((await candidateKeys(identity)).keys, [poll.id])
  if (voted.has(poll.id)) return fail(HTTP_STATUS.CONFLICT, POLL_MESSAGES.ALREADY_VOTED)

  const answers = parseAnswers(poll, body.answers)
  if (!answers.ok) return answers
  const inserted = await insertResponse(poll.id, voter, answers.value)
  if (!inserted) return fail(HTTP_STATUS.CONFLICT, POLL_MESSAGES.ALREADY_VOTED)
  return readPublicPoll(poll.id, identity)
}

export async function listOperatorPolls(): Promise<OperatorPollDto[]> {
  const polls = await findPolls({ includeDrafts: true })
  const ids = polls.map((poll) => poll.id)
  const [answers, responses, views] = await Promise.all([findAnswers(ids), countResponses(ids), countViews(ids)])
  return polls.map((poll) => ({
    ...poll,
    results: tallyPoll(poll, answers.get(poll.id) ?? [], responses.get(poll.id) ?? 0, {
      withTexts: true,
      textLimit: POLL_LIMITS.OPERATOR_TEXTS,
    }),
    stats: views.get(poll.id) ?? { impressions: 0, visits: 0, visitors: 0 },
  }))
}

export async function editPoll(id: string, body: Record<string, unknown>): Promise<Parsed<{ id: string }>> {
  const parsed = parsePollDraft(body)
  if (!parsed.ok) return parsed
  if (parsed.value.outingId && !(await outingExists(parsed.value.outingId))) {
    return fail(HTTP_STATUS.BAD_REQUEST, POLL_MESSAGES.OUTING_INVALID)
  }
  if (!(await replacePoll(id, parsed.value))) return fail(HTTP_STATUS.NOT_FOUND, POLL_MESSAGES.NOT_FOUND)
  return { ok: true, value: { id } }
}

export async function recordPollViews(body: Record<string, unknown>, identity: VoterIdentity): Promise<Parsed<{ saved: number }>> {
  const kind = body.kind
  if (!(POLL_VIEW_KINDS as readonly unknown[]).includes(kind)) return fail(HTTP_STATUS.BAD_REQUEST, POLL_MESSAGES.VIEW_INVALID)
  const requested = Array.isArray(body.pollIds)
    ? [...new Set(body.pollIds.filter((id): id is string => typeof id === 'string' && id.length > 0 && id.length <= 64))]
    : []
  if (!requested.length || requested.length > POLL_INSIGHTS.VIEW_BATCH_MAX) {
    return fail(HTTP_STATUS.BAD_REQUEST, POLL_MESSAGES.VIEW_INVALID)
  }
  const { userId } = await candidateKeys(identity)
  let viewer: Voter
  if (userId) viewer = { key: `${POLL_VOTER_PREFIX.ACCOUNT}${userId}`, userId }
  else if (validAnonKey(identity.anonKey)) viewer = { key: `${POLL_VOTER_PREFIX.ANON}${identity.anonKey}`, userId: null }
  else return { ok: true, value: { saved: 0 } }
  const pollIds = await findPublishedPollIds(requested)
  const saved = await recordViews(pollIds, viewer, kind as PollViewKind, POLL_INSIGHTS.VIEW_COOLDOWN_MIN)
  return { ok: true, value: { saved } }
}

function describeAnswer(question: PollQuestion, rows: readonly StoredAnswer[]): string {
  const label = (optionId: string | null) => question.options.find((option) => option.id === optionId)?.label ?? ''
  let text = ''
  if (question.kind === 'single' || question.kind === 'multiple') {
    text = rows
      .map((row) => {
        const option = question.options.find((item) => item.id === row.optionId)
        if (!option) return ''
        return option.isOther && row.valueText ? `${POLL_ANSWER_TEXT.OTHER}: ${row.valueText}` : option.label
      })
      .filter(Boolean)
      .join(POLL_ANSWER_TEXT.SEPARATOR)
  } else if (question.kind === 'ranking') {
    text = [...rows]
      .sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0))
      .map((row) => label(row.optionId))
      .filter(Boolean)
      .join(POLL_ANSWER_TEXT.RANK_SEPARATOR)
  } else if (question.kind === 'grid') {
    text = question.rows
      .map((gridRow) => {
        const picked = rows.find((row) => row.rowId === gridRow.id)
        return picked ? `${gridRow.label}${POLL_ANSWER_TEXT.GRID_PAIR}${label(picked.optionId)}` : ''
      })
      .filter(Boolean)
      .join(POLL_ANSWER_TEXT.GRID_SEPARATOR)
  } else if (question.kind === 'scale') {
    const value = rows[0]?.valueNumber
    text = value === null || value === undefined ? '' : String(value)
  } else {
    text = rows[0]?.valueText ?? ''
  }
  return text.slice(0, POLL_INSIGHTS.ANSWER_PREVIEW_MAX)
}

export async function readInsights(id: string): Promise<Parsed<PollInsights>> {
  const poll = await findPoll(id, true)
  if (!poll) return fail(HTTP_STATUS.NOT_FOUND, POLL_MESSAGES.NOT_FOUND)
  const [views, responses, series, visitors, stored, answers] = await Promise.all([
    countViews([id]),
    countResponses([id]),
    findSeries(id, POLL_INSIGHTS.SERIES_DAYS),
    findVisitors(id, POLL_INSIGHTS.VISITORS_MAX),
    findResponses(id, POLL_INSIGHTS.RESPONSES_MAX),
    findAnswers([id]),
  ])
  const byResponse = new Map<string, StoredAnswer[]>()
  for (const answer of answers.get(id) ?? []) {
    byResponse.set(answer.responseId, [...(byResponse.get(answer.responseId) ?? []), answer])
  }
  return {
    ok: true,
    value: {
      stats: { ...(views.get(id) ?? { impressions: 0, visits: 0, visitors: 0 }), responses: responses.get(id) ?? 0 },
      series,
      visitors,
      responses: stored.map((response) => {
        const own = byResponse.get(response.id) ?? []
        return {
          ...response,
          answers: poll.questions
            .map((question) => ({
              questionId: question.id,
              text: describeAnswer(question, own.filter((row) => row.questionId === question.id)),
            }))
            .filter((item) => item.text),
        }
      }),
    },
  }
}

export async function removeResponse(pollId: string, responseId: string): Promise<Parsed<{ id: string }>> {
  const affected = await deleteResponse(pollId, responseId)
  if (!affected) return fail(HTTP_STATUS.NOT_FOUND, POLL_MESSAGES.RESPONSE_NOT_FOUND)
  return { ok: true, value: { id: responseId } }
}

export async function clearPollResponses(pollId: string): Promise<Parsed<{ removed: number }>> {
  const poll = await findPoll(pollId, true)
  if (!poll) return fail(HTTP_STATUS.NOT_FOUND, POLL_MESSAGES.NOT_FOUND)
  return { ok: true, value: { removed: await clearResponses(pollId) } }
}

export async function createPoll(body: Record<string, unknown>): Promise<Parsed<{ id: string }>> {
  const parsed = parsePollDraft(body)
  if (!parsed.ok) return parsed
  if (parsed.value.outingId && !(await outingExists(parsed.value.outingId))) {
    return fail(HTTP_STATUS.BAD_REQUEST, POLL_MESSAGES.OUTING_INVALID)
  }
  const id = await insertPoll(parsed.value)
  return { ok: true, value: { id } }
}

export async function patchPoll(id: string, body: Record<string, unknown>): Promise<Parsed<{ id: string }>> {
  const parsed = parsePollPatch(body)
  if (!parsed.ok) return parsed
  const affected = await updatePoll(id, parsed.value)
  if (!affected) return fail(HTTP_STATUS.NOT_FOUND, POLL_MESSAGES.NOT_FOUND)
  return { ok: true, value: { id } }
}

export async function removePoll(id: string): Promise<Parsed<{ id: string }>> {
  const affected = await deletePoll(id)
  if (!affected) return fail(HTTP_STATUS.NOT_FOUND, POLL_MESSAGES.NOT_FOUND)
  return { ok: true, value: { id } }
}
