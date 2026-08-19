import { fail } from '../../../http/fail.js'
import { HTTP_STATUS } from '../../../http/constants.js'
import type { Parsed } from '../../../http/types.js'
import { createHash } from 'node:crypto'
import {
  SOCIAL_LIMITS,
  SOCIAL_MESSAGES,
  SOCIAL_REACTION_SET,
  SOCIAL_ROLE,
} from '../constants/social.constants.js'

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

export function hashPassword(raw: string): string {
  return createHash('sha256').update(raw).digest('hex')
}

export function parseRegisterDraft(draft: Record<string, unknown>): Parsed<{ email: string; alias: string; password: string }> {
  if (draft.privacyAccepted !== true) {
    return fail(HTTP_STATUS.BAD_REQUEST, SOCIAL_MESSAGES.PRIVACY_REQUIRED)
  }
  const email = text(draft.email).toLowerCase()
  const alias = text(draft.alias)
  const password = text(draft.password)
  if (!email.includes('@') || alias.length < 2 || password.length < 6) {
    return fail(HTTP_STATUS.BAD_REQUEST, 'Registro inválido: correo, alias y clave mínima de 6.')
  }
  return { ok: true, value: { email, alias, password } }
}

export function parseLoginDraft(draft: Record<string, unknown>): Parsed<{ email: string; password: string }> {
  const email = text(draft.email).toLowerCase()
  const password = text(draft.password)
  if (!email || !password) return fail(HTTP_STATUS.BAD_REQUEST, 'Login incompleto.')
  return { ok: true, value: { email, password } }
}

export function parseBodyDraft(draft: Record<string, unknown>, field: string): Parsed<string> {
  const value = text(draft[field])
  if (value.length < 2) return fail(HTTP_STATUS.BAD_REQUEST, `Falta ${field}.`)
  return { ok: true, value }
}

export function parseOptionalSrc(value: unknown): string | undefined {
  const src = text(value)
  return src || undefined
}

export function parsePostPhotos(draft: Record<string, unknown>): Parsed<readonly string[]> {
  const extra = parseOptionalSrc(draft.photoSrc)
  const raw = draft.photos
  const fromList: string[] = []
  if (Array.isArray(raw)) {
    if (raw.length > SOCIAL_LIMITS.POST_PHOTOS_MAX) {
      return fail(HTTP_STATUS.BAD_REQUEST, SOCIAL_MESSAGES.PHOTOS_MAX)
    }
    for (const item of raw) {
      const src = parseOptionalSrc(item)
      if (src) fromList.push(src)
    }
  } else if (raw != null && raw !== '') {
    return fail(HTTP_STATUS.BAD_REQUEST, SOCIAL_MESSAGES.PHOTOS_MAX)
  }
  const photos = extra && !fromList.includes(extra) ? [extra, ...fromList] : fromList
  if (photos.length > SOCIAL_LIMITS.POST_PHOTOS_MAX) {
    return fail(HTTP_STATUS.BAD_REQUEST, SOCIAL_MESSAGES.PHOTOS_MAX)
  }
  return { ok: true, value: photos }
}

export function parseReactionDraft(draft: Record<string, unknown>): Parsed<string> {
  const reaction = text(draft.reaction)
  if (!SOCIAL_REACTION_SET.has(reaction)) {
    return fail(HTTP_STATUS.BAD_REQUEST, SOCIAL_MESSAGES.REACTION_INVALID)
  }
  return { ok: true, value: reaction }
}

/** Profundidad del padre: 0 = post raíz. Se puede responder si el padre está por debajo del tope. */
export function canNestReply(parentDepth: number): boolean {
  return parentDepth < SOCIAL_LIMITS.POST_MAX_DEPTH
}

export function canHidePost(input: { role?: string; isOperador: boolean }): boolean {
  return input.isOperador || input.role === SOCIAL_ROLE.MODERADOR
}

export function outingChatReadOnly(status: string): boolean {
  return status === 'cerrado' || status === 'realizado'
}
