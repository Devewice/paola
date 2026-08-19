import { randomUUID } from 'node:crypto'
import type { Knex } from 'knex'
import { getDb } from '../../../db/knex.js'
import { SOCIAL_TABLES } from '../constants/social.constants.js'
import {
  SOCIAL_CHAT_KIND,
  SOCIAL_LIMITS,
  SOCIAL_MESSAGES,
  SOCIAL_POST_STATUS,
  SOCIAL_ROLE,
} from '../constants/social.constants.js'
import type {
  ActivityItem,
  ChatMessage,
  ChatThread,
  Community,
  CommunityPost,
  FriendRow,
  MemoryComment,
  OutingMeta,
  PublicParcero,
  SessionUser,
} from '../interfaces/social.interface.js'

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

const POST_SELECT = [
  `${SOCIAL_TABLES.POSTS}.id`,
  `${SOCIAL_TABLES.POSTS}.community_id`,
  `${SOCIAL_TABLES.USERS}.alias as author_alias`,
  `${SOCIAL_TABLES.POSTS}.body`,
  `${SOCIAL_TABLES.POSTS}.photo_src`,
  `${SOCIAL_TABLES.POSTS}.parent_id`,
  `${SOCIAL_TABLES.POSTS}.is_pinned`,
  `${SOCIAL_TABLES.POSTS}.is_highlighted`,
  `${SOCIAL_TABLES.POSTS}.created_at`,
] as const

function toPost(row: Record<string, unknown>): CommunityPost {
  const photoSrc = row.photo_src ? String(row.photo_src) : undefined
  return {
    id: String(row.id),
    communityId: String(row.community_id),
    authorAlias: String(row.author_alias),
    body: String(row.body),
    photoSrc,
    photos: photoSrc ? [photoSrc] : [],
    parentId: row.parent_id ? String(row.parent_id) : undefined,
    isPinned: Boolean(row.is_pinned),
    isHighlighted: Boolean(row.is_highlighted),
    canModerate: false,
    createdAt: String(row.created_at),
    reactions: [],
  }
}

export async function listPublicFeedRows(): Promise<CommunityPost[]> {
  const rows = await db()(SOCIAL_TABLES.POSTS)
    .join(SOCIAL_TABLES.USERS, `${SOCIAL_TABLES.USERS}.id`, `${SOCIAL_TABLES.POSTS}.author_id`)
    .select(...POST_SELECT)
    .where(`${SOCIAL_TABLES.POSTS}.status`, SOCIAL_POST_STATUS.PUBLISHED)
    .orderBy(`${SOCIAL_TABLES.POSTS}.is_pinned`, 'desc')
    .orderBy(`${SOCIAL_TABLES.POSTS}.created_at`, 'desc')
    .limit(SOCIAL_LIMITS.FEED_LIMIT)
  return hydratePosts(rows.map((row) => toPost(row as Record<string, unknown>)))
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
    .select(...POST_SELECT)
    .where(`${SOCIAL_TABLES.POSTS}.status`, SOCIAL_POST_STATUS.PUBLISHED)
    .whereNotNull(`${SOCIAL_TABLES.COMMUNITY_FOLLOWS}.id`)
    .orderBy(`${SOCIAL_TABLES.POSTS}.is_pinned`, 'desc')
    .orderBy(`${SOCIAL_TABLES.POSTS}.created_at`, 'desc')
    .limit(SOCIAL_LIMITS.FEED_FOLLOW_LIMIT)
  return hydratePosts(
    rows.map((row) => toPost(row as Record<string, unknown>)),
    userId,
  )
}

export async function insertPost(data: {
  id: string
  communityId: string
  authorId: string
  body: string
  photoSrc?: string
  parentId?: string
  waReminder?: boolean
}): Promise<void> {
  await db()(SOCIAL_TABLES.POSTS).insert({
    id: data.id,
    community_id: data.communityId,
    author_id: data.authorId,
    body: data.body,
    photo_src: data.photoSrc ?? null,
    parent_id: data.parentId ?? null,
    wa_reminder: Boolean(data.waReminder),
  })
}

