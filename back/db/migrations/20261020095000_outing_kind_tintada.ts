import type { Knex } from 'knex'

/** Las tintadas son encuentros sin rodar: tipo propio, aparte de rodada y actividad. */
export async function up(knex: Knex): Promise<void> {
  await knex.raw(`ALTER TABLE outings MODIFY kind ENUM('rodada', 'actividad', 'tintada') NOT NULL`)
}

export async function down(knex: Knex): Promise<void> {
  await knex('outings').where({ kind: 'tintada' }).update({ kind: 'actividad' })
  await knex.raw(`ALTER TABLE outings MODIFY kind ENUM('rodada', 'actividad') NOT NULL`)
}
