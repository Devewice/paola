import { APP_MESSAGES, BOOT_LOG, MIGRATION_DETAIL_MAX } from '../constants.js'
import { MYSQL } from './constants.js'
import { getDb } from './knex.js'
import { canonicalMigrationName } from './migrationSource.js'

export type MigrationState = 'pendiente' | 'sin-mysql' | 'al-dia' | 'aplicadas' | 'fallo'

export type MigrationReport = {
  state: MigrationState
  applied: string[]
  last?: string
  total?: number
  detail?: string
  at?: string
}

let report: MigrationReport = { state: 'pendiente', applied: [] }

/** Resultado del arranque; lo muestra `/api/health`. */
export function migrationReport(): MigrationReport {
  return report
}

function settle(next: Omit<MigrationReport, 'at'>): MigrationReport {
  report = { ...next, at: new Date().toISOString() }
  return report
}

/** Registros viejos guardados como `.js` pasan al nombre canónico para no re-ejecutar migraciones ya aplicadas. */
async function normalizeMigrationNames(): Promise<void> {
  const db = getDb()
  if (!(await db.schema.hasTable(MYSQL.MIGRATIONS_TABLE))) return
  const rows = await db(MYSQL.MIGRATIONS_TABLE).select('id', 'name')
  const seen = new Set<string>()
  for (const row of rows) {
    const canonical = canonicalMigrationName(String(row.name))
    if (seen.has(canonical)) {
      await db(MYSQL.MIGRATIONS_TABLE).where({ id: row.id }).delete()
      continue
    }
    seen.add(canonical)
    if (canonical !== row.name) await db(MYSQL.MIGRATIONS_TABLE).where({ id: row.id }).update({ name: canonical })
  }
}

async function lastApplied(): Promise<{ last?: string; total: number }> {
  const db = getDb()
  const rows = await db(MYSQL.MIGRATIONS_TABLE).select('name').orderBy('id', 'desc')
  return { last: rows[0] ? String(rows[0].name) : undefined, total: rows.length }
}

export function skipMigrations(detail: string): MigrationReport {
  console.log(BOOT_LOG.mysqlDown(detail))
  console.log(BOOT_LOG.skipped)
  return settle({ state: 'sin-mysql', applied: [], detail: detail.slice(0, MIGRATION_DETAIL_MAX) })
}

export async function migrate(): Promise<MigrationReport> {
  console.log(BOOT_LOG.mysqlUp)
  try {
    await normalizeMigrationNames()
    const [, rawApplied] = (await getDb().migrate.latest()) as [unknown, string[]]
    const applied = rawApplied.map((name) => canonicalMigrationName(String(name)))
    const { last, total } = await lastApplied()
    if (applied.length) {
      console.log(BOOT_LOG.applied(applied.length))
      for (const name of applied) console.log(BOOT_LOG.item(name))
    } else {
      console.log(APP_MESSAGES.MIGRATE_UP_TO_DATE)
    }
    console.log(BOOT_LOG.last(last ?? '—', total))
    return settle({ state: applied.length ? 'aplicadas' : 'al-dia', applied, last, total })
  } catch (error) {
    const detail = error instanceof Error ? error.message : APP_MESSAGES.MIGRATE_FALLBACK
    console.error(BOOT_LOG.failed(detail))
    return settle({ state: 'fallo', applied: [], detail: detail.slice(0, MIGRATION_DETAIL_MAX) })
  }
}
