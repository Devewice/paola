import type { Knex } from 'knex'
import { getDb } from '../../../db/knex.js'
import { SOCIAL_TABLES } from '../constants/social.constants.js'
import type { ChatMessage, Community, CommunityPost, MemoryComment, SessionUser } from '../interfaces/social.interface.js'

const db = () => getDb()

export async function insertUser(user: {
  id: string
  email: string
  alias: string
  passwordHash: string
}): Promise<void> {
  await db()(SOCIAL_TABLES.USERS).insert({
    id: user.id,
    email: user.email,
    alias: user.alias,
    password_hash: user.passwordHash,
  })
}

export async function findUserByEmail(email: string): Promise<(SessionUser & { passwordHash: string }) | null> {
  const row = await db()(SOCIAL_TABLES.USERS)
    .select('id', 'email', 'alias', 'password_hash', 'km', 'moto', 'is_public')
    .where({ email })
    .first()
  if (!row) return null
  return {
    id: String(row.id),
    email: String(row.email),
    alias: String(row.alias),
    passwordHash: String(row.password_hash),
    km: Number(row.km ?? 0),
    moto: row.moto ? String(row.moto) : undefined,
    isPublic: Boolean(row.is_public),
  }
}

export async function insertSession(session: { id: string; userId: string; expiresAt: string }): Promise<void> {
  await db()(SOCIAL_TABLES.SESSIONS).insert({
    id: session.id,
    user_id: session.userId,
    expires_at: session.expiresAt,
  })
}

export async function findSessionUser(sessionId: string): Promise<SessionUser | null> {
  const row = await db()(SOCIAL_TABLES.SESSIONS)
    .join(SOCIAL_TABLES.USERS, `${SOCIAL_TABLES.USERS}.id`, `${SOCIAL_TABLES.SESSIONS}.user_id`)
    .select(
      `${SOCIAL_TABLES.USERS}.id`,
      `${SOCIAL_TABLES.USERS}.email`,
      `${SOCIAL_TABLES.USERS}.alias`,
      `${SOCIAL_TABLES.USERS}.km`,
      `${SOCIAL_TABLES.USERS}.moto`,
      `${SOCIAL_TABLES.USERS}.is_public`,
      `${SOCIAL_TABLES.SESSIONS}.expires_at`,
    )
    .where(`${SOCIAL_TABLES.SESSIONS}.id`, sessionId)
    .first()
  if (!row) return null
  const expiresAt = new Date(String(row.expires_at))
  if (Number.isNaN(expiresAt.valueOf()) || expiresAt.getTime() < Date.now()) return null
  return {
    id: String(row.id),
    email: String(row.email),
    alias: String(row.alias),
    km: Number(row.km ?? 0),
    moto: row.moto ? String(row.moto) : undefined,
    isPublic: Boolean(row.is_public),
  }
}

export async function listPanelRows(userId: string): Promise<{
  tickets: Record<string, unknown>[]
  orders: Record<string, unknown>[]
  notifications: Record<string, unknown>[]
}> {
  const [tickets, orders, notifications] = await Promise.all([
    db()(SOCIAL_TABLES.TICKETS).select('id', 'outing_id', 'name').where({ user_id: userId }).orderBy('created_at', 'desc'),
    db()(SOCIAL_TABLES.ORDERS).select('id', 'item_title', 'status').where({ user_id: userId }).orderBy('created_at', 'desc'),
    db()(SOCIAL_TABLES.NOTIFICATIONS).select('id', 'kind', 'message', 'is_read').where({ user_id: userId }).orderBy('created_at', 'desc'),
  ])
  return { tickets, orders, notifications }
}

