import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('products', (table) => {
    table.string('color', 40).nullable()
    table.string('size', 20).nullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('products', (table) => {
    table.dropColumn('color')
    table.dropColumn('size')
  })
}
