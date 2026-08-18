import type { Knex } from 'knex'
import { createTableOnce } from '../table.js'

export async function up(knex: Knex): Promise<void> {
  await createTableOnce(knex, 'tickets', (table) => {
    table.string('id', 64).primary()
    table.string('outing_id', 64).notNullable()
    table.string('name', 120).notNullable()
    table.string('whatsapp', 32).notNullable()
    table.string('moto', 120).notNullable().defaultTo('')
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.index(['outing_id'], 'idx_tickets_outing')
    table.foreign('outing_id').references('id').inTable('outings')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('tickets')
}
