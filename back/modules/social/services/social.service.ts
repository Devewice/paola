import { randomUUID } from 'node:crypto'
import { fail } from '../../../http/fail.js'
import type { Parsed } from '../../../http/types.js'
import {
  acceptFriendshipForReceiver,
  blockFriendshipForUser,
  deleteCommunityMember,
  deletePostReaction,
  findChatMember,
  findChatSilenced,
  findCommunityById,
  findCommunityMemberRole,
  findDirectChatBetween,
  findOrCreateOutingChat,
  findOutingMeta,
  findPostById,
  findPostReaction,
  findPublicParceroByAlias,
  findSessionUser,
  findTicketForUserOuting,
  findUserByEmail,
  findUserIdByAlias,
  insertChat,
  insertChatMember,
  insertChatMessage,
  insertCommentReaction,
  insertCommunity,
  insertCommunityFollow,
  insertCommunityMember,
  insertFriendship,
  insertMemoryComment,
  insertModerationAction,
  insertPost,
  insertPostPhotos,
  insertPostReaction,
  insertSession,
  insertUser,
  insertUserFollow,
  listActivityRows,
  listChatMessages,
  listCommunities,
  listCommunityPosts,
  listFeedRows,
  listFriendshipsForUser,
  listMemoryComments,
  listPanelRows,
  listPublicFeedRows,
  listUserChats,
  nestPublishedPosts,
  postDepth,
  setCommunityMemberRole,
  setPostStatus,
  setUserPublic,
  silenceChat,
  togglePostHighlighted,
  togglePostPinned,
} from '../providers/social.provider.js'
import { SOCIAL_MESSAGES, SOCIAL_POST_STATUS, SOCIAL_ROLE } from '../constants/social.constants.js'
import {
  canHidePost,
  canNestReply,
  hashPassword,
  outingChatReadOnly,
  parseBodyDraft,
  parseLoginDraft,
  parseOptionalSrc,
  parsePostPhotos,
  parseReactionDraft,
  parseRegisterDraft,
} from '../schemas/social.schema.js'

export async function registerUser(draft: Record<string, unknown>) {
  const parsed = parseRegisterDraft(draft)
  if (!parsed.ok) return parsed
  const exists = await findUserByEmail(parsed.value.email)
  if (exists) return fail(409, 'Ese correo ya existe.')
  const user = {
    id: randomUUID(),
    email: parsed.value.email,
    alias: parsed.value.alias,
    passwordHash: hashPassword(parsed.value.password),
  }
  await insertUser(user)
  const sessionId = randomUUID()
  await insertSession({
    id: sessionId,
    userId: user.id,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
  })
  return { ok: true as const, user: { id: user.id, email: user.email, alias: user.alias }, sessionId }
}

export async function loginUser(draft: Record<string, unknown>) {
  const parsed = parseLoginDraft(draft)
  if (!parsed.ok) return parsed
  const user = await findUserByEmail(parsed.value.email)
  if (!user || user.passwordHash !== hashPassword(parsed.value.password)) return fail(403, 'Correo o clave inválidos.')
  const sessionId = randomUUID()
  await insertSession({
    id: sessionId,
    userId: user.id,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
  })
  return { ok: true as const, user: { id: user.id, email: user.email, alias: user.alias }, sessionId }
}

export async function resolveSessionUser(sessionId: string): Promise<Parsed<{ id: string; alias: string }>> {
  if (!sessionId) return fail(403, SOCIAL_MESSAGES.SESSION_REQUIRED)
  const user = await findSessionUser(sessionId)
  if (!user) return fail(403, SOCIAL_MESSAGES.SESSION_INVALID)
  return { ok: true, value: { id: user.id, alias: user.alias } }
}

export async function readPanel(sessionId: string) {
  const user = await resolveSessionUser(sessionId)
  if (!user.ok) return user
  const panel = await listPanelRows(user.value.id)
  return { ok: true as const, panel, user: { id: user.value.id, alias: user.value.alias } }
}

