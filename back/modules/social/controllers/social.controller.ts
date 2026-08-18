import { HTTP_STATUS } from '../../../http/constants.js'
import { readBodyOrReject, requireOperador } from '../../../http/guard.js'
import { sendJson } from '../../../http/send.js'
import type { RouteHandler } from '../../../http/types.js'
import {
  acceptFriend,
  blockFriend,
  createChat,
  createChatMessage,
  createCommunity,
  createCommunityPost,
  createMemoryComment,
  followUser,
  joinCommunity,
  leaveCommunity,
  loginUser,
  reactToComment,
  readChatMessages,
  readCommunities,
  readCommunityPosts,
  readFeed,
  readMemoryComments,
  readPanel,
  registerUser,
  requestFriend,
  setChatSilenced,
} from '../services/social.service.js'

function sessionId(request: RequestLike): string {
  const header = request.headers['x-session-id']
  if (typeof header === 'string') return header
  if (Array.isArray(header)) return header[0] ?? ''
  return ''
}

type RequestLike = Parameters<RouteHandler>[0]

export const registerController: RouteHandler = async (request, response) => {
  const body = await readBodyOrReject(request, response)
  if (!body) return
  const result = await registerUser(body)
  if (!result.ok) {
    sendJson(response, result.status, result)
    return
  }
  sendJson(response, HTTP_STATUS.CREATED, result)
}

export const loginController: RouteHandler = async (request, response) => {
  const body = await readBodyOrReject(request, response)
  if (!body) return
  const result = await loginUser(body)
  if (!result.ok) {
    sendJson(response, result.status, result)
    return
  }
  sendJson(response, HTTP_STATUS.OK, result)
}

export const panelController: RouteHandler = async (request, response) => {
  const result = await readPanel(sessionId(request))
  if (!result.ok) {
    sendJson(response, result.status, result)
    return
  }
  sendJson(response, HTTP_STATUS.OK, result)
}

export const listCommunitiesController: RouteHandler = async (_request, response) => {
  sendJson(response, HTTP_STATUS.OK, await readCommunities())
}

export const createCommunityController: RouteHandler = async (request, response) => {
  const body = await readBodyOrReject(request, response)
  if (!body) return
  const result = await createCommunity(sessionId(request), body)
  if (!result.ok) {
    sendJson(response, result.status, result)
    return
  }
  sendJson(response, HTTP_STATUS.CREATED, result)
}

export const joinCommunityController: RouteHandler = async (request, response, _url, params) => {
  const result = await joinCommunity(sessionId(request), params.id ?? '')
  if (!result.ok) {
    sendJson(response, result.status, result)
    return
  }
  sendJson(response, HTTP_STATUS.OK, result)
}

export const leaveCommunityController: RouteHandler = async (request, response, _url, params) => {
  const result = await leaveCommunity(sessionId(request), params.id ?? '')
  if (!result.ok) {
    sendJson(response, result.status, result)
    return
  }
  sendJson(response, HTTP_STATUS.OK, result)
}

export const listCommunityPostsController: RouteHandler = async (_request, response, _url, params) => {
  sendJson(response, HTTP_STATUS.OK, await readCommunityPosts(params.id ?? ''))
}

export const createCommunityPostController: RouteHandler = async (request, response, _url, params) => {
  const body = await readBodyOrReject(request, response)
  if (!body) return
  const result = await createCommunityPost(sessionId(request), params.id ?? '', body)
  if (!result.ok) {
    sendJson(response, result.status, result)
    return
  }
  sendJson(response, HTTP_STATUS.CREATED, result)
}

export const feedController: RouteHandler = async (request, response) => {
  const result = await readFeed(sessionId(request))
  if (!result.ok) {
    sendJson(response, result.status, result)
    return
  }
  sendJson(response, HTTP_STATUS.OK, result)
}

export const listMemoryCommentsController: RouteHandler = async (_request, response, _url, params) => {
  sendJson(response, HTTP_STATUS.OK, await readMemoryComments(params.id ?? ''))
}

export const createMemoryCommentController: RouteHandler = async (request, response, _url, params) => {
  const body = await readBodyOrReject(request, response)
  if (!body) return
  const result = await createMemoryComment(sessionId(request), params.id ?? '', body)
  if (!result.ok) {
    sendJson(response, result.status, result)
    return
  }
  sendJson(response, HTTP_STATUS.CREATED, result)
}

export const reactCommentController: RouteHandler = async (request, response, _url, params) => {
  const body = await readBodyOrReject(request, response)
  if (!body) return
  const result = await reactToComment(sessionId(request), params.id ?? '', body)
  if (!result.ok) {
    sendJson(response, result.status, result)
    return
  }
  sendJson(response, HTTP_STATUS.OK, result)
}

export const requestFriendController: RouteHandler = async (request, response) => {
  const body = await readBodyOrReject(request, response)
  if (!body) return
  const receiverId = typeof body.receiverId === 'string' ? body.receiverId : ''
  const result = await requestFriend(sessionId(request), receiverId)
  if (!result.ok) {
    sendJson(response, result.status, result)
    return
  }
  sendJson(response, HTTP_STATUS.OK, result)
}

export const acceptFriendController: RouteHandler = async (_request, response, _url, params) => {
  const result = await acceptFriend(params.id ?? '')
  if (!result.ok) {
    sendJson(response, result.status, result)
    return
  }
  sendJson(response, HTTP_STATUS.OK, result)
}

export const blockFriendController: RouteHandler = async (_request, response, _url, params) => {
  const result = await blockFriend(params.id ?? '')
  if (!result.ok) {
    sendJson(response, result.status, result)
    return
  }
  sendJson(response, HTTP_STATUS.OK, result)
}

export const followUserController: RouteHandler = async (request, response, _url, params) => {
  const result = await followUser(sessionId(request), params.id ?? '')
  if (!result.ok) {
    sendJson(response, result.status, result)
    return
  }
  sendJson(response, HTTP_STATUS.OK, result)
}

export const createChatController: RouteHandler = async (request, response) => {
  const body = await readBodyOrReject(request, response)
  if (!body) return
  const result = await createChat(sessionId(request), body)
  if (!result.ok) {
    sendJson(response, result.status, result)
    return
  }
  sendJson(response, HTTP_STATUS.CREATED, result)
}

export const listChatMessagesController: RouteHandler = async (_request, response, _url, params) => {
  sendJson(response, HTTP_STATUS.OK, await readChatMessages(params.id ?? ''))
}

export const createChatMessageController: RouteHandler = async (request, response, _url, params) => {
  const body = await readBodyOrReject(request, response)
  if (!body) return
  const result = await createChatMessage(sessionId(request), params.id ?? '', body)
  if (!result.ok) {
    sendJson(response, result.status, result)
    return
  }
  sendJson(response, HTTP_STATUS.CREATED, result)
}

export const silenceChatController: RouteHandler = async (request, response, _url, params) => {
  const body = await readBodyOrReject(request, response)
  if (!body || !requireOperador(request, response, body)) return
  const result = await setChatSilenced(params.id ?? '')
  if (!result.ok) {
    sendJson(response, result.status, result)
    return
  }
  sendJson(response, HTTP_STATUS.OK, result)
}
