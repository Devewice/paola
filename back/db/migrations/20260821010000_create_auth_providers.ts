import type { Knex } from 'knex'
import { createTableOnce } from '../table.js'

export async function up(knex: Knex): Promise<void> {
  await createTableOnce(knex, 'auth_providers', (table) => {
    table.string('id', 64).primary()
    table.string('provider', 32).notNullable().unique()
    table.boolean('enabled').notNullable().defaultTo(false)
    table.string('status', 16).notNullable()
    table.text('credentials_json').notNullable()
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('auth_providers')
}
