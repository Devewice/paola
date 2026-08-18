import { randomUUID } from 'node:crypto'
import { getDb } from '../db/knex.js'

export type Alliance = {
  id: string
  name: string
  support: string
  href?: string
}

export type Member = {
  id: string
  alias: string
  photoSrc?: string
  moto?: string
  instagramHref?: string
}

type Fail = { ok: false; status: number; detail: string }

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

export async function listAlianzas(): Promise<Alliance[]> {
  const rows = await getDb()('alianzas')
    .select('id', 'name', 'support', 'href')
    .orderBy('created_at', 'asc')
  return rows.map((row) => toAlliance(row as Record<string, unknown>))
}

export async function listIntegrantes(): Promise<Member[]> {
  const rows = await getDb()('integrantes')
    .select('id', 'alias', 'photo_src', 'moto', 'instagram_href')
    .orderBy('created_at', 'asc')
  return rows.map((row) => toMember(row as Record<string, unknown>))
}

export async function createAlianza(
  draft: Record<string, unknown>,
): Promise<Fail | { ok: true; alliance: Alliance }> {
  const name = String(draft.name ?? '').trim()
  const support = String(draft.support ?? '').trim()
  const href = String(draft.href ?? '').trim()
  if (name.length < 2) {
    return { ok: false, status: 400, detail: 'El aliado necesita un nombre.' }
  }
  if (support.length < 2) {
    return { ok: false, status: 400, detail: 'Di cómo apoya el parche.' }
  }

  const alliance: Alliance = {
    id: randomUUID(),
    name,
    support,
    href: href || undefined,
  }
  await getDb()('alianzas').insert({
    id: alliance.id,
    name: alliance.name,
    support: alliance.support,
    href: alliance.href ?? null,
  })
  return { ok: true, alliance }
}

export async function createIntegrante(
  draft: Record<string, unknown>,
): Promise<Fail | { ok: true; member: Member }> {
  const alias = String(draft.alias ?? '').trim()
  const moto = String(draft.moto ?? '').trim()
  const instagramHref = String(draft.instagramHref ?? '').trim()
  if (alias.length < 2) {
    return { ok: false, status: 400, detail: 'El integrante necesita un alias.' }
  }

  const member: Member = {
    id: randomUUID(),
    alias,
    moto: moto || undefined,
    instagramHref: instagramHref || undefined,
  }
  await getDb()('integrantes').insert({
    id: member.id,
    alias: member.alias,
    photo_src: null,
    moto: member.moto ?? null,
    instagram_href: member.instagramHref ?? null,
  })
  return { ok: true, member }
}