export async function readCommunities() {
  const communities = await listCommunities()
  return { ok: true as const, communities }
}

export async function createCommunity(draft: Record<string, unknown>) {
  const name = parseBodyDraft(draft, 'name')
  const description = parseBodyDraft(draft, 'description')
  const rules = parseBodyDraft(draft, 'rules')
  if (!name.ok) return name
  if (!description.ok) return description
  if (!rules.ok) return rules
  const slug = name.value.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-').replaceAll(/^-|-$/g, '')
  const communityId = randomUUID()
  await insertCommunity({
    id: communityId,
    slug: slug || communityId.slice(0, 8),
    name: name.value,
    description: description.value,
    rules: rules.value,
    whatsappGroupHref: typeof draft.whatsappGroupHref === 'string' ? draft.whatsappGroupHref.trim() : undefined,
  })
  return { ok: true as const, communityId }
}

export async function joinCommunity(sessionId: string, communityId: string) {
  const user = await resolveSessionUser(sessionId)
  if (!user.ok) return user
  await insertCommunityMember({ id: randomUUID(), communityId, userId: user.value.id })
  await insertCommunityFollow({ id: randomUUID(), communityId, userId: user.value.id })
  return { ok: true as const }
}

export async function leaveCommunity(sessionId: string, communityId: string) {
  const user = await resolveSessionUser(sessionId)
  if (!user.ok) return user
  await deleteCommunityMember(communityId, user.value.id)
  return { ok: true as const }
}

export async function followCommunity(sessionId: string, communityId: string) {
  const user = await resolveSessionUser(sessionId)
  if (!user.ok) return user
  await insertCommunityFollow({ id: randomUUID(), communityId, userId: user.value.id })
  return { ok: true as const }
}

export async function createCommunityPost(sessionId: string, communityId: string, draft: Record<string, unknown>) {
  const user = await resolveSessionUser(sessionId)
  if (!user.ok) return user
  const body = parseBodyDraft(draft, 'body')
  if (!body.ok) return body
  const photos = parsePostPhotos(draft)
  if (!photos.ok) return photos
  const parentId = typeof draft.parentId === 'string' ? draft.parentId.trim() : ''
  let parentCommunityId = communityId
  if (parentId) {
    const parent = await findPostById(parentId)
    if (!parent) return fail(404, SOCIAL_MESSAGES.POST_NOT_FOUND)
    if (parent.communityId !== communityId) return fail(400, SOCIAL_MESSAGES.POST_NOT_FOUND)
    const depth = await postDepth(parentId)
    if (!canNestReply(depth)) return fail(400, SOCIAL_MESSAGES.REPLY_TOO_DEEP)
    parentCommunityId = parent.communityId
  }
  const postId = randomUUID()
  await insertPost({
    id: postId,
    communityId: parentCommunityId,
    authorId: user.value.id,
    body: body.value,
    photoSrc: photos.value[0],
    parentId: parentId || undefined,
    waReminder: Boolean(draft.waReminder),
  })
  await insertPostPhotos(postId, photos.value)
  return { ok: true as const, postId }
}

export async function readCommunityPosts(communityId: string, sessionId = '') {
  const user = sessionId ? await resolveSessionUser(sessionId) : null
  const userId = user && user.ok ? user.value.id : undefined
  const posts = nestPublishedPosts(await listCommunityPosts(communityId, userId))
  return { ok: true as const, posts }
}

export async function readFeed(sessionId: string) {
  if (!sessionId) {
    const posts = nestPublishedPosts(await listPublicFeedRows())
    return { ok: true as const, posts }
  }
  const user = await resolveSessionUser(sessionId)
  if (!user.ok) {
    const posts = nestPublishedPosts(await listPublicFeedRows())
    return { ok: true as const, posts }
  }
  const posts = nestPublishedPosts(await listFeedRows(user.value.id))
  return { ok: true as const, posts }
}

