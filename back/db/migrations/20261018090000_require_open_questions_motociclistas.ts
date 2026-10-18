import type { Knex } from 'knex'

const POLL_IDS = ['motociclistas-educacion-vial', 'motociclistas-educacion-vial-v2']
const OPEN_CODES = ['20', '21']

/** Las dos preguntas abiertas del cierre se responden sí o sí: sin «Saltar». */
export async function up(knex: Knex): Promise<void> {
  await knex('poll_questions').whereIn('poll_id', POLL_IDS).whereIn('code', OPEN_CODES).update({ required: true })
}

export async function down(knex: Knex): Promise<void> {
  await knex('poll_questions').whereIn('poll_id', POLL_IDS).whereIn('code', OPEN_CODES).update({ required: false })
}