export async function insertPostPhotos(postId: string, photos: readonly string[]): Promise<void> {
  if (!photos.length) return
  await db()(SOCIAL_TABLES.POST_PHOTOS).insert(
    photos.map((src, sort) => ({
      id: randomUUID(),
      post_id: postId,
      src,
      alt: null,
      sort,
    })),
  )
}

export async function listCommunityPosts(communityId: string, userId?: string): Promise<CommunityPost[]> {
  const rows = await db()(SOCIAL_TABLES.POSTS)
    .join(SOCIAL_TABLES.USERS, `${SOCIAL_TABLES.USERS}.id`, `${SOCIAL_TABLES.POSTS}.author_id`)
    .select(...POST_SELECT)
    .where(`${SOCIAL_TABLES.POSTS}.community_id`, communityId)
    .andWhere(`${SOCIAL_TABLES.POSTS}.status`, SOCIAL_POST_STATUS.PUBLISHED)
    .orderBy(`${SOCIAL_TABLES.POSTS}.is_pinned`, 'desc')
    .orderBy(`${SOCIAL_TABLES.POSTS}.created_at`, 'desc')
  return hydratePosts(
    rows.map((row) => toPost(row as Record<string, unknown>)),
    userId,
  )
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
    .andWhere(`${SOCIAL_TABLES.MEMORY_COMMENTS}.status`, 'publicado')
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
    .ignore()
}

export async function acceptFriendshipForReceiver(id: string, receiverId: string): Promise<number> {
  return db()(SOCIAL_TABLES.FRIENDSHIPS)
    .where({ id, receiver_id: receiverId, status: 'pending' })
    .update({ status: 'accepted' })
}

export async function blockFriendshipForUser(id: string, userId: string): Promise<number> {
  return db()(SOCIAL_TABLES.FRIENDSHIPS)
    .where({ id })
    .andWhere((query) => {
      void query.where({ requester_id: userId }).orWhere({ receiver_id: userId })
    })
    .update({ status: 'blocked' })
}

export async function listFriendshipsForUser(userId: string): Promise<FriendRow[]> {
  const rows = await db()(SOCIAL_TABLES.FRIENDSHIPS)
    .join(`${SOCIAL_TABLES.USERS} as requester`, 'requester.id', `${SOCIAL_TABLES.FRIENDSHIPS}.requester_id`)
    .join(`${SOCIAL_TABLES.USERS} as receiver`, 'receiver.id', `${SOCIAL_TABLES.FRIENDSHIPS}.receiver_id`)
    .select(
      `${SOCIAL_TABLES.FRIENDSHIPS}.id`,
      `${SOCIAL_TABLES.FRIENDSHIPS}.status`,
      `${SOCIAL_TABLES.FRIENDSHIPS}.requester_id`,
      `${SOCIAL_TABLES.FRIENDSHIPS}.receiver_id`,
      'requester.alias as requester_alias',
      'receiver.alias as receiver_alias',
    )
    .where((query) => {
      void query.where({ requester_id: userId }).orWhere({ receiver_id: userId })
    })
    .whereIn(`${SOCIAL_TABLES.FRIENDSHIPS}.status`, ['pending', 'accepted'])
    .orderBy(`${SOCIAL_TABLES.FRIENDSHIPS}.created_at`, 'desc')
  return rows.map((row) => ({
    id: String(row.id),
    status: row.status === 'accepted' ? 'accepted' : 'pending',
    requesterId: String(row.requester_id),
    receiverId: String(row.receiver_id),
    requesterAlias: String(row.requester_alias),
    receiverAlias: String(row.receiver_alias),
  }))
}