export async function createMemoryComment(sessionId: string, memoryId: string, draft: Record<string, unknown>) {
  const user = await resolveSessionUser(sessionId)
  if (!user.ok) return user
  const body = parseBodyDraft(draft, 'body')
  if (!body.ok) return body
  await insertMemoryComment({
    id: randomUUID(),
    memoryId,
    userId: user.value.id,
    body: body.value,
    parentId: typeof draft.parentId === 'string' ? draft.parentId : undefined,
  })
  return { ok: true as const }
}

export async function readMemoryComments(memoryId: string) {
  const comments = await listMemoryComments(memoryId)
  return { ok: true as const, comments }
}

export async function reactToComment(sessionId: string, commentId: string, draft: Record<string, unknown>) {
  const user = await resolveSessionUser(sessionId)
  if (!user.ok) return user
  const reaction = parseBodyDraft(draft, 'reaction')
  if (!reaction.ok) return reaction
  await insertCommentReaction({ id: randomUUID(), commentId, userId: user.value.id, reaction: reaction.value })
  return { ok: true as const }
}

export async function requestFriend(sessionId: string, draft: Record<string, unknown>) {
  const user = await resolveSessionUser(sessionId)
  if (!user.ok) return user
  let receiverId = typeof draft.receiverId === 'string' ? draft.receiverId.trim() : ''
  const alias = typeof draft.alias === 'string' ? draft.alias.trim() : ''
  if (!receiverId && alias) {
    const target = await findUserIdByAlias(alias)
    if (!target) return fail(404, SOCIAL_MESSAGES.USER_NOT_FOUND)
    receiverId = target.id
  }
  if (!receiverId) return fail(400, SOCIAL_MESSAGES.USER_NOT_FOUND)
  if (receiverId === user.value.id) return fail(400, SOCIAL_MESSAGES.FRIEND_SELF)
  await insertFriendship({ id: randomUUID(), requesterId: user.value.id, receiverId })
  return { ok: true as const }
}

export async function acceptFriend(sessionId: string, friendshipId: string) {
  const user = await resolveSessionUser(sessionId)
  if (!user.ok) return user
  const count = await acceptFriendshipForReceiver(friendshipId, user.value.id)
  return count ? { ok: true as const } : fail(404, SOCIAL_MESSAGES.FRIEND_NOT_FOUND)
}

export async function blockFriend(sessionId: string, friendshipId: string) {
  const user = await resolveSessionUser(sessionId)
  if (!user.ok) return user
  const count = await blockFriendshipForUser(friendshipId, user.value.id)
  return count ? { ok: true as const } : fail(404, SOCIAL_MESSAGES.FRIEND_NOT_FOUND)
}

export async function readFriends(sessionId: string) {
  const user = await resolveSessionUser(sessionId)
  if (!user.ok) return user
  const rows = await listFriendshipsForUser(user.value.id)
  const pending = rows
    .filter((row) => row.status === 'pending' && row.receiverId === user.value.id)
    .map((row) => ({ id: row.id, alias: row.requesterAlias, userId: row.requesterId }))
  const outgoing = rows
    .filter((row) => row.status === 'pending' && row.requesterId === user.value.id)
    .map((row) => ({ id: row.id, alias: row.receiverAlias, userId: row.receiverId }))
  const accepted = rows
    .filter((row) => row.status === 'accepted')
    .map((row) => ({
      id: row.id,
      alias: row.requesterId === user.value.id ? row.receiverAlias : row.requesterAlias,
      userId: row.requesterId === user.value.id ? row.receiverId : row.requesterId,
    }))
  return { ok: true as const, pending, outgoing, accepted }
}

export async function followUser(sessionId: string, targetUserId: string) {
  const user = await resolveSessionUser(sessionId)
  if (!user.ok) return user
  await insertUserFollow({ id: randomUUID(), followerId: user.value.id, targetUserId })
  return { ok: true as const }
}

