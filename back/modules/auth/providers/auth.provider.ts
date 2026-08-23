import { randomUUID } from 'node:crypto'
import { getDb } from '../../../db/knex.js'
import {
  AUTH_PROVIDER,
  AUTH_TABLES,
  type AuthProviderId,
  type AuthStatus,
} from '../constants/auth.constants.js'

export type AuthCredentials = Record<string, string>

export type AuthProviderRow = {
  id: string
  provider: AuthProviderId
  enabled: boolean
  status: AuthStatus
  credentials: AuthCredentials
}

type DbRow = {
  id: string
  provider: string
  enabled: number | boolean
  status: string
  credentials_json: string
}

function parseCredentials(raw: string): AuthCredentials {
  try {
    const value: unknown = JSON.parse(raw)
    if (!value || typeof value !== 'object') return {}
    const next: AuthCredentials = {}
    for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
      if (typeof item === 'string') next[key] = item
    }
    return next
  } catch {
    return {}
  }
}

function toRow(row: DbRow): AuthProviderRow {
  return {
    id: String(row.id),
    provider: row.provider as AuthProviderId,
    enabled: Boolean(row.enabled),
    status: row.status as AuthStatus,
    credentials: parseCredentials(row.credentials_json),
  }
}

export async function findAuthProvider(
  provider: AuthProviderId = AUTH_PROVIDER.GOOGLE,
): Promise<AuthProviderRow | undefined> {
  const row = await getDb()(AUTH_TABLES.PROVIDERS)
    .select('id', 'provider', 'enabled', 'status', 'credentials_json')
    .where({ provider })
    .first()
  if (!row) return undefined
  return toRow(row as DbRow)
}

export async function upsertAuthProvider(input: {
  provider: AuthProviderId
  enabled: boolean
  status: AuthStatus
  credentials: AuthCredentials
}): Promise<AuthProviderRow> {
  const existing = await findAuthProvider(input.provider)
  const id = existing?.id ?? randomUUID()
  const payload = {
    id,
    provider: input.provider,
    enabled: input.enabled,
    status: input.status,
    credentials_json: JSON.stringify(input.credentials),
    updated_at: getDb().fn.now(),
  }
  if (existing) {
    await getDb()(AUTH_TABLES.PROVIDERS).where({ id }).update(payload)
  } else {
    await getDb()(AUTH_TABLES.PROVIDERS).insert(payload)
  }
  const saved = await findAuthProvider(input.provider)
  if (!saved) throw new Error('auth_provider_missing')
  return saved
}

export function mergeCredentials(
  previous: AuthCredentials,
  patch: AuthCredentials,
): AuthCredentials {
  const next = { ...previous }
  for (const [key, value] of Object.entries(patch)) {
    if (value.trim()) next[key] = value.trim()
  }
  return next
}
