import type { Knex } from 'knex'
import { createTableOnce } from '../table.js'

export async function up(knex: Knex): Promise<void> {
  if (!(await knex.schema.hasColumn('polls', 'show_results'))) {
    await knex.schema.alterTable('polls', (table) => {
      table.boolean('show_results').notNullable().defaultTo(true)
    })
  }

  await createTableOnce(knex, 'poll_views', (table) => {
    table.increments('id').primary()
    table.string('poll_id', 64).notNullable()
    table.string('viewer_key', 100).notNullable()
    table.string('user_id', 64).nullable()
    table.string('kind', 16).notNullable()
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.index(['poll_id', 'viewer_key'], 'idx_poll_views_viewer')
    table.index(['poll_id', 'created_at'], 'idx_poll_views_date')
    table.foreign('poll_id').references('id').inTable('polls').onDelete('CASCADE')
    table.foreign('user_id').references('id').inTable('users').onDelete('SET NULL')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('poll_views')
  if (await knex.schema.hasColumn('polls', 'show_results')) {
    await knex.schema.alterTable('polls', (table) => {
      table.dropColumn('show_results')
    })
  }
}