export async function createChat(sessionId: string, draft: Record<string, unknown>) {
  const user = await resolveSessionUser(sessionId)
  if (!user.ok) return user
  let peerId = typeof draft.peerUserId === 'string' ? draft.peerUserId.trim() : ''
  const peerAlias = typeof draft.peerAlias === 'string' ? draft.peerAlias.trim() : ''
  if (!peerId && peerAlias) {
    const peer = await findUserIdByAlias(peerAlias)
    if (!peer) return fail(404, SOCIAL_MESSAGES.USER_NOT_FOUND)
    peerId = peer.id
  }
  if (peerId && peerId === user.value.id) return fail(400, SOCIAL_MESSAGES.FRIEND_SELF)
  if (peerId) {
    const existing = await findDirectChatBetween(user.value.id, peerId)
    if (existing) return { ok: true as const, chatId: existing }
  }
  const chatId = randomUUID()
  await insertChat({
    id: chatId,
    kind: peerId ? 'direct' : typeof draft.kind === 'string' ? draft.kind : 'group',
    title: typeof draft.title === 'string' ? draft.title : undefined,
  })
  await insertChatMember({ id: randomUUID(), chatId, userId: user.value.id })
  if (peerId) await insertChatMember({ id: randomUUID(), chatId, userId: peerId })
  return { ok: true as const, chatId }
}

export async function createChatMessage(sessionId: string, chatId: string, draft: Record<string, unknown>) {
  const user = await resolveSessionUser(sessionId)
  if (!user.ok) return user
  const member = await findChatMember(chatId, user.value.id)
  if (!member) return fail(403, SOCIAL_MESSAGES.CHAT_FORBIDDEN)
  const silenced = await findChatSilenced(chatId)
  if (silenced === null) return fail(404, SOCIAL_MESSAGES.CHAT_NOT_FOUND)
  if (silenced) return fail(403, SOCIAL_MESSAGES.CHAT_SILENCED)
  const body = typeof draft.body === 'string' ? draft.body.trim() : undefined
  const photoSrc = typeof draft.photoSrc === 'string' ? draft.photoSrc.trim() : undefined
  const voiceSrc = typeof draft.voiceSrc === 'string' ? draft.voiceSrc.trim() : undefined
  if (!body && !photoSrc && !voiceSrc) return fail(400, SOCIAL_MESSAGES.EMPTY_MESSAGE)
  await insertChatMessage({ id: randomUUID(), chatId, authorId: user.value.id, body, photoSrc, voiceSrc })
  return { ok: true as const }
}

export async function readChats(sessionId: string) {
  const user = await resolveSessionUser(sessionId)
  if (!user.ok) return user
  const chats = await listUserChats(user.value.id)
  return { ok: true as const, chats }
}

export async function readChatMessages(sessionId: string, chatId: string) {
  const user = await resolveSessionUser(sessionId)
  if (!user.ok) return user
  const member = await findChatMember(chatId, user.value.id)
  if (!member) return fail(403, SOCIAL_MESSAGES.CHAT_FORBIDDEN)
  const messages = await listChatMessages(chatId)
  return { ok: true as const, messages }
}

export async function readPublicParcero(alias: string) {
  const parcero = await findPublicParceroByAlias(alias)
  if (!parcero) return fail(404, SOCIAL_MESSAGES.PROFILE_NOT_FOUND)
  return { ok: true as const, parcero }
}

export async function setVisibility(sessionId: string, draft: Record<string, unknown>) {
  const user = await resolveSessionUser(sessionId)
  if (!user.ok) return user
  await setUserPublic(user.value.id, draft.isPublic === true)
  return { ok: true as const, isPublic: draft.isPublic === true }
}

export async function setChatSilenced(chatId: string) {
  const count = await silenceChat(chatId)
  return count ? { ok: true as const } : fail(404, SOCIAL_MESSAGES.CHAT_NOT_FOUND)
}

