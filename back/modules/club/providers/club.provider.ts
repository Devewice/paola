import { getDb } from '../../../db/knex.js'
import { CLUB_TABLES } from '../constants/club.constants.js'
import type { CreateAllianceDto } from '../dtos/club.dto.js'
import type { Alliance, Member } from '../interfaces/club.interface.js'
import { toAlliance, toMember } from '../schemas/club.schema.js'

export async function findAlliances(): Promise<Alliance[]> {
  const rows = await getDb()(CLUB_TABLES.ALLIANCES)
    .select('id', 'name', 'support', 'href')
    .orderBy('created_at', 'asc')
  return rows.map((row) => toAlliance(row as Record<string, unknown>))
}

export async function findMembers(): Promise<Member[]> {
  const rows = await getDb()(CLUB_TABLES.MEMBERS)
    .select('id', 'alias', 'photo_src', 'moto', 'instagram_href')
    .orderBy('created_at', 'asc')
  return rows.map((row) => toMember(row as Record<string, unknown>))
}

export async function insertAlliance(alliance: Alliance, draft: CreateAllianceDto): Promise<void> {
  await getDb()(CLUB_TABLES.ALLIANCES).insert({
    id: alliance.id,
    name: draft.name,
    support: draft.support,
    href: draft.href ?? null,
  })
}

export async function insertMember(member: Member): Promise<void> {
  await getDb()(CLUB_TABLES.MEMBERS).insert({
    id: member.id,
    alias: member.alias,
    photo_src: null,
    moto: member.moto ?? null,
    instagram_href: member.instagramHref ?? null,
  })
}
