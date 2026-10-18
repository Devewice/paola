import { randomUUID } from 'node:crypto'
import { HTTP_STATUS } from '../../../http/constants.js'
import { fail } from '../../../http/fail.js'
import type { Fail } from '../../../http/types.js'
import { CLUB_MESSAGES } from '../constants/club.constants.js'
import type { Alliance, Member } from '../interfaces/club.interface.js'
import {
  deleteAlliance,
  deleteMember,
  findAlliances,
  findMembers,
  insertAlliance,
  insertMember,
  updateAlliance,
  updateMember,
} from '../providers/club.provider.js'
import { parseCreateAlliance, parseCreateMember } from '../schemas/club.schema.js'

export async function listAlliances(): Promise<Alliance[]> {
  return findAlliances()
}

export async function listMembers(): Promise<Member[]> {
  return findMembers()
}

export async function createAlliance(
  draft: Record<string, unknown>,
): Promise<Fail | { ok: true; alliance: Alliance }> {
  const parsed = parseCreateAlliance(draft)
  if (!parsed.ok) return parsed

  const alliance: Alliance = {
    id: randomUUID(),
    name: parsed.value.name,
    support: parsed.value.support,
    href: parsed.value.href,
  }
  await insertAlliance(alliance, parsed.value)
  return { ok: true, alliance }
}

export async function editAlliance(
  id: string,
  draft: Record<string, unknown>,
): Promise<Fail | { ok: true; alliance: Alliance }> {
  const parsed = parseCreateAlliance(draft)
  if (!parsed.ok) return parsed
  if (!(await updateAlliance(id, parsed.value))) return fail(HTTP_STATUS.NOT_FOUND, CLUB_MESSAGES.ALLIANCE_NOT_FOUND)
  return { ok: true, alliance: { id, ...parsed.value } }
}

export async function removeAlliance(id: string): Promise<Fail | { ok: true }> {
  if (!(await deleteAlliance(id))) return fail(HTTP_STATUS.NOT_FOUND, CLUB_MESSAGES.ALLIANCE_NOT_FOUND)
  return { ok: true }
}

export async function editMember(
  id: string,
  draft: Record<string, unknown>,
): Promise<Fail | { ok: true; member: Member }> {
  const parsed = parseCreateMember(draft)
  if (!parsed.ok) return parsed
  const member: Member = { id, ...parsed.value }
  if (!(await updateMember(member))) return fail(HTTP_STATUS.NOT_FOUND, CLUB_MESSAGES.MEMBER_NOT_FOUND)
  return { ok: true, member }
}

export async function removeMember(id: string): Promise<Fail | { ok: true }> {
  if (!(await deleteMember(id))) return fail(HTTP_STATUS.NOT_FOUND, CLUB_MESSAGES.MEMBER_NOT_FOUND)
  return { ok: true }
}

export async function createMember(
  draft: Record<string, unknown>,
): Promise<Fail | { ok: true; member: Member }> {
  const parsed = parseCreateMember(draft)
  if (!parsed.ok) return parsed

  const member: Member = {
    id: randomUUID(),
    alias: parsed.value.alias,
    moto: parsed.value.moto,
    instagramHref: parsed.value.instagramHref,
  }
  await insertMember(member)
  return { ok: true, member }
}
