import type { Knex } from 'knex'
import { createTableOnce } from '../table.js'

export async function up(knex: Knex): Promise<void> {
  await createTableOnce(knex, 'tips', (table) => {
    table.string('id', 64).primary()
    table.string('title', 200).notNullable()
    table.text('body').notNullable()
    table.string('official_href', 500).nullable()
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('tips')
}
