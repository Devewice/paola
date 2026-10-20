import type { Knex } from 'knex'
import { createTableOnce } from '../table.js'

const TIPS_NOTE =
  'Estoy terminando una investigación sobre educación vial con motociclistas de Bogotá. Cuando esté lista, aquí van los resultados y los tips que salgan de ella.'

export async function up(knex: Knex): Promise<void> {
  await createTableOnce(knex, 'site_sections', (table) => {
    table.string('id', 64).primary()
    table.boolean('enabled').notNullable().defaultTo(true)
    table.string('note', 280).nullable()
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now())
  })

  const tips = await knex('site_sections').where({ id: 'tu-voz-tips' }).first()
  if (!tips) await knex('site_sections').insert({ id: 'tu-voz-tips', enabled: false, note: TIPS_NOTE })

  if (!(await knex.schema.hasColumn('services', 'photo_src'))) {
    await knex.schema.alterTable('services', (table) => {
      table.string('photo_src', 500).nullable()
    })
  }
}

export async function down(knex: Knex): Promise<void> {
  if (await knex.schema.hasColumn('services', 'photo_src')) {
    await knex.schema.alterTable('services', (table) => {
      table.dropColumn('photo_src')
    })
  }
  await knex.schema.dropTableIfExists('site_sections')
}
