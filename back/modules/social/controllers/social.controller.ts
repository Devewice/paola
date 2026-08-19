import { HTTP_HEADER, HTTP_STATUS } from '../../../http/constants.js'
import { readBodyOrReject, requireOperador } from '../../../http/guard.js'
import { claveFromRequest, operadorClaveOk } from '../../../http/operar.js'
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
  createOutingChatMessage,
  followCommunity,
  followUser,
  hidePost,
  highlightPost,
  joinCommunity,
  leaveCommunity,
  loginUser,
  pinOutingChatNotice,
  pinPost,
  reactToComment,
  reactToPost,
  readActivity,
  readChatMessages,
  readChats,
  readCommunities,
  readCommunityPosts,
  readFeed,
  readFriends,
  readMemoryComments,
  readOutingChat,
  readPanel,
  readPublicParcero,
  registerUser,
  requestFriend,
  setChatSilenced,
  setCommunityModerator,
  setVisibility,
} from '../services/social.service.js'

function sessionId(request: RequestLike): string {
  const header = request.headers[HTTP_HEADER.SESSION_ID]
  if (typeof header === 'string') return header
  if (Array.isArray(header)) return header[0] ?? ''
  return ''
}

function operadorOk(request: RequestLike, body: Record<string, unknown> = {}): boolean {
  return operadorClaveOk(claveFromRequest(request, body))
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
  if (!requireOperador(request, response, body)) return
  const result = await createCommunity(body)
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

export const followCommunityController: RouteHandler = async (request, response, _url, params) => {
  const result = await followCommunity(sessionId(request), params.id ?? '')
  if (!result.ok) {
    sendJson(response, result.status, result)
    return
  }
  sendJson(response, HTTP_STATUS.OK, result)
}

export const listCommunityPostsController: RouteHandler = async (request, response, _url, params) => {
  sendJson(response, HTTP_STATUS.OK, await readCommunityPosts(params.id ?? '', sessionId(request)))
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
  sendJson(response, HTTP_STATUS.OK, await readFeed(sessionId(request)))
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
  const result = await requestFriend(sessionId(request), body)
  if (!result.ok) {
    sendJson(response, result.status, result)
    return
  }
  sendJson(response, HTTP_STATUS.OK, result)
}

export const listFriendsController: RouteHandler = async (request, response) => {
  const result = await readFriends(sessionId(request))
  if (!result.ok) {
    sendJson(response, result.status, result)
    return
  }
  sendJson(response, HTTP_STATUS.OK, result)
}

export const acceptFriendController: RouteHandler = async (request, response, _url, params) => {
  const result = await acceptFriend(sessionId(request), params.id ?? '')
  if (!result.ok) {
    sendJson(response, result.status, result)
    return
  }
  sendJson(response, HTTP_STATUS.OK, result)
}

export const blockFriendController: RouteHandler = async (request, response, _url, params) => {
  const result = await blockFriend(sessionId(request), params.id ?? '')
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

export const listChatsController: RouteHandler = async (request, response) => {
  const result = await readChats(sessionId(request))
  if (!result.ok) {
    sendJson(response, result.status, result)
    return
  }
  sendJson(response, HTTP_STATUS.OK, result)
}

export const listChatMessagesController: RouteHandler = async (request, response, _url, params) => {
  const result = await readChatMessages(sessionId(request), params.id ?? '')
  if (!result.ok) {
    sendJson(response, result.status, result)
    return
  }
  sendJson(response, HTTP_STATUS.OK, result)
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

export const parceroController: RouteHandler = async (_request, response, _url, params) => {
  const result = await readPublicParcero(params.alias ?? '')
  if (!result.ok) {
    sendJson(response, result.status, result)
    return
  }
  sendJson(response, HTTP_STATUS.OK, result)
}

export const setVisibilityController: RouteHandler = async (request, response) => {
  const body = await readBodyOrReject(request, response)
  if (!body) return
  const result = await setVisibility(sessionId(request), body)
  if (!result.ok) {
    sendJson(response, result.status, result)
    return
  }
  sendJson(response, HTTP_STATUS.OK, result)
}

export const activityController: RouteHandler = async (_request, response) => {
  sendJson(response, HTTP_STATUS.OK, await readActivity())
}

export const outingChatController: RouteHandler = async (request, response, _url, params) => {
  const result = await readOutingChat(params.id ?? '', sessionId(request), operadorOk(request))
  if (!result.ok) {
    sendJson(response, result.status, result)
    return
  }
  sendJson(response, HTTP_STATUS.OK, result)
}

export const outingChatMessageController: RouteHandler = async (request, response, _url, params) => {
  const body = await readBodyOrReject(request, response)
  if (!body) return
  const result = await createOutingChatMessage(
    params.id ?? '',
    sessionId(request),
    body,
    operadorOk(request, body),
  )
  if (!result.ok) {
    sendJson(response, result.status, result)
    return
  }
  sendJson(response, HTTP_STATUS.CREATED, result)
}

export const pinOutingChatController: RouteHandler = async (request, response, _url, params) => {
  const body = await readBodyOrReject(request, response)
  if (!body || !requireOperador(request, response, body)) return
  const result = await pinOutingChatNotice(params.id ?? '', body, sessionId(request))
  if (!result.ok) {
    sendJson(response, result.status, result)
    return
  }
  sendJson(response, HTTP_STATUS.CREATED, result)
}

export const reactPostController: RouteHandler = async (request, response, _url, params) => {
  const body = await readBodyOrReject(request, response)
  if (!body) return
  const result = await reactToPost(sessionId(request), params.id ?? '', body)
  if (!result.ok) {
    sendJson(response, result.status, result)
    return
  }
  sendJson(response, HTTP_STATUS.OK, result)
}

export const hidePostController: RouteHandler = async (request, response, _url, params) => {
  const body = await readBodyOrReject(request, response)
  if (!body) return
  const result = await hidePost(sessionId(request), params.id ?? '', operadorOk(request, body))
  if (!result.ok) {
    sendJson(response, result.status, result)
    return
  }
  sendJson(response, HTTP_STATUS.OK, result)
}

export const pinPostController: RouteHandler = async (request, response, _url, params) => {
  const body = await readBodyOrReject(request, response)
  if (!body) return
  const result = await pinPost(sessionId(request), params.id ?? '', operadorOk(request, body))
  if (!result.ok) {
    sendJson(response, result.status, result)
    return
  }
  sendJson(response, HTTP_STATUS.OK, result)
}

export const highlightPostController: RouteHandler = async (request, response, _url, params) => {
  const body = await readBodyOrReject(request, response)
  if (!body || !requireOperador(request, response, body)) return
  const result = await highlightPost(params.id ?? '')
  if (!result.ok) {
    sendJson(response, result.status, result)
    return
  }
  sendJson(response, HTTP_STATUS.OK, result)
}

export const setModeratorController: RouteHandler = async (request, response, _url, params) => {
  const body = await readBodyOrReject(request, response)
  if (!body || !requireOperador(request, response, body)) return
  const result = await setCommunityModerator(params.id ?? '', body)
  if (!result.ok) {
    sendJson(response, result.status, result)
    return
  }
  sendJson(response, HTTP_STATUS.OK, result)
}
