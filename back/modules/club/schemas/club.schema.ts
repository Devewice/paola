import { HTTP_STATUS } from '../../../http/constants.js'
import { fail } from '../../../http/fail.js'
import type { Parsed } from '../../../http/types.js'
import { CLUB_LIMITS, CLUB_MESSAGES } from '../constants/club.constants.js'
import type { CreateAllianceDto, CreateMemberDto } from '../dtos/club.dto.js'
import type { Alliance, Member } from '../interfaces/club.interface.js'

export function parseCreateAlliance(draft: Record<string, unknown>): Parsed<CreateAllianceDto> {
  const name = String(draft.name ?? '').trim()
  const support = String(draft.support ?? '').trim()
  const href = String(draft.href ?? '').trim()
  if (name.length < CLUB_LIMITS.NAME_MIN) {
    return fail(HTTP_STATUS.BAD_REQUEST, CLUB_MESSAGES.NAME_REQUIRED)
  }
  if (support.length < CLUB_LIMITS.SUPPORT_MIN) {
    return fail(HTTP_STATUS.BAD_REQUEST, CLUB_MESSAGES.SUPPORT_REQUIRED)
  }
  return { ok: true, value: { name, support, href: href || undefined } }
}

export function parseCreateMember(draft: Record<string, unknown>): Parsed<CreateMemberDto> {
  const alias = String(draft.alias ?? '').trim()
  const moto = String(draft.moto ?? '').trim()
  const instagramHref = String(draft.instagramHref ?? '').trim()
  if (alias.length < CLUB_LIMITS.ALIAS_MIN) {
    return fail(HTTP_STATUS.BAD_REQUEST, CLUB_MESSAGES.ALIAS_REQUIRED)
  }
  return {
    ok: true,
    value: { alias, moto: moto || undefined, instagramHref: instagramHref || undefined },
  }
}

export function toAlliance(row: Record<string, unknown>): Alliance {
  return {
    id: String(row.id),
    name: String(row.name),
    support: String(row.support),
    href: row.href ? String(row.href) : undefined,
  }
}

export function toMember(row: Record<string, unknown>): Member {
  return {
    id: String(row.id),
    alias: String(row.alias),
    photoSrc: row.photo_src ? String(row.photo_src) : undefined,
    moto: row.moto ? String(row.moto) : undefined,
    instagramHref: row.instagram_href ? String(row.instagram_href) : undefined,
  }
}
