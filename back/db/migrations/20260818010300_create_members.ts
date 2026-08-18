import type { Knex } from 'knex'
import { createTableOnce } from '../table.js'

export async function up(knex: Knex): Promise<void> {
  await createTableOnce(knex, 'members', (table) => {
    table.string('id', 64).primary()
    table.string('alias', 80).notNullable()
    table.string('photo_src', 500).nullable()
    table.string('moto', 120).nullable()
    table.string('instagram_href', 500).nullable()
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('members')
}
