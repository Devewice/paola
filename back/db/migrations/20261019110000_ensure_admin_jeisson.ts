import type { Knex } from 'knex'

const EMAIL = 'jeissondav1@gmail.com'
const ADMIN_ROLE = { id: 'admin', name: 'Admin', is_system: true }

export async function up(knex: Knex): Promise<void> {
  await knex('roles').insert(ADMIN_ROLE).onConflict('id').ignore()
  await knex('users').whereRaw('lower(trim(email)) = ?', [EMAIL]).update({ role_id: ADMIN_ROLE.id })
}

export async function down(knex: Knex): Promise<void> {
  await knex('users').whereRaw('lower(trim(email)) = ?', [EMAIL]).update({ role_id: 'usuario' })
}
