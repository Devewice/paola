import { fail } from '../../../http/fail.js'
import { HTTP_STATUS } from '../../../http/constants.js'
import type { Parsed } from '../../../http/types.js'
import { buildXlsx, type XlsxCell } from '../../../shared/xlsx.js'
import { POLL_EXPORT, POLL_MESSAGES } from '../constants/polls.constants.js'
import type { Poll, PollQuestion } from '../interfaces/polls.interface.js'
import { countResponses, findAnswers, findPoll, findResponses, pushTo, type StoredAnswer } from '../providers/polls.provider.js'
import { answerText, optionLabel, tallyPoll } from './polls.results.js'

export type PollExport = { fileName: string; data: Buffer }

const stamp = new Intl.DateTimeFormat(POLL_EXPORT.DATE_LOCALE, {
  timeZone: POLL_EXPORT.TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
})

function localStamp(iso: string): string {
  const date = new Date(iso)
  return Number.isNaN(date.valueOf()) ? iso : stamp.format(date)
}

function questionTitle(question: PollQuestion): string {
  return question.code ? `${question.code}. ${question.prompt}` : question.prompt
}

type Column = { questionId: string; title: string; value: (rows: readonly StoredAnswer[]) => string }

/** Una columna por pregunta; las cuadrículas, una por fila para poder filtrar en Excel. */
function columnsOf(poll: Poll): Column[] {
  return poll.questions.flatMap((question): Column[] => {
    if (question.kind !== 'grid') {
      return [{ questionId: question.id, title: questionTitle(question), value: (rows) => answerText(question, rows) }]
    }
    return question.rows.map((gridRow) => ({
      questionId: question.id,
      title: `${questionTitle(question)}${POLL_EXPORT.GRID_COLUMN}${gridRow.label}`,
      value: (rows) => optionLabel(question, rows.find((row) => row.rowId === gridRow.id)?.optionId ?? null),
    }))
  })
}

function summaryRows(poll: Poll, answers: readonly StoredAnswer[], responses: number): XlsxCell[][] {
  const results = tallyPoll(poll, answers, responses, { withTexts: false, textLimit: 0 })
  const rows: XlsxCell[][] = [[...POLL_EXPORT.SUMMARY_HEADERS], [POLL_EXPORT.TOTAL, '', responses]]
  poll.questions.forEach((question, index) => {
    const result = results.questions[index]
    if (!result) return
    const title = questionTitle(question)
    if (question.kind === 'grid') {
      for (const row of result.rows ?? []) {
        const label = question.rows.find((item) => item.id === row.rowId)?.label ?? ''
        for (const option of row.options) {
          rows.push([`${title}${POLL_EXPORT.GRID_COLUMN}${label}`, optionLabel(question, option.optionId), option.count, option.percent])
        }
      }
    } else if (question.kind === 'scale') {
      for (const point of result.distribution ?? []) {
        const percent = result.answered ? Math.round((point.count / result.answered) * 100) : 0
        rows.push([title, String(point.value), point.count, percent])
      }
      rows.push([title, POLL_EXPORT.AVERAGE, result.average ?? null])
    } else if (question.kind === 'text') {
      rows.push([title, POLL_EXPORT.WRITTEN, result.answered])
    } else {
      for (const option of result.options) {
        rows.push([title, optionLabel(question, option.optionId), option.count, option.percent, option.averageRank ?? null])
      }
    }
  })
  return rows
}

function slug(text: string): string {
  return (
    text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || POLL_EXPORT.FILE_PREFIX
  )
}

export async function exportPollResponses(id: string): Promise<Parsed<PollExport>> {
  const poll = await findPoll(id, true)
  if (!poll) return fail(HTTP_STATUS.NOT_FOUND, POLL_MESSAGES.NOT_FOUND)
  const [stored, answers, counts] = await Promise.all([
    findResponses(id, POLL_EXPORT.RESPONSES_MAX),
    findAnswers([id]),
    countResponses([id]),
  ])
  const all = answers.get(id) ?? []
  const byResponse = new Map<string, StoredAnswer[]>()
  for (const answer of all) pushTo(byResponse, answer.responseId, answer)

  const columns = columnsOf(poll)
  const header: XlsxCell[] = [POLL_EXPORT.COL_DATE, POLL_EXPORT.COL_VOTER, POLL_EXPORT.COL_ACCOUNT, ...columns.map((column) => column.title)]
  const body = [...stored].reverse().map((response): XlsxCell[] => {
    const own = byResponse.get(response.id) ?? []
    const byQuestion = new Map<string, StoredAnswer[]>()
    for (const answer of own) pushTo(byQuestion, answer.questionId, answer)
    return [
      localStamp(response.createdAt),
      response.name ?? POLL_EXPORT.ANONYMOUS,
      response.userId ? POLL_EXPORT.YES : POLL_EXPORT.NO,
      ...columns.map((column) => column.value(byQuestion.get(column.questionId) ?? [])),
    ]
  })

  const data = buildXlsx([
    {
      name: POLL_EXPORT.SHEET_RESPONSES,
      rows: [header, ...body],
      widths: [POLL_EXPORT.DATE_WIDTH, POLL_EXPORT.VOTER_WIDTH, POLL_EXPORT.ACCOUNT_WIDTH, ...columns.map(() => POLL_EXPORT.ANSWER_WIDTH)],
    },
    {
      name: POLL_EXPORT.SHEET_SUMMARY,
      rows: summaryRows(poll, all, counts.get(id) ?? 0),
      widths: POLL_EXPORT.SUMMARY_WIDTHS,
    },
  ])
  const day = localStamp(new Date().toISOString()).slice(0, 10)
  return { ok: true, value: { fileName: `${POLL_EXPORT.FILE_PREFIX}-${slug(poll.title)}-${day}.xlsx`, data } }
}
