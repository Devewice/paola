import { getDb } from '../db/knex.js'

export type Tip = {
  id: string
  title: string
  body: string
  officialHref?: string
}

function optionalHref(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const href = value.trim()
  return href.length > 0 ? href : undefined
}

function toTip(row: Record<string, unknown>): Tip {
  return {
    id: String(row.id),
    title: String(row.title),
    body: String(row.body),
    officialHref: optionalHref(row.official_href),
  }
}

export async function listTips(): Promise<Tip[]> {
  const rows = await getDb()('tips')
    .select('id', 'title', 'body', 'official_href')
    .orderBy('created_at', 'desc')
  return rows.map((row) => toTip(row as Record<string, unknown>))
}
