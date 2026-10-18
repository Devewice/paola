import { fail } from '../../../http/fail.js'
import { HTTP_STATUS } from '../../../http/constants.js'
import type { Parsed } from '../../../http/types.js'
import { ACCOUNT_LIMITS, ACCOUNT_MESSAGES } from '../constants/account.constants.js'
import type { AccountProfile, CatalogMotorcycle, UserMotorcycle } from '../interfaces/account.interface.js'
import {
  aliasTakenByOther,
  deleteUserMotorcycle,
  findCatalogEntry,
  findProfile,
  findSessionUserId,
  insertUserMotorcycle,
  listCatalog,
  listUserMotorcycles,
  setPrimaryMotorcycle,
  setUserMotoLabel,
  updateProfile,
  updateSafety,
} from '../providers/account.provider.js'
import { motoLabel, parseMotorcycleDraft, parseProfilePatch, parseSafetyPatch } from '../schemas/account.schema.js'

export type AccountView = { profile: AccountProfile; motorcycles: UserMotorcycle[] }

async function requireUser(sessionId: string): Promise<Parsed<string>> {
  if (!sessionId) return fail(HTTP_STATUS.FORBIDDEN, ACCOUNT_MESSAGES.SESSION_REQUIRED)
  const userId = await findSessionUserId(sessionId)
  if (!userId) return fail(HTTP_STATUS.FORBIDDEN, ACCOUNT_MESSAGES.SESSION_INVALID)
  return { ok: true, value: userId }
}

async function viewOf(userId: string): Promise<Parsed<AccountView>> {
  const profile = await findProfile(userId)
  if (!profile) return fail(HTTP_STATUS.FORBIDDEN, ACCOUNT_MESSAGES.SESSION_INVALID)
  return { ok: true, value: { profile, motorcycles: await listUserMotorcycles(userId) } }
}

/** La primera moto queda como texto en `users.moto`: los cupos de rodada la leen de ahí. */
async function syncMotoLabel(userId: string): Promise<void> {
  const [first] = await listUserMotorcycles(userId)
  await setUserMotoLabel(userId, motoLabel(first))
}

export async function readAccount(sessionId: string): Promise<Parsed<AccountView>> {
  const user = await requireUser(sessionId)
  if (!user.ok) return user
  return viewOf(user.value)
}

export async function saveProfile(sessionId: string, draft: Record<string, unknown>): Promise<Parsed<AccountView>> {
  const user = await requireUser(sessionId)
  if (!user.ok) return user
  const parsed = parseProfilePatch(draft)
  if (!parsed.ok) return parsed
  if (await aliasTakenByOther(parsed.value.alias, user.value)) {
    return fail(HTTP_STATUS.CONFLICT, ACCOUNT_MESSAGES.ALIAS_TAKEN)
  }
  await updateProfile(user.value, parsed.value)
  return viewOf(user.value)
}

export async function saveSafety(sessionId: string, draft: Record<string, unknown>): Promise<Parsed<AccountView>> {
  const user = await requireUser(sessionId)
  if (!user.ok) return user
  const parsed = parseSafetyPatch(draft)
  if (!parsed.ok) return parsed
  await updateSafety(user.value, parsed.value)
  return viewOf(user.value)
}

export async function readCatalog(): Promise<CatalogMotorcycle[]> {
  return listCatalog()
}

export async function addMotorcycle(sessionId: string, draft: Record<string, unknown>): Promise<Parsed<AccountView>> {
  const user = await requireUser(sessionId)
  if (!user.ok) return user
  const parsed = parseMotorcycleDraft(draft)
  if (!parsed.ok) return parsed
  const current = await listUserMotorcycles(user.value)
  if (current.length >= ACCOUNT_LIMITS.MOTORCYCLES_MAX) {
    return fail(HTTP_STATUS.BAD_REQUEST, ACCOUNT_MESSAGES.MOTORCYCLES_MAX)
  }
  if (parsed.value.kind === 'catalog') {
    const entry = await findCatalogEntry(parsed.value.catalogId)
    if (!entry) return fail(HTTP_STATUS.NOT_FOUND, ACCOUNT_MESSAGES.CATALOG_NOT_FOUND)
    await insertUserMotorcycle(user.value, { catalogId: entry.id, brand: entry.brand, model: entry.model, cc: entry.cc })
  } else {
    await insertUserMotorcycle(user.value, parsed.value)
  }
  await syncMotoLabel(user.value)
  return viewOf(user.value)
}

export async function makePrimaryMotorcycle(sessionId: string, id: string): Promise<Parsed<AccountView>> {
  const user = await requireUser(sessionId)
  if (!user.ok) return user
  if (!(await setPrimaryMotorcycle(user.value, id))) {
    return fail(HTTP_STATUS.NOT_FOUND, ACCOUNT_MESSAGES.MOTORCYCLE_NOT_FOUND)
  }
  await syncMotoLabel(user.value)
  return viewOf(user.value)
}

export async function removeMotorcycle(sessionId: string, id: string): Promise<Parsed<AccountView>> {
  const user = await requireUser(sessionId)
  if (!user.ok) return user
  if (!(await deleteUserMotorcycle(user.value, id))) {
    return fail(HTTP_STATUS.NOT_FOUND, ACCOUNT_MESSAGES.MOTORCYCLE_NOT_FOUND)
  }
  await syncMotoLabel(user.value)
  return viewOf(user.value)
}
