import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  if (!(await knex.schema.hasTable('cupos'))) return
  await knex.schema.alterTable('cupos', (table) => {
    table.foreign('salida_id').references('id').inTable('salidas')
  })
}

export async function down(knex: Knex): Promise<void> {
  if (!(await knex.schema.hasTable('cupos'))) return
  await knex.schema.alterTable('cupos', (table) => {
    table.dropForeign(['salida_id'])
  })
}
