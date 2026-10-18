import type { Knex } from 'knex'

/** La moto principal es la que sale en los cupos de rodada. */
export async function up(knex: Knex): Promise<void> {
  if (await knex.schema.hasColumn('user_motorcycles', 'is_primary')) return
  await knex.schema.alterTable('user_motorcycles', (table) => {
    table.boolean('is_primary').notNullable().defaultTo(false)
  })
}

export async function down(knex: Knex): Promise<void> {
  if (!(await knex.schema.hasColumn('user_motorcycles', 'is_primary'))) return
  await knex.schema.alterTable('user_motorcycles', (table) => {
    table.dropColumn('is_primary')
  })
}