export async function listCommunities(): Promise<Community[]> {
  const rows = await db()(SOCIAL_TABLES.COMMUNITIES)
    .select('id', 'slug', 'name', 'description', 'rules', 'whatsapp_group_href')
    .orderBy('created_at', 'desc')
  return rows.map((row) => ({
    id: String(row.id),
    slug: String(row.slug),
    name: String(row.name),
    description: String(row.description),
    rules: String(row.rules),
    whatsappGroupHref: row.whatsapp_group_href ? String(row.whatsapp_group_href) : undefined,
  }))
}

export async function insertCommunity(data: {
  id: string
  slug: string
  name: string
  description: string
  rules: string
  whatsappGroupHref?: string
}): Promise<void> {
  await db()(SOCIAL_TABLES.COMMUNITIES).insert({
    id: data.id,
    slug: data.slug,
    name: data.name,
    description: data.description,
    rules: data.rules,
    whatsapp_group_href: data.whatsappGroupHref ?? null,
  })
}

export async function insertCommunityMember(data: { id: string; communityId: string; userId: string; role?: string }): Promise<void> {
  await db()(SOCIAL_TABLES.COMMUNITY_MEMBERS)
    .insert({
      id: data.id,
      community_id: data.communityId,
      user_id: data.userId,
      role: data.role ?? 'member',
    })
    .onConflict(['community_id', 'user_id'])
    .ignore()
}

export async function deleteCommunityMember(communityId: string, userId: string): Promise<void> {
  await db()(SOCIAL_TABLES.COMMUNITY_MEMBERS).where({ community_id: communityId, user_id: userId }).del()
}

export async function insertCommunityFollow(data: { id: string; communityId: string; userId: string }): Promise<void> {
  await db()(SOCIAL_TABLES.COMMUNITY_FOLLOWS)
    .insert({ id: data.id, community_id: data.communityId, user_id: data.userId })
    .onConflict(['user_id', 'community_id'])
    .ignore()
}

export async function listFeedRows(userId: string): Promise<CommunityPost[]> {
  const rows = await db()(SOCIAL_TABLES.POSTS)
    .join(SOCIAL_TABLES.USERS, `${SOCIAL_TABLES.USERS}.id`, `${SOCIAL_TABLES.POSTS}.author_id`)
    .leftJoin(
      SOCIAL_TABLES.COMMUNITY_FOLLOWS,
      function joinFollow(this: Knex.JoinClause) {
        this.on(`${SOCIAL_TABLES.COMMUNITY_FOLLOWS}.community_id`, '=', `${SOCIAL_TABLES.POSTS}.community_id`).andOnVal(
          `${SOCIAL_TABLES.COMMUNITY_FOLLOWS}.user_id`,
          '=',
          userId,
        )
      },
    )
    .select(
      `${SOCIAL_TABLES.POSTS}.id`,
      `${SOCIAL_TABLES.POSTS}.community_id`,
      `${SOCIAL_TABLES.USERS}.alias as author_alias`,
      `${SOCIAL_TABLES.POSTS}.body`,
      `${SOCIAL_TABLES.POSTS}.photo_src`,
      `${SOCIAL_TABLES.POSTS}.created_at`,
    )
    .where(`${SOCIAL_TABLES.POSTS}.status`, 'publicado')
    .whereNotNull(`${SOCIAL_TABLES.COMMUNITY_FOLLOWS}.id`)
    .orderBy(`${SOCIAL_TABLES.POSTS}.created_at`, 'desc')
    .limit(60)
  return rows.map((row) => ({
    id: String(row.id),
    communityId: String(row.community_id),
    authorAlias: String(row.author_alias),
    body: String(row.body),
    photoSrc: row.photo_src ? String(row.photo_src) : undefined,
    createdAt: String(row.created_at),
  }))
}

export async function insertPost(data: {
  id: string
  communityId: string
  authorId: string
  body: string
  photoSrc?: string
  waReminder?: boolean
}): Promise<void> {
  await db()(SOCIAL_TABLES.POSTS).insert({
    id: data.id,
    community_id: data.communityId,
    author_id: data.authorId,
    body: data.body,
    photo_src: data.photoSrc ?? null,
    wa_reminder: Boolean(data.waReminder),
  })
}

