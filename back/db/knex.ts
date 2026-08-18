import knex, { type Knex } from 'knex'
import config from './knexfile.js'

let db: Knex | undefined

/** Una sola conexión MySQL vía Knex (migraciones + consultas). */
export function getDb(): Knex {
  if (!db) db = knex(config)
  return db
}

export function rowsOf(result: unknown): Record<string, unknown>[] {
  if (Array.isArray(result)) {
    const [first] = result
    if (Array.isArray(first)) return rowsOf(first)
    return result.filter(
      (row): row is Record<string, unknown> =>
        Boolean(row) && typeof row === 'object' && !Array.isArray(row),
    )
  }
  return []
}

export async function pingDb(): Promise<{ ok: boolean; detail: string }> {
  try {
    await getDb().raw('SELECT 1')
    return { ok: true, detail: 'mysql ok' }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'error mysql'
    return { ok: false, detail: message }
  }
}

export async function destroyDb(): Promise<void> {
  if (!db) return
  await db.destroy()
  db = undefined
}
