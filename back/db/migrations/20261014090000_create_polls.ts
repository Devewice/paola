import type { Knex } from 'knex'
import { createTableOnce } from '../table.js'

export async function up(knex: Knex): Promise<void> {
  await createTableOnce(knex, 'polls', (table) => {
    table.string('id', 64).primary()
    table.string('title', 200).notNullable()
    table.text('description').nullable()
    table.enu('audience', ['public', 'account']).notNullable().defaultTo('public')
    table.enu('status', ['draft', 'open', 'closed']).notNullable().defaultTo('draft')
    table.boolean('featured').notNullable().defaultTo(false)
    table.string('outing_id', 64).nullable()
    table.dateTime('closes_at').nullable()
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.index(['status'], 'idx_polls_status')
    table.index(['outing_id'], 'idx_polls_outing')
    table.foreign('outing_id').references('id').inTable('outings').onDelete('SET NULL')
  })

  await createTableOnce(knex, 'poll_questions', (table) => {
    table.string('id', 64).primary()
    table.string('poll_id', 64).notNullable()
    table.integer('position').notNullable().defaultTo(0)
    table.enu('kind', ['single', 'multiple', 'ranking', 'scale', 'text']).notNullable()
    table.string('prompt', 300).notNullable()
    table.string('help', 300).nullable()
    table.boolean('required').notNullable().defaultTo(true)
    table.integer('max_choices').nullable()
    table.integer('scale_min').nullable()
    table.integer('scale_max').nullable()
    table.string('scale_min_label', 80).nullable()
    table.string('scale_max_label', 80).nullable()
    table.index(['poll_id'], 'idx_poll_questions_poll')
    table.foreign('poll_id').references('id').inTable('polls').onDelete('CASCADE')
  })

  await createTableOnce(knex, 'poll_options', (table) => {
    table.string('id', 64).primary()
    table.string('question_id', 64).notNullable()
    table.integer('position').notNullable().defaultTo(0)
    table.string('label', 200).notNullable()
    table.string('image_src', 500).nullable()
    table.index(['question_id'], 'idx_poll_options_question')
    table.foreign('question_id').references('id').inTable('poll_questions').onDelete('CASCADE')
  })

  await createTableOnce(knex, 'poll_responses', (table) => {
    table.string('id', 64).primary()
    table.string('poll_id', 64).notNullable()
    table.string('voter_key', 100).notNullable()
    table.string('user_id', 64).nullable()
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.unique(['poll_id', 'voter_key'], { indexName: 'uq_poll_responses_voter' })
    table.foreign('poll_id').references('id').inTable('polls').onDelete('CASCADE')
    table.foreign('user_id').references('id').inTable('users').onDelete('SET NULL')
  })

  await createTableOnce(knex, 'poll_answers', (table) => {
    table.increments('id').primary()
    table.string('response_id', 64).notNullable()
    table.string('question_id', 64).notNullable()
    table.string('option_id', 64).nullable()
    table.integer('rank').nullable()
    table.integer('value_number').nullable()
    table.text('value_text').nullable()
    table.index(['question_id'], 'idx_poll_answers_question')
    table.foreign('response_id').references('id').inTable('poll_responses').onDelete('CASCADE')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('poll_answers')
  await knex.schema.dropTableIfExists('poll_responses')
  await knex.schema.dropTableIfExists('poll_options')
  await knex.schema.dropTableIfExists('poll_questions')
  await knex.schema.dropTableIfExists('polls')
}
