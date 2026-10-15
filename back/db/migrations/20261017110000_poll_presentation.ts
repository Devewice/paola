import type { Knex } from 'knex'

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
  await addColumn(knex, 'poll_questions', 'code', (table) => {
    table.string('code', 16).nullable()
  })
  await addColumn(knex, 'poll_questions', 'display', (table) => {
    table.string('display', 16).nullable()
  })
  await addColumn(knex, 'poll_questions', 'tone', (table) => {
    table.string('tone', 16).nullable()
  })
  await addColumn(knex, 'poll_rows', 'code', (table) => {
    table.string('code', 16).nullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('poll_rows', (table) => {
    table.dropColumn('code')
  })
  await knex.schema.alterTable('poll_questions', (table) => {
    table.dropColumn('tone')
    table.dropColumn('display')
    table.dropColumn('code')
  })
}
