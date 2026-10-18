import type { Knex } from 'knex'

const COLLATION = 'utf8mb4_unicode_ci'

type TableRow = { name?: string; TABLE_NAME?: string }

function rowsOf(raw: unknown): TableRow[] {
  if (Array.isArray(raw) && Array.isArray(raw[0])) return raw[0] as TableRow[]
  return Array.isArray(raw) ? (raw as TableRow[]) : []
}

/** Tablas creadas sin `createTableOnce` tomaron la collation del servidor y los joins con `users` revientan. */
export async function up(knex: Knex): Promise<void> {
  const raw = await knex.raw(
    `SELECT TABLE_NAME AS name FROM information_schema.TABLES
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_TYPE = 'BASE TABLE'
       AND TABLE_COLLATION <> ? AND TABLE_NAME NOT LIKE 'knex\\_%'`,
    [COLLATION],
  )
  const tables = rowsOf(raw)
    .map((row) => String(row.name ?? row.TABLE_NAME ?? ''))
    .filter(Boolean)
  if (!tables.length) return

  await knex.raw('SET FOREIGN_KEY_CHECKS = 0')
  try {
    for (const table of tables) {
      await knex.raw(`ALTER TABLE ?? CONVERT TO CHARACTER SET utf8mb4 COLLATE ${COLLATION}`, [table])
    }
  } finally {
    await knex.raw('SET FOREIGN_KEY_CHECKS = 1')
  }
}

export async function down(): Promise<void> {
  /* No se vuelve a mezclar collations. */
}
