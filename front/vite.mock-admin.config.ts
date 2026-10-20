import { mergeConfig, type Plugin } from 'vite'
import base from './vite.config.ts'

const PROD = 'https://paolabiker.com'
type Json = Record<string, unknown>
type Q = { id: string; kind: string; prompt: string; options: { id: string; label: string }[]; rows?: { id: string }[]; scaleMin?: number; scaleMax?: number }

function send(res: import('node:http').ServerResponse, body: unknown) {
  res.setHeader('content-type', 'application/json')
  res.end(JSON.stringify(body))
}

function fakeResults(poll: Json, responses: number) {
  const questions = (poll.questions as Q[]) ?? []
  return {
    responses,
    questions: questions.map((question, qi) => {
      const counts = question.options.map((_, oi) => ((qi + 3) * (oi + 2) * 7) % 13 + 1)
      const total = counts.reduce((a, b) => a + b, 0) || 1
      const options = question.options.map((option, oi) => ({ optionId: option.id, count: counts[oi], percent: ((counts[oi] ?? 0) / total) * 100, averageRank: oi + 1 }))
      const base = { questionId: question.id, answered: responses - (qi % 3), options }
      if (question.kind === 'scale') {
        const min = question.scaleMin ?? 1
        const max = question.scaleMax ?? 5
        const distribution = Array.from({ length: max - min + 1 }, (_, i) => ({ value: min + i, count: ((i + qi) * 5) % 7 }))
        return { ...base, options: [], average: (min + max) / 2 + 0.4, distribution }
      }
      if (question.kind === 'grid') {
        return { ...base, rows: (question.rows ?? []).map((row, ri) => ({ rowId: row.id, answered: responses, options: question.options.map((option, oi) => ({ optionId: option.id, count: ((ri + 2) * (oi + 1) * 3) % 9, percent: 25 })) })) }
      }
      if (question.kind === 'text') return { ...base, options: [], texts: ['Buena rodada'] }
      return base
    }),
  }
}

let cache: Json[] | null = null
async function polls(): Promise<Json[]> {
  if (cache) return cache
  const body = (await (await fetch(`${PROD}/api/polls`)).json()) as { polls: Json[] }
  cache = body.polls.map((poll, index) => ({
    ...poll,
    hasVoted: true,
    showResults: true,
    results: fakeResults(poll, 40 - index * 9),
    stats: { impressions: 340 - index * 90, visits: 96 - index * 20, visitors: 71 - index * 15 },
  }))
  return cache
}

function insights(poll: Json) {
  const questions = (poll.questions as Q[]) ?? []
  const today = new Date()
  const series = Array.from({ length: 18 }, (_, index) => {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (17 - index))
    const day = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    return { day, impressions: 4 + ((index * 7) % 19), visits: 1 + ((index * 3) % 8), responses: index % 3 }
  })
  const names = ['Laura Gómez', 'Andrés M.', undefined, 'Paola Biker', undefined, 'Camilo R.', undefined]
  return {
    stats: { impressions: 340, visits: 96, visitors: 71, responses: 40 },
    series,
    visitors: names.map((name, index) => ({
      key: `${name ? 'u' : 'a'}:k${index}`,
      name,
      impressions: 1 + index,
      visits: index % 3,
      firstSeen: new Date(Date.now() - 86400000 * (index + 2)).toISOString(),
      lastSeen: new Date(Date.now() - 3600000 * (index + 1)).toISOString(),
      responded: index % 2 === 0,
    })),
    responses: Array.from({ length: 25 }, (_, index) => ({
      id: `r${index}`,
      createdAt: new Date(Date.now() - 3600000 * (index * 7 + 1)).toISOString(),
      userId: index % 3 ? undefined : String(index),
      name: names[index % names.length],
      answers: questions.slice(0, 2).map((question) => ({ questionId: question.id, text: question.options[0]?.label ?? 'Bien' })),
    })),
  }
}

const mock: Plugin = {
  name: 'mock-admin',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      const url = req.url ?? ''
      if (url.startsWith('/api/operar/access')) {
        return send(res, { ok: true, access: { alias: 'jeisson', role: { id: 'admin', name: 'Admin' }, permissions: ['encuestas'] } })
      }
      if (url.startsWith('/api/polls/views')) return send(res, { ok: true, saved: 1 })
      if (url.split('?')[0] === '/api/polls' && req.method === 'GET') return send(res, { polls: await polls() })
      const detail = url.match(/^\/api\/polls\/([^/?]+)(\?|$)/)
      if (detail && req.method === 'GET') {
        const poll = (await polls()).find((item) => item.id === decodeURIComponent(detail[1] ?? ''))
        return send(res, { poll })
      }
      const insightsMatch = url.match(/^\/api\/operar\/polls\/([^/]+)\/insights/)
      if (insightsMatch) {
        const poll = (await polls()).find((item) => item.id === decodeURIComponent(insightsMatch[1] ?? ''))
        return send(res, { ok: true, insights: insights(poll ?? {}) })
      }
      if (url.startsWith('/api/operar/polls') && req.method === 'GET') return send(res, { ok: true, polls: await polls() })
      if (url.startsWith('/api/operar/')) return send(res, { ok: true })
      next()
    })
  },
}

export default mergeConfig(base, {
  plugins: [mock],
  server: {
    proxy: {
      '/api': { target: PROD, changeOrigin: true, secure: true },
    },
  },
})
