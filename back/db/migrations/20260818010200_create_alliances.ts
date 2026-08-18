import type { Knex } from 'knex'
import { createTableOnce } from '../table.js'

export async function up(knex: Knex): Promise<void> {
  await createTableOnce(knex, 'alliances', (table) => {
    table.string('id', 64).primary()
    table.string('name', 180).notNullable()
    table.string('support', 280).notNullable()
    table.string('href', 500).nullable()
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('alliances')
}
