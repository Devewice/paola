import { createHash } from 'node:crypto'
import { fail } from '../../../http/fail.js'
import { HTTP_STATUS } from '../../../http/constants.js'
import type { Parsed } from '../../../http/types.js'
import { SOCIAL_MESSAGES } from '../constants/social.constants.js'

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
