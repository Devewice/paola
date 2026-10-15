import { fail } from '../../../http/fail.js'
import { HTTP_STATUS, PERMISSION_LIST, type Permission } from '../../../http/constants.js'
import type { Parsed } from '../../../http/types.js'
import { ROLES_LIMITS, ROLES_MESSAGES } from '../constants/roles.constants.js'
import type { RoleDraftDto } from '../dtos/roles.dto.js'

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

export function isPermission(value: unknown): value is Permission {
  return typeof value === 'string' && (PERMISSION_LIST as readonly string[]).includes(value)
}

export function parseRoleDraft(draft: Record<string, unknown>): Parsed<RoleDraftDto> {
  const name = text(draft.name)
  if (name.length < ROLES_LIMITS.NAME_MIN || name.length > ROLES_LIMITS.NAME_MAX) {
    return fail(HTTP_STATUS.BAD_REQUEST, ROLES_MESSAGES.NAME_INVALID)
  }
  const raw = Array.isArray(draft.permissions) ? draft.permissions : []
  if (!raw.every(isPermission)) return fail(HTTP_STATUS.BAD_REQUEST, ROLES_MESSAGES.PERMISSION_INVALID)
  return { ok: true, value: { name, permissions: [...new Set(raw)] } }
}

export function roleIdFromName(name: string): string {
  const slug = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, ROLES_LIMITS.ID_MAX)
  return slug || 'rol'
}

export function aliasFromEmail(email: string): string {
  const local = email.split('@')[0] ?? ''
  const clean = local.replace(/[^a-zA-Z0-9_.-]/g, '').slice(0, ROLES_LIMITS.ALIAS_MAX - 4)
  return clean.length >= 2 ? clean : 'admin'
}
