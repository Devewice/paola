import type { OptionTally, Poll, PollQuestion, PollResults, QuestionResult } from '../interfaces/polls.interface.js'
import type { StoredAnswer } from '../providers/polls.provider.js'

function percent(count: number, total: number): number {
  return total ? Math.round((count / total) * 100) : 0
}

function round(value: number): number {
  return Math.round(value * 10) / 10
}

function tallyQuestion(question: PollQuestion, own: readonly StoredAnswer[], withTexts: boolean, textLimit: number): QuestionResult {
  const answered = new Set(own.map((answer) => answer.responseId)).size

  if (question.kind === 'single' || question.kind === 'multiple') {
    const options: OptionTally[] = question.options.map((option) => {
      const count = own.filter((answer) => answer.optionId === option.id).length
      return { optionId: option.id, count, percent: percent(count, answered) }
    })
    const otherIds = new Set(question.options.filter((option) => option.isOther).map((option) => option.id))
    const otherTexts =
      withTexts && otherIds.size
        ? own
            .filter((answer) => answer.optionId !== null && otherIds.has(answer.optionId))
            .map((answer) => answer.valueText)
            .filter((value): value is string => Boolean(value))
            .slice(0, textLimit)
        : undefined
    return { questionId: question.id, answered, options, otherTexts }
  }

  if (question.kind === 'grid') {
    const rows = question.rows.map((row) => {
      const inRow = own.filter((answer) => answer.rowId === row.id)
      const rowAnswered = inRow.length
      const options: OptionTally[] = question.options.map((option) => {
        const count = inRow.filter((answer) => answer.optionId === option.id).length
        return { optionId: option.id, count, percent: percent(count, rowAnswered) }
      })
      return { rowId: row.id, answered: rowAnswered, options }
    })
    return { questionId: question.id, answered, options: [], rows }
  }

  if (question.kind === 'ranking') {
    const options: OptionTally[] = question.options.map((option) => {
      const ranks = own.filter((answer) => answer.optionId === option.id && answer.rank !== null).map((answer) => answer.rank ?? 0)
      const firsts = ranks.filter((rank) => rank === 1).length
      const averageRank = ranks.length ? round(ranks.reduce((sum, rank) => sum + rank, 0) / ranks.length) : undefined
      return { optionId: option.id, count: firsts, percent: percent(firsts, answered), averageRank }
    })
    options.sort((a, b) => (a.averageRank ?? Infinity) - (b.averageRank ?? Infinity))
    return { questionId: question.id, answered, options }
  }

  if (question.kind === 'scale') {
    const values = own.map((answer) => answer.valueNumber).filter((value): value is number => value !== null)
    const min = question.scaleMin ?? 1
    const max = question.scaleMax ?? 5
    const distribution = Array.from({ length: max - min + 1 }, (_, index) => {
      const value = min + index
      return { value, count: values.filter((item) => item === value).length }
    })
    const average = values.length ? round(values.reduce((sum, value) => sum + value, 0) / values.length) : undefined
    return { questionId: question.id, answered, options: [], average, distribution }
  }

  const texts = withTexts
    ? own
        .map((answer) => answer.valueText)
        .filter((value): value is string => Boolean(value))
        .slice(0, textLimit)
    : undefined
  return { questionId: question.id, answered, options: [], texts }
}

export function tallyPoll(
  poll: Poll,
  answers: readonly StoredAnswer[],
  responses: number,
  options: { withTexts: boolean; textLimit: number },
): PollResults {
  const byQuestion = new Map<string, StoredAnswer[]>()
  for (const answer of answers) {
    const list = byQuestion.get(answer.questionId)
    if (list) list.push(answer)
    else byQuestion.set(answer.questionId, [answer])
  }
  return {
    responses,
    questions: poll.questions.map((question) =>
      tallyQuestion(question, byQuestion.get(question.id) ?? [], options.withTexts, options.textLimit),
    ),
  }
}
