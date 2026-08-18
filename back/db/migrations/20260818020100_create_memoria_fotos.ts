import type { Knex } from 'knex'
import { createTableOnce } from '../table.js'

export async function up(knex: Knex): Promise<void> {
  await createTableOnce(knex, 'memoria_fotos', (table) => {
    table.string('id', 64).primary()
    table.string('memoria_id', 64).notNullable()
    table.string('src', 500).notNullable()
    table.string('alt', 280).notNullable()
    table.integer('sort_order').notNullable().defaultTo(0)
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.index(['memoria_id'], 'idx_memoria_fotos_memoria')
    table.foreign('memoria_id').references('id').inTable('memorias')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('memoria_fotos')
}
