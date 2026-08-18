import { randomUUID } from 'node:crypto'
import type { Fail } from '../../../http/types.js'
import type { Alliance, Member } from '../interfaces/club.interface.js'
import {
  findAlliances,
  findMembers,
  insertAlliance,
  insertMember,
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
