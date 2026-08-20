import { HTTP_STATUS } from '../../../http/constants.js'
import { fail } from '../../../http/fail.js'
import type { Parsed } from '../../../http/types.js'
import {
  PAYMENT_MESSAGES,
  PAYMENT_MODE,
  PAYMENT_PROVIDER_SET,
  PAYMENT_PROVIDERS,
  type GatewayMode,
  type PaymentProviderId,
} from '../constants/payments.constants.js'
import type { CheckoutDto, SaveGatewayDto, TestGatewayDto } from '../dtos/payments.dto.js'
import type { GatewayCredentials, OperatorGateway, PaymentGatewayRow } from '../interfaces/payments.interface.js'

function asProvider(value: unknown): PaymentProviderId | null {
  const id = String(value ?? '').trim()
  if (!PAYMENT_PROVIDER_SET.has(id)) return null
  return id as PaymentProviderId
}

function asMode(value: unknown): GatewayMode {
  return value === PAYMENT_MODE.LIVE ? PAYMENT_MODE.LIVE : PAYMENT_MODE.SANDBOX
}

function asCredentials(value: unknown): GatewayCredentials {
  if (!value || typeof value !== 'object') return {}
  const next: GatewayCredentials = {}
  for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
    if (typeof item === 'string') next[key] = item
  }
  return next
}

export function parseSaveGateways(draft: Record<string, unknown>): Parsed<readonly SaveGatewayDto[]> {
  const raw = draft.gateways
  if (!Array.isArray(raw)) {
    return fail(HTTP_STATUS.BAD_REQUEST, PAYMENT_MESSAGES.PROVIDER_INVALID)
  }
  const items: SaveGatewayDto[] = []
  for (const row of raw) {
    if (!row || typeof row !== 'object') {
      return fail(HTTP_STATUS.BAD_REQUEST, PAYMENT_MESSAGES.PROVIDER_INVALID)
    }
    const record = row as Record<string, unknown>
    const provider = asProvider(record.provider)
    if (!provider) {
      return fail(HTTP_STATUS.BAD_REQUEST, PAYMENT_MESSAGES.PROVIDER_INVALID)
    }
    items.push({
      provider,
      mode: asMode(record.mode),
      enabled: Boolean(record.enabled),
      credentials: asCredentials(record.credentials),
    })
  }
  return { ok: true, value: items }
}

export function parseTestGateway(draft: Record<string, unknown>): Parsed<TestGatewayDto> {
  const provider = asProvider(draft.provider)
  if (!provider) {
    return fail(HTTP_STATUS.BAD_REQUEST, PAYMENT_MESSAGES.PROVIDER_INVALID)
  }
  return { ok: true, value: { provider } }
}

export function parseCheckout(draft: Record<string, unknown>): Parsed<CheckoutDto> {
  const method = String(draft.method ?? '').trim()
  if (!method) {
    return fail(HTTP_STATUS.BAD_REQUEST, PAYMENT_MESSAGES.PROVIDER_INVALID)
  }
  const amountRaw = draft.amountCop
  let amountCop: number | null = null
  if (amountRaw !== null && amountRaw !== undefined && amountRaw !== '') {
    const n = Number(amountRaw)
    if (!Number.isInteger(n) || n < 0) {
      return fail(HTTP_STATUS.BAD_REQUEST, PAYMENT_MESSAGES.AMOUNT_INVALID)
    }
    amountCop = n
  }
  return {
    ok: true,
    value: {
      method,
      amountCop,
      reference: String(draft.reference ?? '').trim() || 'tienda',
    },
  }
}

export function toOperatorGateway(row: PaymentGatewayRow): OperatorGateway {
  const catalog = PAYMENT_PROVIDERS.find((item) => item.id === row.provider)
  const filled = (catalog?.fields ?? [])
    .filter((field) => String(row.credentials[field.key] ?? '').trim())
    .map((field) => field.key)
  return {
    provider: row.provider,
    mode: row.mode,
    enabled: row.enabled,
    status: row.status,
    filled,
  }
}
