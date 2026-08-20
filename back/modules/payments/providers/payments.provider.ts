import { randomUUID } from 'node:crypto'
import { getDb } from '../../../db/knex.js'
import {
  PAYMENT_STATUS,
  PAYMENT_TABLES,
  type GatewayMode,
  type GatewayStatus,
  type PaymentProviderId,
} from '../constants/payments.constants.js'
import type { GatewayCredentials, PaymentGatewayRow } from '../interfaces/payments.interface.js'

type DbRow = {
  id: string
  provider: string
  mode: string
  enabled: number | boolean
  status: string
  credentials_json: string
  tested_at: Date | string | null
}

function parseCredentials(raw: string): GatewayCredentials {
  try {
    const value: unknown = JSON.parse(raw)
    if (!value || typeof value !== 'object') return {}
    const next: GatewayCredentials = {}
    for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
      if (typeof item === 'string') next[key] = item
    }
    return next
  } catch {
    return {}
  }
}

function toRow(row: DbRow): PaymentGatewayRow {
  return {
    id: String(row.id),
    provider: row.provider as PaymentProviderId,
    mode: row.mode as GatewayMode,
    enabled: Boolean(row.enabled),
    status: row.status as GatewayStatus,
    credentials: parseCredentials(row.credentials_json),
    testedAt: row.tested_at ? String(row.tested_at) : null,
  }
}

export async function findGateways(): Promise<PaymentGatewayRow[]> {
  const rows = await getDb()(PAYMENT_TABLES.GATEWAYS)
    .select('id', 'provider', 'mode', 'enabled', 'status', 'credentials_json', 'tested_at')
    .orderBy('provider', 'asc')
  return (rows as DbRow[]).map(toRow)
}

export async function findGateway(provider: PaymentProviderId): Promise<PaymentGatewayRow | undefined> {
  const row = await getDb()(PAYMENT_TABLES.GATEWAYS)
    .select('id', 'provider', 'mode', 'enabled', 'status', 'credentials_json', 'tested_at')
    .where({ provider })
    .first()
  if (!row) return undefined
  return toRow(row as DbRow)
}

export async function upsertGateway(input: {
  provider: PaymentProviderId
  mode: GatewayMode
  enabled: boolean
  status: GatewayStatus
  credentials: GatewayCredentials
  testedAt?: string | null
}): Promise<PaymentGatewayRow> {
  const existing = await findGateway(input.provider)
  const id = existing?.id ?? randomUUID()
  const payload = {
    id,
    provider: input.provider,
    mode: input.mode,
    enabled: input.enabled,
    status: input.status,
    credentials_json: JSON.stringify(input.credentials),
    tested_at: input.testedAt ?? existing?.testedAt ?? null,
    updated_at: getDb().fn.now(),
  }
  if (existing) {
    await getDb()(PAYMENT_TABLES.GATEWAYS).where({ provider: input.provider }).update(payload)
  } else {
    await getDb()(PAYMENT_TABLES.GATEWAYS).insert(payload)
  }
  return (await findGateway(input.provider)) as PaymentGatewayRow
}

export async function markTested(provider: PaymentProviderId, status: GatewayStatus): Promise<void> {
  await getDb()(PAYMENT_TABLES.GATEWAYS)
    .where({ provider })
    .update({
      status,
      tested_at: getDb().fn.now(),
      updated_at: getDb().fn.now(),
    })
}

export function mergeCredentials(
  previous: GatewayCredentials,
  incoming: GatewayCredentials,
): GatewayCredentials {
  const next: GatewayCredentials = { ...previous }
  for (const [key, value] of Object.entries(incoming)) {
    const trimmed = value.trim()
    if (trimmed.length > 0) next[key] = trimmed
  }
  return next
}

export { PAYMENT_STATUS }
