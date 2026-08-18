import type { Knex } from 'knex'
import { createTableOnce } from '../table.js'

export async function up(knex: Knex): Promise<void> {
  await createTableOnce(knex, 'memorias', (table) => {
    table.string('id', 64).primary()
    table.string('salida_id', 64).notNullable().unique()
    table.integer('km').notNullable()
    table.text('closing_text').notNullable()
    table.string('credit', 280).notNullable()
    table.text('participants_text').notNullable()
    table.string('instagram_href', 500).nullable()
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.foreign('salida_id').references('id').inTable('salidas')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('memorias')
}
