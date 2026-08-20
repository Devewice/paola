import type { Knex } from 'knex'
import { createTableOnce } from '../table.js'

export async function up(knex: Knex): Promise<void> {
  await createTableOnce(knex, 'payment_gateways', (table) => {
    table.string('id', 64).primary()
    table.string('provider', 32).notNullable().unique()
    table.string('mode', 16).notNullable()
    table.boolean('enabled').notNullable().defaultTo(false)
    table.string('status', 16).notNullable()
    table.text('credentials_json').notNullable()
    table.timestamp('tested_at').nullable()
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('payment_gateways')
}
