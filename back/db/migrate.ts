import { APP_MESSAGES, migrateAppliedMessage } from '../constants.js'
import { MYSQL } from './constants.js'
import { getDb } from './knex.js'
import { canonicalMigrationName } from './migrationSource.js'

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

export async function migrate(): Promise<void> {
  await normalizeMigrationNames()
  const [, applied] = await getDb().migrate.latest()
  if (applied.length === 0) {
    console.log(APP_MESSAGES.MIGRATE_UP_TO_DATE)
    return
  }
  console.log(migrateAppliedMessage(applied.join(', ')))
}