export async function listCommunityPosts(communityId: string): Promise<CommunityPost[]> {
  const rows = await db()(SOCIAL_TABLES.POSTS)
    .join(SOCIAL_TABLES.USERS, `${SOCIAL_TABLES.USERS}.id`, `${SOCIAL_TABLES.POSTS}.author_id`)
    .select(
      `${SOCIAL_TABLES.POSTS}.id`,
      `${SOCIAL_TABLES.POSTS}.community_id`,
      `${SOCIAL_TABLES.USERS}.alias as author_alias`,
      `${SOCIAL_TABLES.POSTS}.body`,
      `${SOCIAL_TABLES.POSTS}.photo_src`,
      `${SOCIAL_TABLES.POSTS}.created_at`,
    )
    .where(`${SOCIAL_TABLES.POSTS}.community_id`, communityId)
    .andWhere(`${SOCIAL_TABLES.POSTS}.status`, 'publicado')
    .orderBy(`${SOCIAL_TABLES.POSTS}.created_at`, 'desc')
  return rows.map((row) => ({
    id: String(row.id),
    communityId: String(row.community_id),
    authorAlias: String(row.author_alias),
    body: String(row.body),
    photoSrc: row.photo_src ? String(row.photo_src) : undefined,
    createdAt: String(row.created_at),
  }))
}

export async function insertMemoryComment(data: {
  id: string
  memoryId: string
  userId: string
  body: string
  parentId?: string
}): Promise<void> {
  await db()(SOCIAL_TABLES.MEMORY_COMMENTS).insert({
    id: data.id,
    memory_id: data.memoryId,
    user_id: data.userId,
    body: data.body,
    parent_id: data.parentId ?? null,
  })
}

export async function listMemoryComments(memoryId: string): Promise<MemoryComment[]> {
  const rows = await db()(SOCIAL_TABLES.MEMORY_COMMENTS)
    .join(SOCIAL_TABLES.USERS, `${SOCIAL_TABLES.USERS}.id`, `${SOCIAL_TABLES.MEMORY_COMMENTS}.user_id`)
    .select(
      `${SOCIAL_TABLES.MEMORY_COMMENTS}.id`,
      `${SOCIAL_TABLES.MEMORY_COMMENTS}.memory_id`,
      `${SOCIAL_TABLES.USERS}.alias as author_alias`,
      `${SOCIAL_TABLES.MEMORY_COMMENTS}.body`,
      `${SOCIAL_TABLES.MEMORY_COMMENTS}.status`,
      `${SOCIAL_TABLES.MEMORY_COMMENTS}.parent_id`,
      `${SOCIAL_TABLES.MEMORY_COMMENTS}.created_at`,
    )
    .where(`${SOCIAL_TABLES.MEMORY_COMMENTS}.memory_id`, memoryId)
    .andWhere((qb) =>
      qb.where(`${SOCIAL_TABLES.MEMORY_COMMENTS}.status`, 'publicado').orWhere(
        `${SOCIAL_TABLES.MEMORY_COMMENTS}.status`,
        'en_revision',
      ),
    )
    .orderBy(`${SOCIAL_TABLES.MEMORY_COMMENTS}.created_at`, 'asc')
  return rows.map((row) => ({
    id: String(row.id),
    memoryId: String(row.memory_id),
    authorAlias: String(row.author_alias),
    body: String(row.body),
    parentId: row.parent_id ? String(row.parent_id) : undefined,
    status: String(row.status) as MemoryComment['status'],
    createdAt: String(row.created_at),
  }))
}

export async function insertCommentReaction(data: { id: string; commentId: string; userId: string; reaction: string }): Promise<void> {
  await db()(SOCIAL_TABLES.COMMENT_REACTIONS)
    .insert({
      id: data.id,
      comment_id: data.commentId,
      user_id: data.userId,
      reaction: data.reaction,
    })
    .onConflict(['comment_id', 'user_id', 'reaction'])
    .ignore()
}