export async function ensureOutingChatMembership(userId: string, outingId: string) {
  const outing = await findOutingMeta(outingId)
  if (!outing) return fail(404, SOCIAL_MESSAGES.OUTING_NOT_FOUND)
  const chatId = await findOrCreateOutingChat(outing)
  await insertChatMember({ id: randomUUID(), chatId, userId })
  return { ok: true as const, chatId }
}

export async function readOutingChat(outingId: string, sessionId: string, isOperador: boolean) {
  const outing = await findOutingMeta(outingId)
  if (!outing) return fail(404, SOCIAL_MESSAGES.OUTING_NOT_FOUND)
  let userId = ''
  if (!isOperador) {
    const user = await resolveSessionUser(sessionId)
    if (!user.ok) return user
    const ticket = await findTicketForUserOuting(outingId, user.value.id)
    if (!ticket) return fail(403, SOCIAL_MESSAGES.OUTING_CHAT_FORBIDDEN)
    userId = user.value.id
    await insertChatMember({
      id: randomUUID(),
      chatId: await findOrCreateOutingChat(outing),
      userId,
    })
  }
  const chatId = await findOrCreateOutingChat(outing)
  const messages = await listChatMessages(chatId)
  return {
    ok: true as const,
    chatId,
    status: outing.status,
    readOnly: outingChatReadOnly(outing.status),
    outingTitle: outing.title,
    messages,
  }
}

export async function createOutingChatMessage(
  outingId: string,
  sessionId: string,
  draft: Record<string, unknown>,
  isOperador: boolean,
) {
  const outing = await findOutingMeta(outingId)
  if (!outing) return fail(404, SOCIAL_MESSAGES.OUTING_NOT_FOUND)
  if (outingChatReadOnly(outing.status) && !isOperador) {
    return fail(403, SOCIAL_MESSAGES.CHAT_READ_ONLY)
  }
  if (outingChatReadOnly(outing.status) && isOperador && !draft.isPinned) {
    return fail(403, SOCIAL_MESSAGES.CHAT_READ_ONLY)
  }
  let authorId: string | undefined
  if (!isOperador) {
    const user = await resolveSessionUser(sessionId)
    if (!user.ok) return user
    const ticket = await findTicketForUserOuting(outingId, user.value.id)
    if (!ticket) return fail(403, SOCIAL_MESSAGES.OUTING_CHAT_FORBIDDEN)
    authorId = user.value.id
  } else if (sessionId) {
    const user = await findSessionUser(sessionId)
    authorId = user?.id
  }
  const chatId = await findOrCreateOutingChat(outing)
  if (authorId) await insertChatMember({ id: randomUUID(), chatId, userId: authorId })
  const body = parseOptionalSrc(draft.body)
  const photoSrc = parseOptionalSrc(draft.photoSrc)
  const voiceSrc = parseOptionalSrc(draft.voiceSrc)
  if (!body && !photoSrc && !voiceSrc) return fail(400, SOCIAL_MESSAGES.EMPTY_MESSAGE)
  await insertChatMessage({
    id: randomUUID(),
    chatId,
    authorId,
    body,
    photoSrc,
    voiceSrc,
    isPinned: Boolean(draft.isPinned) && isOperador,
  })
  return { ok: true as const, chatId }
}

export async function pinOutingChatNotice(outingId: string, draft: Record<string, unknown>, sessionId = '') {
  return createOutingChatMessage(outingId, sessionId, { ...draft, isPinned: true }, true)
}

export async function readActivity() {
  const items = await listActivityRows()
  return { ok: true as const, items }
}

export async function reactToPost(sessionId: string, postId: string, draft: Record<string, unknown>) {
  const user = await resolveSessionUser(sessionId)
  if (!user.ok) return user
  const reaction = parseReactionDraft(draft)
  if (!reaction.ok) return reaction
  const post = await findPostById(postId)
  if (!post) return fail(404, SOCIAL_MESSAGES.POST_NOT_FOUND)
  const existing = await findPostReaction(postId, user.value.id, reaction.value)
  if (existing) {
    await deletePostReaction(existing)
    return { ok: true as const, on: false }
  }
  await insertPostReaction({
    id: randomUUID(),
    postId,
    userId: user.value.id,
    reaction: reaction.value,
  })
  return { ok: true as const, on: true }
}

