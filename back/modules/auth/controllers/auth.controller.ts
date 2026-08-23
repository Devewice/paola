import { HTTP_STATUS } from '../../../http/constants.js'
import { sendJson } from '../../../http/send.js'
import type { RouteHandler } from '../../../http/types.js'
import { AUTH_CREDENTIAL_KEYS, AUTH_MESSAGES } from '../constants/auth.constants.js'
import { authJsonBody, authOperatorGuard } from '../middlewares/auth.middleware.js'
import {
  buildGoogleStartUrl,
  getOperatorAuthConfig,
  getPublicAuthMethods,
  saveOperatorAuthConfig,
} from '../services/auth.service.js'

function parseSave(body: Record<string, unknown>): {
  ok: true
  value: { enabled: boolean; credentials: Record<string, string> }
} | { ok: false; status: number; detail: string } {
  const enabled = Boolean(body.enabled)
  const raw = body.credentials
  if (!raw || typeof raw !== 'object') {
    return { ok: false, status: HTTP_STATUS.BAD_REQUEST, detail: AUTH_MESSAGES.MISSING_KEYS }
  }
  const credentials: Record<string, string> = {}
  for (const key of Object.values(AUTH_CREDENTIAL_KEYS)) {
    const value = (raw as Record<string, unknown>)[key]
    if (typeof value === 'string') credentials[key] = value
  }
  return { ok: true, value: { enabled, credentials } }
}

export const listAuthMethodsController: RouteHandler = async (_request, response) => {
  try {
    const methods = await getPublicAuthMethods()
    sendJson(response, HTTP_STATUS.OK, { ok: true, methods })
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'mysql'
    sendJson(response, HTTP_STATUS.OK, {
      ok: true,
      methods: { password: true, google: false },
      detail,
    })
  }
}

export const googleStartController: RouteHandler = async (_request, response) => {
  const result = await buildGoogleStartUrl()
  if (!result.ok) {
    sendJson(response, result.status, { ok: false, detail: result.detail })
    return
  }
  sendJson(response, HTTP_STATUS.OK, { ok: true, url: result.url })
}

export const getOperatorAuthController: RouteHandler = async (request, response) => {
  if (!authOperatorGuard(request, response)) return
  try {
    const config = await getOperatorAuthConfig()
    sendJson(response, HTTP_STATUS.OK, { ok: true, config })
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'mysql'
    sendJson(response, HTTP_STATUS.OK, {
      ok: true,
      config: {
        provider: 'google',
        enabled: false,
        status: 'off',
        filled: [],
        redirectUri: '',
      },
      detail,
    })
  }
}

export const saveOperatorAuthController: RouteHandler = async (request, response) => {
  const body = await authJsonBody(request, response)
  if (!body) return
  if (!authOperatorGuard(request, response, body)) return
  const parsed = parseSave(body)
  if (!parsed.ok) {
    sendJson(response, parsed.status, { ok: false, detail: parsed.detail })
    return
  }
  const result = await saveOperatorAuthConfig(parsed.value)
  if (!result.ok) {
    sendJson(response, result.status, { ok: false, detail: result.detail })
    return
  }
  sendJson(response, HTTP_STATUS.OK, { ok: true, config: result.config, detail: AUTH_MESSAGES.SAVE_OK })
}