export async function insertFriendship(data: { id: string; requesterId: string; receiverId: string }): Promise<void> {
  await db()(SOCIAL_TABLES.FRIENDSHIPS)
    .insert({
      id: data.id,
      requester_id: data.requesterId,
      receiver_id: data.receiverId,
    })
    .onConflict(['requester_id', 'receiver_id'])
    .merge()
}

export async function updateFriendshipStatus(id: string, status: 'accepted' | 'blocked'): Promise<number> {
  return db()(SOCIAL_TABLES.FRIENDSHIPS).where({ id }).update({ status })
}

export async function insertUserFollow(data: { id: string; followerId: string; targetUserId: string }): Promise<void> {
  await db()(SOCIAL_TABLES.USER_FOLLOWS)
    .insert({
      id: data.id,
      follower_id: data.followerId,
      target_user_id: data.targetUserId,
    })
    .onConflict(['follower_id', 'target_user_id'])
    .ignore()
}

export async function insertChat(data: { id: string; kind: string; title?: string }): Promise<void> {
  await db()(SOCIAL_TABLES.CHATS).insert({
    id: data.id,
    kind: data.kind,
    title: data.title ?? null,
  })
}

export async function insertChatMember(data: { id: string; chatId: string; userId: string }): Promise<void> {
  await db()(SOCIAL_TABLES.CHAT_MEMBERS)
    .insert({
      id: data.id,
      chat_id: data.chatId,
      user_id: data.userId,
    })
    .onConflict(['chat_id', 'user_id'])
    .ignore()
}

export async function insertChatMessage(data: {
  id: string
  chatId: string
  authorId: string
  body?: string
  photoSrc?: string
  voiceSrc?: string
}): Promise<void> {
  await db()(SOCIAL_TABLES.CHAT_MESSAGES).insert({
    id: data.id,
    chat_id: data.chatId,
    author_id: data.authorId,
    body: data.body ?? null,
    photo_src: data.photoSrc ?? null,
    voice_src: data.voiceSrc ?? null,
  })
}

export async function listChatMessages(chatId: string): Promise<ChatMessage[]> {
  const rows = await db()(SOCIAL_TABLES.CHAT_MESSAGES)
    .join(SOCIAL_TABLES.USERS, `${SOCIAL_TABLES.USERS}.id`, `${SOCIAL_TABLES.CHAT_MESSAGES}.author_id`)
    .select(
      `${SOCIAL_TABLES.CHAT_MESSAGES}.id`,
      `${SOCIAL_TABLES.CHAT_MESSAGES}.chat_id`,
      `${SOCIAL_TABLES.USERS}.alias as author_alias`,
      `${SOCIAL_TABLES.CHAT_MESSAGES}.body`,
      `${SOCIAL_TABLES.CHAT_MESSAGES}.photo_src`,
      `${SOCIAL_TABLES.CHAT_MESSAGES}.voice_src`,
      `${SOCIAL_TABLES.CHAT_MESSAGES}.created_at`,
    )
    .where(`${SOCIAL_TABLES.CHAT_MESSAGES}.chat_id`, chatId)
    .orderBy(`${SOCIAL_TABLES.CHAT_MESSAGES}.created_at`, 'asc')
  return rows.map((row) => ({
    id: String(row.id),
    chatId: String(row.chat_id),
    authorAlias: String(row.author_alias),
    body: row.body ? String(row.body) : undefined,
    photoSrc: row.photo_src ? String(row.photo_src) : undefined,
    voiceSrc: row.voice_src ? String(row.voice_src) : undefined,
    createdAt: String(row.created_at),
  }))
}

export async function silenceChat(chatId: string): Promise<number> {
  return db()(SOCIAL_TABLES.CHATS).where({ id: chatId }).update({ is_silenced: true })
}
