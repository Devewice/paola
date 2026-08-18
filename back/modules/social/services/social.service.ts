import { randomUUID } from 'node:crypto'
import { fail } from '../../../http/fail.js'
import type { Parsed } from '../../../http/types.js'
import {
  deleteCommunityMember,
  findSessionUser,
  findUserByEmail,
  insertChat,
  insertChatMember,
  insertChatMessage,
  insertCommentReaction,
  insertCommunity,
  insertCommunityFollow,
  insertCommunityMember,
  insertFriendship,
  insertMemoryComment,
  insertPost,
  insertSession,
  insertUser,
  insertUserFollow,
  listChatMessages,
  listCommunities,
  listCommunityPosts,
  listFeedRows,
  listMemoryComments,
  listPanelRows,
  silenceChat,
  updateFriendshipStatus,
} from '../providers/social.provider.js'
import { hashPassword, parseBodyDraft, parseLoginDraft, parseRegisterDraft } from '../schemas/social.schema.js'

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
  if (!sessionId) return fail(403, 'Sesión requerida.')
  const user = await findSessionUser(sessionId)
  if (!user) return fail(403, 'Sesión inválida o vencida.')
  return { ok: true, value: { id: user.id, alias: user.alias } }
}

export async function readPanel(sessionId: string) {
  const user = await resolveSessionUser(sessionId)
  if (!user.ok) return user
  const panel = await listPanelRows(user.value.id)
  return { ok: true as const, panel }
}

export async function readCommunities() {
  const communities = await listCommunities()
  return { ok: true as const, communities }
}

export async function createCommunity(sessionId: string, draft: Record<string, unknown>) {
  const user = await resolveSessionUser(sessionId)
  if (!user.ok) return user
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
    slug,
    name: name.value,
    description: description.value,
    rules: rules.value,
    whatsappGroupHref: typeof draft.whatsappGroupHref === 'string' ? draft.whatsappGroupHref.trim() : undefined,
  })
  await insertCommunityMember({ id: randomUUID(), communityId, userId: user.value.id, role: 'moderador' })
  await insertCommunityFollow({ id: randomUUID(), communityId, userId: user.value.id })
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

export async function createCommunityPost(sessionId: string, communityId: string, draft: Record<string, unknown>) {
  const user = await resolveSessionUser(sessionId)
  if (!user.ok) return user
  const body = parseBodyDraft(draft, 'body')
  if (!body.ok) return body
  await insertPost({
    id: randomUUID(),
    communityId,
    authorId: user.value.id,
    body: body.value,
    photoSrc: typeof draft.photoSrc === 'string' ? draft.photoSrc.trim() : undefined,
    waReminder: Boolean(draft.waReminder),
  })
  return { ok: true as const }
}

export async function readCommunityPosts(communityId: string) {
  const posts = await listCommunityPosts(communityId)
  return { ok: true as const, posts }
}

export async function readFeed(sessionId: string) {
  const user = await resolveSessionUser(sessionId)
  if (!user.ok) return user
  const posts = await listFeedRows(user.value.id)
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

export async function requestFriend(sessionId: string, receiverId: string) {
  const user = await resolveSessionUser(sessionId)
  if (!user.ok) return user
  await insertFriendship({ id: randomUUID(), requesterId: user.value.id, receiverId })
  return { ok: true as const }
}

export async function acceptFriend(friendshipId: string) {
  const count = await updateFriendshipStatus(friendshipId, 'accepted')
  return count ? { ok: true as const } : fail(404, 'Solicitud no encontrada.')
}

export async function blockFriend(friendshipId: string) {
  const count = await updateFriendshipStatus(friendshipId, 'blocked')
  return count ? { ok: true as const } : fail(404, 'Solicitud no encontrada.')
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
  const chatId = randomUUID()
  await insertChat({
    id: chatId,
    kind: typeof draft.kind === 'string' ? draft.kind : 'group',
    title: typeof draft.title === 'string' ? draft.title : undefined,
  })
  await insertChatMember({ id: randomUUID(), chatId, userId: user.value.id })
  return { ok: true as const, chatId }
}

export async function createChatMessage(sessionId: string, chatId: string, draft: Record<string, unknown>) {
  const user = await resolveSessionUser(sessionId)
  if (!user.ok) return user
  const body = typeof draft.body === 'string' ? draft.body.trim() : undefined
  const photoSrc = typeof draft.photoSrc === 'string' ? draft.photoSrc.trim() : undefined
  const voiceSrc = typeof draft.voiceSrc === 'string' ? draft.voiceSrc.trim() : undefined
  if (!body && !photoSrc && !voiceSrc) return fail(400, 'Mensaje vacío.')
  await insertChatMessage({ id: randomUUID(), chatId, authorId: user.value.id, body, photoSrc, voiceSrc })
  return { ok: true as const }
}

export async function readChatMessages(chatId: string) {
  const messages = await listChatMessages(chatId)
  return { ok: true as const, messages }
}

export async function setChatSilenced(chatId: string) {
  const count = await silenceChat(chatId)
  return count ? { ok: true as const } : fail(404, 'Chat no encontrado.')
}
