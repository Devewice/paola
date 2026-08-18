import type { Knex } from 'knex'
import { createTableOnce } from '../table.js'

export async function up(knex: Knex): Promise<void> {
  await createTableOnce(knex, 'fines', (table) => {
    table.string('id', 64).primary()
    table.string('title', 200).notNullable()
    table.text('guide').notNullable()
    table.string('official_href', 500).notNullable()
    table.text('disclaimer').notNullable()
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
  })

  await createTableOnce(knex, 'users', (table) => {
    table.string('id', 64).primary()
    table.string('email', 160).notNullable().unique()
    table.string('password_hash', 255).notNullable()
    table.string('alias', 80).notNullable().unique()
    table.string('avatar_src', 500).nullable()
    table.integer('km').notNullable().defaultTo(0)
    table.string('moto', 120).nullable()
    table.boolean('is_public').notNullable().defaultTo(false)
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
  })

  await createTableOnce(knex, 'sessions', (table) => {
    table.string('id', 64).primary()
    table.string('user_id', 64).notNullable()
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.timestamp('expires_at').notNullable()
    table.index(['user_id'], 'idx_sessions_user')
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
  })

  const ticketsHasUser = await knex.schema.hasColumn('tickets', 'user_id')
  if (!ticketsHasUser) {
    await knex.schema.alterTable('tickets', (table) => {
      table.string('user_id', 64).nullable()
      table.index(['user_id'], 'idx_tickets_user')
      table.foreign('user_id').references('id').inTable('users').onDelete('SET NULL')
    })
  }

  const ordersHasUser = await knex.schema.hasColumn('orders', 'user_id')
  if (!ordersHasUser) {
    await knex.schema.alterTable('orders', (table) => {
      table.string('user_id', 64).nullable()
      table.index(['user_id'], 'idx_orders_user')
      table.foreign('user_id').references('id').inTable('users').onDelete('SET NULL')
    })
  }

  await createTableOnce(knex, 'reports', (table) => {
    table.string('id', 64).primary()
    table.string('user_id', 64).nullable()
    table.string('title', 200).notNullable()
    table.text('what_happened').notNullable()
    table.string('where_text', 200).notNullable()
    table.dateTime('happened_at').notNullable()
    table.string('evidence_src', 500).nullable()
    table
      .enu('moderation_status', ['in_review', 'published', 'hidden', 'rejected'])
      .notNullable()
      .defaultTo('in_review')
    table.text('moderation_note').nullable()
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.index(['moderation_status'], 'idx_reports_status')
    table.foreign('user_id').references('id').inTable('users').onDelete('SET NULL')
  })

  await createTableOnce(knex, 'memberships', (table) => {
    table.string('id', 64).primary()
    table.string('user_id', 64).notNullable()
    table.integer('price_cop').nullable()
    table.string('period_label', 80).nullable()
    table.text('benefits_text').nullable()
    table.enu('status', ['pendiente_definicion', 'activa', 'vencida']).notNullable().defaultTo('pendiente_definicion')
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
  })

  await createTableOnce(knex, 'communities', (table) => {
    table.string('id', 64).primary()
    table.string('slug', 120).notNullable().unique()
    table.string('name', 140).notNullable()
    table.text('description').notNullable()
    table.text('rules').notNullable()
    table.string('cover_src', 500).nullable()
    table.string('whatsapp_group_href', 500).nullable()
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
  })

  await createTableOnce(knex, 'community_members', (table) => {
    table.string('id', 64).primary()
    table.string('community_id', 64).notNullable()
    table.string('user_id', 64).notNullable()
    table.enu('role', ['member', 'moderador']).notNullable().defaultTo('member')
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.unique(['community_id', 'user_id'])
    table.foreign('community_id').references('id').inTable('communities').onDelete('CASCADE')
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
  })

  await createTableOnce(knex, 'memory_comments', (table) => {
    table.string('id', 64).primary()
    table.string('memory_id', 64).notNullable()
    table.string('user_id', 64).notNullable()
    table.string('parent_id', 64).nullable()
    table.text('body').notNullable()
    table.enu('status', ['en_revision', 'publicado', 'rechazado', 'oculto']).notNullable().defaultTo('en_revision')
    table.boolean('is_pinned').notNullable().defaultTo(false)
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.foreign('memory_id').references('id').inTable('memories').onDelete('CASCADE')
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
    table.foreign('parent_id').references('id').inTable('memory_comments').onDelete('CASCADE')
  })

  await createTableOnce(knex, 'comment_reactions', (table) => {
    table.string('id', 64).primary()
    table.string('comment_id', 64).notNullable()
    table.string('user_id', 64).notNullable()
    table.string('reaction', 24).notNullable()
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.unique(['comment_id', 'user_id', 'reaction'])
    table.foreign('comment_id').references('id').inTable('memory_comments').onDelete('CASCADE')
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
  })

  await createTableOnce(knex, 'notifications', (table) => {
    table.string('id', 64).primary()
    table.string('user_id', 64).notNullable()
    table.string('kind', 60).notNullable()
    table.text('message').notNullable()
    table.boolean('is_read').notNullable().defaultTo(false)
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
  })

  await createTableOnce(knex, 'friendships', (table) => {
    table.string('id', 64).primary()
    table.string('requester_id', 64).notNullable()
    table.string('receiver_id', 64).notNullable()
    table.enu('status', ['pending', 'accepted', 'blocked']).notNullable().defaultTo('pending')
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.unique(['requester_id', 'receiver_id'])
    table.foreign('requester_id').references('id').inTable('users').onDelete('CASCADE')
    table.foreign('receiver_id').references('id').inTable('users').onDelete('CASCADE')
  })

  await createTableOnce(knex, 'user_follows', (table) => {
    table.string('id', 64).primary()
    table.string('follower_id', 64).notNullable()
    table.string('target_user_id', 64).notNullable()
    table.boolean('is_muted').notNullable().defaultTo(false)
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.unique(['follower_id', 'target_user_id'])
    table.foreign('follower_id').references('id').inTable('users').onDelete('CASCADE')
    table.foreign('target_user_id').references('id').inTable('users').onDelete('CASCADE')
  })

  await createTableOnce(knex, 'community_follows', (table) => {
    table.string('id', 64).primary()
    table.string('user_id', 64).notNullable()
    table.string('community_id', 64).notNullable()
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.unique(['user_id', 'community_id'])
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
    table.foreign('community_id').references('id').inTable('communities').onDelete('CASCADE')
  })

  await createTableOnce(knex, 'posts', (table) => {
    table.string('id', 64).primary()
    table.string('community_id', 64).notNullable()
    table.string('author_id', 64).notNullable()
    table.text('body').notNullable()
    table.string('photo_src', 500).nullable()
    table.boolean('wa_reminder').notNullable().defaultTo(false)
    table.enu('status', ['publicado', 'oculto']).notNullable().defaultTo('publicado')
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.foreign('community_id').references('id').inTable('communities').onDelete('CASCADE')
    table.foreign('author_id').references('id').inTable('users').onDelete('CASCADE')
  })

  await createTableOnce(knex, 'post_reactions', (table) => {
    table.string('id', 64).primary()
    table.string('post_id', 64).notNullable()
    table.string('user_id', 64).notNullable()
    table.string('reaction', 24).notNullable()
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.unique(['post_id', 'user_id', 'reaction'])
    table.foreign('post_id').references('id').inTable('posts').onDelete('CASCADE')
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
  })

  await createTableOnce(knex, 'chats', (table) => {
    table.string('id', 64).primary()
    table.string('kind', 20).notNullable()
    table.string('title', 160).nullable()
    table.boolean('is_silenced').notNullable().defaultTo(false)
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
  })

  await createTableOnce(knex, 'chat_members', (table) => {
    table.string('id', 64).primary()
    table.string('chat_id', 64).notNullable()
    table.string('user_id', 64).notNullable()
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.unique(['chat_id', 'user_id'])
    table.foreign('chat_id').references('id').inTable('chats').onDelete('CASCADE')
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
  })

  await createTableOnce(knex, 'chat_messages', (table) => {
    table.string('id', 64).primary()
    table.string('chat_id', 64).notNullable()
    table.string('author_id', 64).notNullable()
    table.string('body', 2000).nullable()
    table.string('photo_src', 500).nullable()
    table.string('voice_src', 500).nullable()
    table.boolean('is_reported').notNullable().defaultTo(false)
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.foreign('chat_id').references('id').inTable('chats').onDelete('CASCADE')
    table.foreign('author_id').references('id').inTable('users').onDelete('CASCADE')
  })

  await createTableOnce(knex, 'outing_routes', (table) => {
    table.string('id', 64).primary()
    table.string('outing_id', 64).notNullable().unique()
    table.string('map_href', 500).nullable()
    table.text('preview_text').nullable()
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.foreign('outing_id').references('id').inTable('outings').onDelete('CASCADE')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('outing_routes')
  await knex.schema.dropTableIfExists('chat_messages')
  await knex.schema.dropTableIfExists('chat_members')
  await knex.schema.dropTableIfExists('chats')
  await knex.schema.dropTableIfExists('post_reactions')
  await knex.schema.dropTableIfExists('posts')
  await knex.schema.dropTableIfExists('community_follows')
  await knex.schema.dropTableIfExists('user_follows')
  await knex.schema.dropTableIfExists('friendships')
  await knex.schema.dropTableIfExists('notifications')
  await knex.schema.dropTableIfExists('comment_reactions')
  await knex.schema.dropTableIfExists('memory_comments')
  await knex.schema.dropTableIfExists('community_members')
  await knex.schema.dropTableIfExists('communities')
  await knex.schema.dropTableIfExists('memberships')
  await knex.schema.dropTableIfExists('reports')
  await knex.schema.dropTableIfExists('denuncias')
  await knex.schema.dropTableIfExists('sessions')
  await knex.schema.dropTableIfExists('users')
  await knex.schema.dropTableIfExists('fines')
  await knex.schema.dropTableIfExists('comparendos')
}
