import type { Knex } from 'knex'
import { createTableOnce } from '../table.js'

export async function up(knex: Knex): Promise<void> {
  await createTableOnce(knex, 'memory_photos', (table) => {
    table.string('id', 64).primary()
    table.string('memory_id', 64).notNullable()
    table.string('src', 500).notNullable()
    table.string('alt', 280).notNullable()
    table.integer('sort_order').notNullable().defaultTo(0)
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.index(['memory_id'], 'idx_memory_photos_memory')
    table.foreign('memory_id').references('id').inTable('memories')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('memory_photos')
}
