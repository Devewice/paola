import type { Knex } from 'knex'
import { createTableOnce } from '../table.js'

export async function up(knex: Knex): Promise<void> {
  await createTableOnce(knex, 'outings', (table) => {
    table.string('id', 64).primary()
    table.string('title', 180).notNullable()
    table.date('date').notNullable()
    table.enu('kind', ['rodada', 'actividad']).notNullable()
    table.string('meeting_point', 220).notNullable()
    table.text('route_text').notNullable()
    table.integer('capacity').notNullable()
    table.text('what_to_bring').notNullable()
    table.boolean('paid').notNullable().defaultTo(false)
    table.enu('status', ['abierto', 'lleno', 'cerrado', 'realizado']).notNullable().defaultTo('abierto')
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('outings')
}
