import type { Knex } from 'knex'
import { createTableOnce } from '../table.js'

export async function up(knex: Knex): Promise<void> {
  if (!(await knex.schema.hasColumn('chats', 'outing_id'))) {
    await knex.schema.alterTable('chats', (table) => {
      table.string('outing_id', 64).nullable().unique()
      table.foreign('outing_id').references('id').inTable('outings').onDelete('CASCADE')
    })
  }

  if (!(await knex.schema.hasColumn('chat_messages', 'is_pinned'))) {
    await knex.schema.alterTable('chat_messages', (table) => {
      table.boolean('is_pinned').notNullable().defaultTo(false)
    })
  }

  if (await knex.schema.hasColumn('chat_messages', 'author_id')) {
    await knex.schema.alterTable('chat_messages', (table) => {
      table.dropForeign(['author_id'])
    })
    await knex.schema.alterTable('chat_messages', (table) => {
      table.string('author_id', 64).nullable().alter()
      table.foreign('author_id').references('id').inTable('users').onDelete('SET NULL')
    })
  }

  if (!(await knex.schema.hasColumn('posts', 'is_highlighted'))) {
    await knex.schema.alterTable('posts', (table) => {
      table.boolean('is_highlighted').notNullable().defaultTo(false)
    })
  }

  if (!(await knex.schema.hasColumn('posts', 'is_pinned'))) {
    await knex.schema.alterTable('posts', (table) => {
      table.boolean('is_pinned').notNullable().defaultTo(false)
    })
  }

  if (!(await knex.schema.hasColumn('posts', 'parent_id'))) {
    await knex.schema.alterTable('posts', (table) => {
      table.string('parent_id', 64).nullable()
      table.index(['parent_id'], 'idx_posts_parent')
      table.foreign('parent_id').references('id').inTable('posts').onDelete('CASCADE')
    })
  }

  await createTableOnce(knex, 'post_photos', (table) => {
    table.string('id', 64).primary()
    table.string('post_id', 64).notNullable()
    table.string('src', 500).notNullable()
    table.string('alt', 200).nullable()
    table.integer('sort').notNullable().defaultTo(0)
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.index(['post_id'], 'idx_post_photos_post')
    table.foreign('post_id').references('id').inTable('posts').onDelete('CASCADE')
  })

  await createTableOnce(knex, 'moderation_actions', (table) => {
    table.string('id', 64).primary()
    table.string('community_id', 64).notNullable()
    table.string('actor_id', 64).nullable()
    table.string('action', 40).notNullable()
    table.string('target_type', 40).notNullable()
    table.string('target_id', 64).notNullable()
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.index(['community_id'], 'idx_moderation_community')
    table.foreign('community_id').references('id').inTable('communities').onDelete('CASCADE')
    table.foreign('actor_id').references('id').inTable('users').onDelete('SET NULL')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('moderation_actions')
  await knex.schema.dropTableIfExists('post_photos')
  if (await knex.schema.hasColumn('posts', 'parent_id')) {
    await knex.schema.alterTable('posts', (table) => {
      table.dropForeign(['parent_id'])
      table.dropColumn('parent_id')
    })
  }
  if (await knex.schema.hasColumn('posts', 'is_pinned')) {
    await knex.schema.alterTable('posts', (table) => {
      table.dropColumn('is_pinned')
    })
  }
  if (await knex.schema.hasColumn('posts', 'is_highlighted')) {
    await knex.schema.alterTable('posts', (table) => {
      table.dropColumn('is_highlighted')
    })
  }
  if (await knex.schema.hasColumn('chat_messages', 'is_pinned')) {
    await knex.schema.alterTable('chat_messages', (table) => {
      table.dropColumn('is_pinned')
    })
  }
  if (await knex.schema.hasColumn('chats', 'outing_id')) {
    await knex.schema.alterTable('chats', (table) => {
      table.dropForeign(['outing_id'])
      table.dropColumn('outing_id')
    })
  }
}
