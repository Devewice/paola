import type { Knex } from 'knex'
import { createTableOnce } from '../table.js'

const KINDS = ['single', 'multiple', 'ranking', 'scale', 'text', 'grid']
const OLD_KINDS = ['single', 'multiple', 'ranking', 'scale', 'text']

function kindEnum(kinds: readonly string[]): string {
  return kinds.map((kind) => `'${kind}'`).join(', ')
}

async function addColumn(
  knex: Knex,
  table: string,
  column: string,
  build: (builder: Knex.AlterTableBuilder) => void,
): Promise<void> {
  if (await knex.schema.hasColumn(table, column)) return
  await knex.schema.alterTable(table, build)
}

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`ALTER TABLE poll_questions MODIFY kind ENUM(${kindEnum(KINDS)}) NOT NULL`)
  await addColumn(knex, 'poll_questions', 'section', (table) => {
    table.string('section', 160).nullable()
  })
  await addColumn(knex, 'poll_questions', 'show_if', (table) => {
    table.text('show_if').nullable()
  })
  await addColumn(knex, 'poll_options', 'is_other', (table) => {
    table.boolean('is_other').notNullable().defaultTo(false)
  })
  await addColumn(knex, 'poll_options', 'exclusive', (table) => {
    table.boolean('exclusive').notNullable().defaultTo(false)
  })
  await addColumn(knex, 'poll_answers', 'row_id', (table) => {
    table.string('row_id', 64).nullable()
  })

  await createTableOnce(knex, 'poll_rows', (table) => {
    table.string('id', 64).primary()
    table.string('question_id', 64).notNullable()
    table.integer('position').notNullable().defaultTo(0)
    table.string('label', 200).notNullable()
    table.index(['question_id'], 'idx_poll_rows_question')
    table.foreign('question_id').references('id').inTable('poll_questions').onDelete('CASCADE')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('poll_rows')
  await knex('poll_questions').where({ kind: 'grid' }).delete()
  await knex.raw(`ALTER TABLE poll_questions MODIFY kind ENUM(${kindEnum(OLD_KINDS)}) NOT NULL`)
  await knex.schema.alterTable('poll_answers', (table) => {
    table.dropColumn('row_id')
  })
  await knex.schema.alterTable('poll_options', (table) => {
    table.dropColumn('exclusive')
    table.dropColumn('is_other')
  })
  await knex.schema.alterTable('poll_questions', (table) => {
    table.dropColumn('show_if')
    table.dropColumn('section')
  })
}