export async function findUserIdByAlias(alias: string): Promise<{ id: string; alias: string } | null> {
  const row = await db()(SOCIAL_TABLES.USERS).select('id', 'alias').where({ alias }).first()
  if (!row) return null
  return { id: String(row.id), alias: String(row.alias) }
}

export async function findPublicParceroByAlias(alias: string): Promise<PublicParcero | null> {
  const row = await db()(SOCIAL_TABLES.USERS)
    .select('id', 'alias', 'avatar_src', 'km', 'moto')
    .where({ alias, is_public: true })
    .first()
  if (!row) return null
  return {
    id: String(row.id),
    alias: String(row.alias),
    avatarSrc: row.avatar_src ? String(row.avatar_src) : undefined,
    km: Number(row.km ?? 0),
    moto: row.moto ? String(row.moto) : undefined,
  }
}

export async function setUserPublic(userId: string, isPublic: boolean): Promise<void> {
  await db()(SOCIAL_TABLES.USERS).where({ id: userId }).update({ is_public: isPublic })
}

export async function listUserChats(userId: string): Promise<ChatThread[]> {
  const mine = await db()(SOCIAL_TABLES.CHAT_MEMBERS)
    .join(SOCIAL_TABLES.CHATS, `${SOCIAL_TABLES.CHATS}.id`, `${SOCIAL_TABLES.CHAT_MEMBERS}.chat_id`)
    .select(
      `${SOCIAL_TABLES.CHATS}.id`,
      `${SOCIAL_TABLES.CHATS}.kind`,
      `${SOCIAL_TABLES.CHATS}.title`,
      `${SOCIAL_TABLES.CHATS}.outing_id`,
      `${SOCIAL_TABLES.CHATS}.is_silenced`,
    )
    .where(`${SOCIAL_TABLES.CHAT_MEMBERS}.user_id`, userId)
    .orderBy(`${SOCIAL_TABLES.CHATS}.created_at`, 'desc')

  const threads: ChatThread[] = []
  for (const row of mine) {
    const chatId = String(row.id)
    const peer = await db()(SOCIAL_TABLES.CHAT_MEMBERS)
      .join(SOCIAL_TABLES.USERS, `${SOCIAL_TABLES.USERS}.id`, `${SOCIAL_TABLES.CHAT_MEMBERS}.user_id`)
      .select(`${SOCIAL_TABLES.USERS}.id`, `${SOCIAL_TABLES.USERS}.alias`)
      .where(`${SOCIAL_TABLES.CHAT_MEMBERS}.chat_id`, chatId)
      .andWhere(`${SOCIAL_TABLES.CHAT_MEMBERS}.user_id`, '!=', userId)
      .first()
    threads.push({
      id: chatId,
      kind: String(row.kind),
      title: row.title ? String(row.title) : undefined,
      peerAlias: peer?.alias ? String(peer.alias) : undefined,
      peerId: peer?.id ? String(peer.id) : undefined,
      outingId: row.outing_id ? String(row.outing_id) : undefined,
      silenced: Boolean(row.is_silenced),
    })
  }
  return threads
}

export async function findChatMember(chatId: string, userId: string): Promise<boolean> {
  const row = await db()(SOCIAL_TABLES.CHAT_MEMBERS).select('id').where({ chat_id: chatId, user_id: userId }).first()
  return Boolean(row)
}

export async function findChatSilenced(chatId: string): Promise<boolean | null> {
  const row = await db()(SOCIAL_TABLES.CHATS).select('is_silenced').where({ id: chatId }).first()
  if (!row) return null
  return Boolean(row.is_silenced)
}

