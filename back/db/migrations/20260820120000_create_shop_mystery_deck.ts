import type { Knex } from 'knex'
import { createTableOnce } from '../table.js'

export async function up(knex: Knex): Promise<void> {
  await createTableOnce(knex, 'shop_mystery_settings', (table) => {
    table.string('id', 32).primary()
    table.boolean('enabled').notNullable().defaultTo(false)
    table.integer('deck_size').notNullable().defaultTo(3)
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now())
  })

  await createTableOnce(knex, 'shop_mystery_cards', (table) => {
    table.string('id', 64).primary()
    table.string('product_id', 64).notNullable()
    table.string('coupon_code', 40).notNullable()
    table.boolean('active').notNullable().defaultTo(true)
    table.integer('sort_order').notNullable().defaultTo(0)
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.index(['active', 'sort_order'], 'shop_mystery_cards_active_sort')
  })

  await createTableOnce(knex, 'shop_mystery_reveals', (table) => {
    table.string('id', 64).primary()
    table.string('card_id', 64).notNullable()
    table.string('user_id', 64).notNullable()
    table.timestamp('revealed_at').notNullable().defaultTo(knex.fn.now())
    table.unique(['card_id', 'user_id'], 'shop_mystery_reveals_card_user')
  })

  const existing = await knex('shop_mystery_settings').where({ id: 'default' }).first()
  if (!existing) {
    await knex('shop_mystery_settings').insert({
      id: 'default',
      enabled: false,
      deck_size: 3,
    })
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('shop_mystery_reveals')
  await knex.schema.dropTableIfExists('shop_mystery_cards')
  await knex.schema.dropTableIfExists('shop_mystery_settings')
}
