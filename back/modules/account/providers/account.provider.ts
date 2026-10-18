import { randomUUID } from 'node:crypto'
import { getDb } from '../../../db/knex.js'
import { ACCOUNT_TABLES } from '../constants/account.constants.js'
import type { ProfilePatchDto } from '../dtos/account.dto.js'
import type { AccountProfile, CatalogMotorcycle, UserMotorcycle } from '../interfaces/account.interface.js'

const db = getDb

function optional(value: unknown): string | undefined {
  return value === null || value === undefined || value === '' ? undefined : String(value)
}

export async function findSessionUserId(sessionId: string): Promise<string | null> {
  if (!sessionId) return null
  const row = await db()(ACCOUNT_TABLES.SESSIONS)
    .select('user_id as userId', 'expires_at as expiresAt')
    .where({ id: sessionId })
    .first()
  if (!row?.userId) return null
  const expiresAt = new Date(String(row.expiresAt))
  if (Number.isNaN(expiresAt.valueOf()) || expiresAt.getTime() < Date.now()) return null
  return String(row.userId)
}

export async function findProfile(userId: string): Promise<AccountProfile | null> {
  const row = await db()(ACCOUNT_TABLES.USERS)
    .select('id', 'email', 'alias', 'display_name', 'full_name', 'whatsapp', 'is_public', 'created_at')
    .where({ id: userId })
    .first()
  if (!row) return null
  return {
    id: String(row.id),
    email: String(row.email),
    alias: String(row.alias),
    displayName: optional(row.display_name),
    fullName: optional(row.full_name),
    whatsapp: optional(row.whatsapp),
    isPublic: Boolean(row.is_public),
    createdAt: row.created_at ? new Date(String(row.created_at)).toISOString() : undefined,
  }
}

export async function aliasTakenByOther(alias: string, userId: string): Promise<boolean> {
  const row = await db()(ACCOUNT_TABLES.USERS).select('id').where({ alias }).whereNot({ id: userId }).first()
  return Boolean(row)
}

export async function updateProfile(userId: string, patch: ProfilePatchDto): Promise<void> {
  await db()(ACCOUNT_TABLES.USERS).where({ id: userId }).update({
    alias: patch.alias,
    display_name: patch.displayName,
    full_name: patch.fullName,
    whatsapp: patch.whatsapp,
  })
}

export async function listCatalog(): Promise<CatalogMotorcycle[]> {
  const rows = await db()(ACCOUNT_TABLES.CATALOG).select('id', 'brand', 'model', 'cc').orderBy([
    { column: 'brand', order: 'asc' },
    { column: 'cc', order: 'asc' },
    { column: 'model', order: 'asc' },
  ])
  return rows.map((row) => ({ id: String(row.id), brand: String(row.brand), model: String(row.model), cc: Number(row.cc) }))
}

export async function findCatalogEntry(id: string): Promise<CatalogMotorcycle | null> {
  const row = await db()(ACCOUNT_TABLES.CATALOG).select('id', 'brand', 'model', 'cc').where({ id }).first()
  return row ? { id: String(row.id), brand: String(row.brand), model: String(row.model), cc: Number(row.cc) } : null
}

export async function listUserMotorcycles(userId: string): Promise<UserMotorcycle[]> {
  const rows = await db()(ACCOUNT_TABLES.MOTORCYCLES)
    .select('id', 'catalog_id', 'brand', 'model', 'cc', 'is_primary')
    .where({ user_id: userId })
    .orderBy([
      { column: 'is_primary', order: 'desc' },
      { column: 'created_at', order: 'asc' },
    ])
  return rows.map((row, index) => ({
    id: String(row.id),
    catalogId: optional(row.catalog_id),
    brand: String(row.brand),
    model: String(row.model),
    cc: row.cc === null || row.cc === undefined ? undefined : Number(row.cc),
    isPrimary: index === 0,
  }))
}

export async function setPrimaryMotorcycle(userId: string, id: string): Promise<boolean> {
  return db().transaction(async (trx) => {
    const owned = await trx(ACCOUNT_TABLES.MOTORCYCLES).select('id').where({ id, user_id: userId }).first()
    if (!owned) return false
    await trx(ACCOUNT_TABLES.MOTORCYCLES).where({ user_id: userId }).update({ is_primary: false })
    await trx(ACCOUNT_TABLES.MOTORCYCLES).where({ id, user_id: userId }).update({ is_primary: true })
    return true
  })
}

export async function insertUserMotorcycle(
  userId: string,
  moto: { catalogId?: string; brand: string; model: string; cc: number },
): Promise<string> {
  const id = randomUUID()
  await db()(ACCOUNT_TABLES.MOTORCYCLES).insert({
    id,
    user_id: userId,
    catalog_id: moto.catalogId ?? null,
    brand: moto.brand,
    model: moto.model,
    cc: moto.cc,
  })
  return id
}

export async function deleteUserMotorcycle(userId: string, id: string): Promise<number> {
  return db()(ACCOUNT_TABLES.MOTORCYCLES).where({ id, user_id: userId }).delete()
}

export async function setUserMotoLabel(userId: string, label: string | null): Promise<void> {
  await db()(ACCOUNT_TABLES.USERS).where({ id: userId }).update({ moto: label })
}
