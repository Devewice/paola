import type { Knex } from 'knex'
import { createTableOnce } from '../table.js'

export async function up(knex: Knex): Promise<void> {
  await createTableOnce(knex, 'services', (table) => {
    table.string('id', 64).primary()
    table.string('title', 180).notNullable()
    table.text('includes_text').notNullable()
    table.text('handover_text').notNullable()
    table.text('turnaround_text').notNullable()
    table.integer('price_cop').nullable()
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('services')
}
