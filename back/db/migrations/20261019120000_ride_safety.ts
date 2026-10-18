import type { Knex } from 'knex'

const USER_COLUMNS = ['emergency_name', 'emergency_phone', 'blood_type', 'medical_notes'] as const
const TICKET_COLUMNS = ['passenger_name', 'level', 'docs_ok', 'rules_ok', 'confirmation', 'confirmed_at'] as const

async function missing(knex: Knex, table: string, columns: readonly string[]): Promise<Set<string>> {
  const result = new Set<string>()
  for (const column of columns) {
    if (!(await knex.schema.hasColumn(table, column))) result.add(column)
  }
  return result
}

export async function up(knex: Knex): Promise<void> {
  const users = await missing(knex, 'users', USER_COLUMNS)
  if (users.size) {
    await knex.schema.alterTable('users', (table) => {
      if (users.has('emergency_name')) table.string('emergency_name', 80).nullable()
      if (users.has('emergency_phone')) table.string('emergency_phone', 20).nullable()
      if (users.has('blood_type')) table.string('blood_type', 4).nullable()
      if (users.has('medical_notes')) table.string('medical_notes', 200).nullable()
    })
  }

  const tickets = await missing(knex, 'tickets', TICKET_COLUMNS)
  if (tickets.size) {
    await knex.schema.alterTable('tickets', (table) => {
      if (tickets.has('passenger_name')) table.string('passenger_name', 80).nullable()
      if (tickets.has('level')) table.string('level', 16).notNullable().defaultTo('')
      if (tickets.has('docs_ok')) table.boolean('docs_ok').notNullable().defaultTo(false)
      if (tickets.has('rules_ok')) table.boolean('rules_ok').notNullable().defaultTo(false)
      if (tickets.has('confirmation')) table.string('confirmation', 12).notNullable().defaultTo('pendiente')
      if (tickets.has('confirmed_at')) table.timestamp('confirmed_at').nullable()
    })
  }
}

export async function down(knex: Knex): Promise<void> {
  const tickets = await missing(knex, 'tickets', TICKET_COLUMNS)
  const ticketDrops = TICKET_COLUMNS.filter((column) => !tickets.has(column))
  if (ticketDrops.length) {
    await knex.schema.alterTable('tickets', (table) => {
      for (const column of ticketDrops) table.dropColumn(column)
    })
  }
  const users = await missing(knex, 'users', USER_COLUMNS)
  const userDrops = USER_COLUMNS.filter((column) => !users.has(column))
  if (userDrops.length) {
    await knex.schema.alterTable('users', (table) => {
      for (const column of userDrops) table.dropColumn(column)
    })
  }
}
