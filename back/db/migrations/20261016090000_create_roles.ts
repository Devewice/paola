import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('roles', (table) => {
    table.string('id', 40).primary()
    table.string('name', 80).notNullable().unique()
    table.boolean('is_system').notNullable().defaultTo(false)
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
  })

  await knex.schema.createTable('role_permissions', (table) => {
    table.string('role_id', 40).notNullable().references('id').inTable('roles').onDelete('CASCADE')
    table.string('permission', 40).notNullable()
    table.primary(['role_id', 'permission'])
  })

  await knex('roles').insert([
    { id: 'admin', name: 'Admin', is_system: true },
    { id: 'usuario', name: 'Usuario', is_system: true },
    { id: 'moderador', name: 'Moderador', is_system: false },
  ])
  await knex('role_permissions').insert([
    { role_id: 'moderador', permission: 'voz' },
    { role_id: 'moderador', permission: 'comunidad' },
    { role_id: 'moderador', permission: 'encuestas' },
  ])

  await knex.schema.alterTable('users', (table) => {
    table.string('role_id', 40).notNullable().defaultTo('usuario')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', (table) => {
    table.dropColumn('role_id')
  })
  await knex.schema.dropTableIfExists('role_permissions')
  await knex.schema.dropTableIfExists('roles')
}