export async function findDirectChatBetween(userA: string, userB: string): Promise<string | null> {
  const row = await db()(`${SOCIAL_TABLES.CHATS} as chats`)
    .join(`${SOCIAL_TABLES.CHAT_MEMBERS} as a`, 'a.chat_id', 'chats.id')
    .join(`${SOCIAL_TABLES.CHAT_MEMBERS} as b`, 'b.chat_id', 'chats.id')
    .select('chats.id')
    .where('chats.kind', 'direct')
    .andWhere('a.user_id', userA)
    .andWhere('b.user_id', userB)
    .first()
  return row ? String(row.id) : null
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

export async function insertChat(data: { id: string; kind: string; title?: string; outingId?: string }): Promise<void> {
  await db()(SOCIAL_TABLES.CHATS).insert({
    id: data.id,
    kind: data.kind,
    title: data.title ?? null,
    outing_id: data.outingId ?? null,
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
  authorId?: string
  body?: string
  photoSrc?: string
  voiceSrc?: string
  isPinned?: boolean
}): Promise<void> {
  await db()(SOCIAL_TABLES.CHAT_MESSAGES).insert({
    id: data.id,
    chat_id: data.chatId,
    author_id: data.authorId ?? null,
    body: data.body ?? null,
    photo_src: data.photoSrc ?? null,
    voice_src: data.voiceSrc ?? null,
    is_pinned: Boolean(data.isPinned),
  })
}

export async function listChatMessages(chatId: string): Promise<ChatMessage[]> {
  const rows = await db()(SOCIAL_TABLES.CHAT_MESSAGES)
    .leftJoin(SOCIAL_TABLES.USERS, `${SOCIAL_TABLES.USERS}.id`, `${SOCIAL_TABLES.CHAT_MESSAGES}.author_id`)
    .select(
      `${SOCIAL_TABLES.CHAT_MESSAGES}.id`,
      `${SOCIAL_TABLES.CHAT_MESSAGES}.chat_id`,
      `${SOCIAL_TABLES.USERS}.alias as author_alias`,
      `${SOCIAL_TABLES.CHAT_MESSAGES}.body`,
      `${SOCIAL_TABLES.CHAT_MESSAGES}.photo_src`,
      `${SOCIAL_TABLES.CHAT_MESSAGES}.voice_src`,
      `${SOCIAL_TABLES.CHAT_MESSAGES}.is_pinned`,
      `${SOCIAL_TABLES.CHAT_MESSAGES}.created_at`,
    )
    .where(`${SOCIAL_TABLES.CHAT_MESSAGES}.chat_id`, chatId)
    .orderBy(`${SOCIAL_TABLES.CHAT_MESSAGES}.is_pinned`, 'desc')
    .orderBy(`${SOCIAL_TABLES.CHAT_MESSAGES}.created_at`, 'asc')
  return rows.map((row) => ({
    id: String(row.id),
    chatId: String(row.chat_id),
    authorAlias: row.author_alias ? String(row.author_alias) : SOCIAL_MESSAGES.PINNED_AUTHOR,
    body: row.body ? String(row.body) : undefined,
    photoSrc: row.photo_src ? String(row.photo_src) : undefined,
    voiceSrc: row.voice_src ? String(row.voice_src) : undefined,
    pinned: Boolean(row.is_pinned),
    createdAt: String(row.created_at),
  }))
}

export async function silenceChat(chatId: string): Promise<number> {
  return db()(SOCIAL_TABLES.CHATS).where({ id: chatId }).update({ is_silenced: true })
}

async function hydratePosts(posts: CommunityPost[], userId?: string): Promise<CommunityPost[]> {
  if (!posts.length) return posts
  const ids = posts.map((post) => post.id)
  const photoRows = await db()(SOCIAL_TABLES.POST_PHOTOS)
    .select('post_id', 'src', 'sort')
    .whereIn('post_id', ids)
    .orderBy('sort', 'asc')
  const photosByPost = new Map<string, string[]>()
  for (const row of photoRows) {
    const postId = String(row.post_id)
    const list = photosByPost.get(postId) ?? []
    list.push(String(row.src))
    photosByPost.set(postId, list)
  }

  const reactionRows = (await db()(SOCIAL_TABLES.POST_REACTIONS)
    .select('post_id', 'reaction')
    .count({ n: 'id' })
    .whereIn('post_id', ids)
    .groupBy('post_id', 'reaction')) as Array<{ post_id: unknown; reaction: unknown; n?: number | string }>
  const reactionsByPost = new Map<string, { reaction: string; count: number; mine?: boolean }[]>()
  for (const row of reactionRows) {
    const postId = String(row.post_id)
    const list = reactionsByPost.get(postId) ?? []
    list.push({ reaction: String(row.reaction), count: Number(row.n ?? 0) })
    reactionsByPost.set(postId, list)
  }

  const mine = new Set<string>()
  if (userId) {
    const mineRows = await db()(SOCIAL_TABLES.POST_REACTIONS)
      .select('post_id', 'reaction')
      .where({ user_id: userId })
      .whereIn('post_id', ids)
    for (const row of mineRows) {
      mine.add(`${String(row.post_id)}:${String(row.reaction)}`)
    }
  }

  const moderated = userId ? await listModeratedCommunityIds(userId) : new Set<string>()

  return posts.map((post) => {
    const album = photosByPost.get(post.id) ?? []
    const photos = album.length ? album : post.photos
    const reactions = (reactionsByPost.get(post.id) ?? []).map((item) => ({
      ...item,
      mine: mine.has(`${post.id}:${item.reaction}`),
    }))
    return {
      ...post,
      photos,
      photoSrc: photos[0] ?? post.photoSrc,
      reactions,
      canModerate: moderated.has(post.communityId),
    }
  })
}

export async function listModeratedCommunityIds(userId: string): Promise<Set<string>> {
  const rows = await db()(SOCIAL_TABLES.COMMUNITY_MEMBERS)
    .select('community_id')
    .where({ user_id: userId, role: SOCIAL_ROLE.MODERADOR })
  return new Set(rows.map((row) => String(row.community_id)))
}

export async function findCommunityMemberRole(communityId: string, userId: string): Promise<string | null> {
  const row = await db()(SOCIAL_TABLES.COMMUNITY_MEMBERS)
    .select('role')
    .where({ community_id: communityId, user_id: userId })
    .first()
  return row ? String(row.role) : null
}

export async function findCommunityById(id: string): Promise<Community | null> {
  const row = await db()(SOCIAL_TABLES.COMMUNITIES)
    .select('id', 'slug', 'name', 'description', 'rules', 'whatsapp_group_href')
    .where({ id })
    .first()
  if (!row) return null
  return {
    id: String(row.id),
    slug: String(row.slug),
    name: String(row.name),
    description: String(row.description),
    rules: String(row.rules),
    whatsappGroupHref: row.whatsapp_group_href ? String(row.whatsapp_group_href) : undefined,
  }
}

export async function findPostById(id: string): Promise<{
  id: string
  communityId: string
  parentId?: string
  status: string
} | null> {
  const row = await db()(SOCIAL_TABLES.POSTS)
    .select('id', 'community_id', 'parent_id', 'status')
    .where({ id })
    .first()
  if (!row) return null
  return {
    id: String(row.id),
    communityId: String(row.community_id),
    parentId: row.parent_id ? String(row.parent_id) : undefined,
    status: String(row.status),
  }
}

export async function postDepth(postId: string): Promise<number> {
  let depth = 0
  let current: string | undefined = postId
  const seen = new Set<string>()
  while (current) {
    if (seen.has(current)) break
    seen.add(current)
    const parent = await findPostParentId(current)
    if (!parent) break
    depth += 1
    current = parent
    if (depth > SOCIAL_LIMITS.POST_MAX_DEPTH + 1) break
  }
  return depth
}

async function findPostParentId(id: string): Promise<string | undefined> {
  const row = await db()(SOCIAL_TABLES.POSTS).select('parent_id').where({ id }).first()
  return row?.parent_id ? String(row.parent_id) : undefined
}

export async function setPostStatus(id: string, status: string): Promise<number> {
  return db()(SOCIAL_TABLES.POSTS).where({ id }).update({ status })
}

export async function togglePostPinned(id: string): Promise<boolean | null> {
  const row = await db()(SOCIAL_TABLES.POSTS).select('is_pinned').where({ id }).first()
  if (!row) return null
  const next = !Boolean(row.is_pinned)
  await db()(SOCIAL_TABLES.POSTS).where({ id }).update({ is_pinned: next })
  return next
}

export async function togglePostHighlighted(id: string): Promise<boolean | null> {
  const row = await db()(SOCIAL_TABLES.POSTS).select('is_highlighted').where({ id }).first()
  if (!row) return null
  const next = !Boolean(row.is_highlighted)
  await db()(SOCIAL_TABLES.POSTS).where({ id }).update({ is_highlighted: next })
  return next
}

export async function findPostReaction(
  postId: string,
  userId: string,
  reaction: string,
): Promise<string | null> {
  const row = await db()(SOCIAL_TABLES.POST_REACTIONS)
    .select('id')
    .where({ post_id: postId, user_id: userId, reaction })
    .first()
  return row ? String(row.id) : null
}

export async function insertPostReaction(data: {
  id: string
  postId: string
  userId: string
  reaction: string
}): Promise<void> {
  await db()(SOCIAL_TABLES.POST_REACTIONS).insert({
    id: data.id,
    post_id: data.postId,
    user_id: data.userId,
    reaction: data.reaction,
  })
}

export async function deletePostReaction(id: string): Promise<void> {
  await db()(SOCIAL_TABLES.POST_REACTIONS).where({ id }).del()
}

export async function insertModerationAction(data: {
  id: string
  communityId: string
  actorId?: string
  action: string
  targetType: string
  targetId: string
}): Promise<void> {
  await db()(SOCIAL_TABLES.MODERATION_ACTIONS).insert({
    id: data.id,
    community_id: data.communityId,
    actor_id: data.actorId ?? null,
    action: data.action,
    target_type: data.targetType,
    target_id: data.targetId,
  })
}

export async function setCommunityMemberRole(data: {
  id: string
  communityId: string
  userId: string
  role: string
}): Promise<void> {
  const existing = await db()(SOCIAL_TABLES.COMMUNITY_MEMBERS)
    .select('id')
    .where({ community_id: data.communityId, user_id: data.userId })
    .first()
  if (existing) {
    await db()(SOCIAL_TABLES.COMMUNITY_MEMBERS).where({ id: String(existing.id) }).update({ role: data.role })
    return
  }
  await db()(SOCIAL_TABLES.COMMUNITY_MEMBERS).insert({
    id: data.id,
    community_id: data.communityId,
    user_id: data.userId,
    role: data.role,
  })
}

export async function findOutingMeta(id: string): Promise<OutingMeta | null> {
  const row = await db()(SOCIAL_TABLES.OUTINGS).select('id', 'title', 'status').where({ id }).first()
  if (!row) return null
  return {
    id: String(row.id),
    title: String(row.title),
    status: String(row.status),
  }
}

export async function findTicketForUserOuting(outingId: string, userId: string): Promise<boolean> {
  const row = await db()(SOCIAL_TABLES.TICKETS)
    .select('id')
    .where({ outing_id: outingId, user_id: userId })
    .first()
  return Boolean(row)
}

export async function findChatByOutingId(outingId: string): Promise<string | null> {
  const row = await db()(SOCIAL_TABLES.CHATS).select('id').where({ outing_id: outingId }).first()
  return row ? String(row.id) : null
}

export async function findOrCreateOutingChat(outing: OutingMeta): Promise<string> {
  const existing = await findChatByOutingId(outing.id)
  if (existing) return existing
  const chatId = randomUUID()
  await insertChat({
    id: chatId,
    kind: SOCIAL_CHAT_KIND.OUTING,
    title: outing.title,
    outingId: outing.id,
  })
  return chatId
}

export async function listActivityRows(): Promise<ActivityItem[]> {
  const [outingRows, memoryRows, postRows] = await Promise.all([
    db()(SOCIAL_TABLES.OUTINGS)
      .select('id', 'title', 'created_at')
      .orderBy('created_at', 'desc')
      .limit(SOCIAL_LIMITS.ACTIVITY_LIMIT),
    db()(SOCIAL_TABLES.MEMORIES)
      .join(SOCIAL_TABLES.OUTINGS, `${SOCIAL_TABLES.OUTINGS}.id`, `${SOCIAL_TABLES.MEMORIES}.outing_id`)
      .select(
        `${SOCIAL_TABLES.MEMORIES}.id`,
        `${SOCIAL_TABLES.OUTINGS}.title`,
        `${SOCIAL_TABLES.MEMORIES}.created_at`,
      )
      .orderBy(`${SOCIAL_TABLES.MEMORIES}.created_at`, 'desc')
      .limit(SOCIAL_LIMITS.ACTIVITY_LIMIT),
    db()(SOCIAL_TABLES.POSTS)
      .join(SOCIAL_TABLES.USERS, `${SOCIAL_TABLES.USERS}.id`, `${SOCIAL_TABLES.POSTS}.author_id`)
      .select(
        `${SOCIAL_TABLES.POSTS}.id`,
        `${SOCIAL_TABLES.POSTS}.body`,
        `${SOCIAL_TABLES.POSTS}.is_highlighted`,
        `${SOCIAL_TABLES.POSTS}.created_at`,
        `${SOCIAL_TABLES.USERS}.alias as author_alias`,
      )
      .where(`${SOCIAL_TABLES.POSTS}.status`, SOCIAL_POST_STATUS.PUBLISHED)
      .whereNull(`${SOCIAL_TABLES.POSTS}.parent_id`)
      .orderBy(`${SOCIAL_TABLES.POSTS}.created_at`, 'desc')
      .limit(SOCIAL_LIMITS.ACTIVITY_LIMIT),
  ])

  const items: ActivityItem[] = [
    ...outingRows.map((row) => ({
      kind: 'outing' as const,
      id: String(row.id),
      title: String(row.title),
      createdAt: String(row.created_at),
      highlighted: false,
    })),
    ...memoryRows.map((row) => ({
      kind: 'memory' as const,
      id: String(row.id),
      title: String(row.title),
      createdAt: String(row.created_at),
      highlighted: false,
    })),
    ...postRows.map((row) => ({
      kind: 'post' as const,
      id: String(row.id),
      title: `${String(row.author_alias)}: ${String(row.body).slice(0, 80)}`,
      createdAt: String(row.created_at),
      highlighted: Boolean(row.is_highlighted),
    })),
  ]

  items.sort((left, right) => {
    if (left.highlighted !== right.highlighted) return left.highlighted ? -1 : 1
    return right.createdAt.localeCompare(left.createdAt)
  })
  return items.slice(0, SOCIAL_LIMITS.ACTIVITY_LIMIT)
}

export function nestPublishedPosts(posts: CommunityPost[]): CommunityPost[] {
  const byParent = new Map<string, CommunityPost[]>()
  for (const post of posts) {
    if (!post.parentId) continue
    const list = byParent.get(post.parentId) ?? []
    list.push(post)
    byParent.set(post.parentId, list)
  }
  const attach = (post: CommunityPost, level: number): CommunityPost => {
    if (level >= SOCIAL_LIMITS.POST_MAX_DEPTH) return { ...post, replies: [] }
    const children = (byParent.get(post.id) ?? []).map((child) => attach(child, level + 1))
    return { ...post, replies: children }
  }
  return posts.filter((post) => !post.parentId).map((post) => attach(post, 0))
}
