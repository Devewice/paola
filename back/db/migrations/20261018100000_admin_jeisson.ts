import type { Knex } from 'knex'

const EMAIL = 'jeissondav1@gmail.com'

/** Si la cuenta aún no existe no hace nada: hay que registrarla y correr de nuevo con otra migración. */
export async function up(knex: Knex): Promise<void> {
  await knex('users').where({ email: EMAIL }).update({ role_id: 'admin' })
}

export async function down(knex: Knex): Promise<void> {
  await knex('users').where({ email: EMAIL }).update({ role_id: 'usuario' })
}
