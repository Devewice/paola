import type { Knex } from 'knex'

const COLLATION = 'utf8mb4_unicode_ci'
const FK_RULES = new Set(['CASCADE', 'SET NULL', 'RESTRICT', 'NO ACTION', 'SET DEFAULT'])

type Row = Record<string, unknown>

type ForeignKey = {
  name: string
  table: string
  referenced: string
  columns: string[]
  referencedColumns: string[]
  onDelete: string
  onUpdate: string
}

function rowsOf(raw: unknown): Row[] {
  if (Array.isArray(raw) && Array.isArray(raw[0])) return raw[0] as Row[]
  return Array.isArray(raw) ? (raw as Row[]) : []
}

function rule(value: unknown): string {
  const text = String(value ?? '').toUpperCase()
  return FK_RULES.has(text) ? text : 'RESTRICT'
}

async function tablesToConvert(knex: Knex): Promise<string[]> {
  const raw = await knex.raw(
    `SELECT TABLE_NAME AS name FROM information_schema.TABLES
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_TYPE = 'BASE TABLE'
       AND TABLE_COLLATION <> ? AND TABLE_NAME NOT LIKE 'knex\\_%'`,
    [COLLATION],
  )
  return rowsOf(raw)
    .map((row) => String(row.name ?? ''))
    .filter(Boolean)
}

/** Llaves que tocan alguna de las tablas: MariaDB no deja cambiar la collation de una columna con FK. */
async function foreignKeysTouching(knex: Knex, tables: string[]): Promise<ForeignKey[]> {
  const raw = await knex.raw(
    `SELECT rc.CONSTRAINT_NAME AS name, rc.TABLE_NAME AS tbl, rc.REFERENCED_TABLE_NAME AS ref,
            rc.DELETE_RULE AS on_delete, rc.UPDATE_RULE AS on_update,
            k.COLUMN_NAME AS col, k.REFERENCED_COLUMN_NAME AS ref_col
     FROM information_schema.REFERENTIAL_CONSTRAINTS rc
     JOIN information_schema.KEY_COLUMN_USAGE k
       ON k.CONSTRAINT_SCHEMA = rc.CONSTRAINT_SCHEMA
      AND k.CONSTRAINT_NAME = rc.CONSTRAINT_NAME
      AND k.TABLE_NAME = rc.TABLE_NAME
     WHERE rc.CONSTRAINT_SCHEMA = DATABASE()
     ORDER BY rc.TABLE_NAME, rc.CONSTRAINT_NAME, k.ORDINAL_POSITION`,
  )
  const wanted = new Set(tables)
  const byName = new Map<string, ForeignKey>()
  for (const row of rowsOf(raw)) {
    const table = String(row.tbl ?? '')
    const referenced = String(row.ref ?? '')
    if (!wanted.has(table) && !wanted.has(referenced)) continue
    const key = `${table}.${String(row.name)}`
    const fk = byName.get(key) ?? {
      name: String(row.name),
      table,
      referenced,
      columns: [],
      referencedColumns: [],
      onDelete: rule(row.on_delete),
      onUpdate: rule(row.on_update),
    }
    fk.columns.push(String(row.col))
    fk.referencedColumns.push(String(row.ref_col))
    byName.set(key, fk)
  }
  return [...byName.values()]
}

/** Tablas creadas sin `createTableOnce` tomaron la collation del servidor y los joins con `users` revientan. */
export async function up(knex: Knex): Promise<void> {
  const tables = await tablesToConvert(knex)
  if (!tables.length) return

  const foreignKeys = await foreignKeysTouching(knex, tables)
  for (const fk of foreignKeys) {
    await knex.raw('ALTER TABLE ?? DROP FOREIGN KEY ??', [fk.table, fk.name])
  }
  for (const table of tables) {
    await knex.raw(`ALTER TABLE ?? CONVERT TO CHARACTER SET utf8mb4 COLLATE ${COLLATION}`, [table])
  }
  for (const fk of foreignKeys) {
    const columns = fk.columns.map(() => '??').join(', ')
    const referencedColumns = fk.referencedColumns.map(() => '??').join(', ')
    await knex.raw(
      `ALTER TABLE ?? ADD CONSTRAINT ?? FOREIGN KEY (${columns}) REFERENCES ?? (${referencedColumns})
       ON DELETE ${fk.onDelete} ON UPDATE ${fk.onUpdate}`,
      [fk.table, fk.name, ...fk.columns, fk.referenced, ...fk.referencedColumns],
    )
  }
}

export async function down(): Promise<void> {
  /* No se vuelve a mezclar collations. */
}
