import type { Knex } from 'knex'
import { createTableOnce } from '../table.js'

export async function up(knex: Knex): Promise<void> {
  await createTableOnce(knex, 'products', (table) => {
    table.string('id', 64).primary()
    table.string('title', 180).notNullable()
    table.text('description').notNullable()
    table.string('kind', 20).notNullable()
    table.integer('price_cop').nullable()
    table.integer('stock').nullable()
    table.string('photo_src', 500).nullable()
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('products')
}