async function moderatePostAccess(
  sessionId: string,
  postId: string,
  isOperador: boolean,
): Promise<{ ok: true; communityId: string; actorId?: string } | { ok: false; status: number; detail: string }> {
  const post = await findPostById(postId)
  if (!post) return fail(404, SOCIAL_MESSAGES.POST_NOT_FOUND)
  let role: string | undefined
  let actorId: string | undefined
  if (sessionId) {
    const user = await findSessionUser(sessionId)
    if (user) {
      actorId = user.id
      role = (await findCommunityMemberRole(post.communityId, user.id)) ?? undefined
    }
  }
  if (!canHidePost({ role, isOperador })) {
    return fail(403, SOCIAL_MESSAGES.MODERATE_FORBIDDEN)
  }
  return { ok: true, communityId: post.communityId, actorId }
}

export async function hidePost(sessionId: string, postId: string, isOperador: boolean) {
  const access = await moderatePostAccess(sessionId, postId, isOperador)
  if (!access.ok) return access
  await setPostStatus(postId, SOCIAL_POST_STATUS.HIDDEN)
  await insertModerationAction({
    id: randomUUID(),
    communityId: access.communityId,
    actorId: access.actorId,
    action: 'hide',
    targetType: 'post',
    targetId: postId,
  })
  return { ok: true as const }
}

export async function pinPost(sessionId: string, postId: string, isOperador: boolean) {
  const access = await moderatePostAccess(sessionId, postId, isOperador)
  if (!access.ok) return access
  const pinned = await togglePostPinned(postId)
  if (pinned === null) return fail(404, SOCIAL_MESSAGES.POST_NOT_FOUND)
  await insertModerationAction({
    id: randomUUID(),
    communityId: access.communityId,
    actorId: access.actorId,
    action: pinned ? 'pin' : 'unpin',
    targetType: 'post',
    targetId: postId,
  })
  return { ok: true as const, pinned }
}

export async function highlightPost(postId: string) {
  const post = await findPostById(postId)
  if (!post) return fail(404, SOCIAL_MESSAGES.POST_NOT_FOUND)
  const highlighted = await togglePostHighlighted(postId)
  if (highlighted === null) return fail(404, SOCIAL_MESSAGES.POST_NOT_FOUND)
  await insertModerationAction({
    id: randomUUID(),
    communityId: post.communityId,
    action: highlighted ? 'highlight' : 'unhighlight',
    targetType: 'post',
    targetId: postId,
  })
  return { ok: true as const, highlighted }
}

export async function setCommunityModerator(
  communityId: string,
  draft: Record<string, unknown>,
  actorId?: string,
) {
  const community = await findCommunityById(communityId)
  if (!community) return fail(404, SOCIAL_MESSAGES.COMMUNITY_NOT_FOUND)
  const alias = typeof draft.alias === 'string' ? draft.alias.trim() : ''
  if (!alias) return fail(400, SOCIAL_MESSAGES.USER_NOT_FOUND)
  const target = await findUserIdByAlias(alias)
  if (!target) return fail(404, SOCIAL_MESSAGES.USER_NOT_FOUND)
  const revoke = draft.revoke === true
  await setCommunityMemberRole({
    id: randomUUID(),
    communityId,
    userId: target.id,
    role: revoke ? SOCIAL_ROLE.MEMBER : SOCIAL_ROLE.MODERADOR,
  })
  await insertModerationAction({
    id: randomUUID(),
    communityId,
    actorId,
    action: revoke ? 'revoke_moderator' : 'name_moderator',
    targetType: 'user',
    targetId: target.id,
  })
  return { ok: true as const, alias: target.alias, role: revoke ? SOCIAL_ROLE.MEMBER : SOCIAL_ROLE.MODERADOR }
}
