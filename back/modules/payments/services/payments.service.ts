import { HTTP_STATUS } from '../../../http/constants.js'
import type { Fail } from '../../../http/types.js'
import {
  PAYMENT_MESSAGES,
  PAYMENT_STATUS,
  type PaymentProviderId,
} from '../constants/payments.constants.js'
import type { CheckoutDto, SaveGatewayDto } from '../dtos/payments.dto.js'
import type {
  CheckoutSession,
  GatewayTestResult,
  OperatorGateway,
  PublicPaymentMethod,
} from '../interfaces/payments.interface.js'
import { gatewayAdapter, requiredMissing } from '../providers/gateways.js'
import {
  findGateway,
  findGateways,
  markTested,
  mergeCredentials,
  upsertGateway,
} from '../providers/payments.provider.js'
import { toOperatorGateway } from '../schemas/payments.schema.js'

const HUMAN_METHODS: readonly PublicPaymentMethod[] = [
  { id: 'whatsapp', channel: 'human', available: true, wired: true },
  { id: 'mail', channel: 'human', available: true, wired: true },
]

function resolveStatus(complete: boolean, enabled: boolean): (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS] {
  if (!complete) return PAYMENT_STATUS.DRAFT
  if (enabled) return PAYMENT_STATUS.LIVE
  return PAYMENT_STATUS.READY
}

export async function listPublicMethods(): Promise<PublicPaymentMethod[]> {
  const rows = await findGateways()
  const gateways: PublicPaymentMethod[] = rows
    .filter((row) => row.enabled && row.status === PAYMENT_STATUS.LIVE)
    .map((row) => ({
      id: row.provider,
      channel: 'gateway',
      available: true,
      wired: false,
    }))
  return [...HUMAN_METHODS, ...gateways]
}

export async function listOperatorGateways(): Promise<OperatorGateway[]> {
  const rows = await findGateways()
  return rows.map(toOperatorGateway)
}

export async function saveGateways(
  drafts: readonly SaveGatewayDto[],
): Promise<Fail | { ok: true; gateways: OperatorGateway[] }> {
  const selected = new Set(drafts.map((draft) => draft.provider))
  const existing = await findGateways()
  for (const row of existing) {
    if (!selected.has(row.provider)) {
      await upsertGateway({
        provider: row.provider,
        mode: row.mode,
        enabled: false,
        status: PAYMENT_STATUS.OFF,
        credentials: row.credentials,
      })
    }
  }
  for (const draft of drafts) {
    const previous = await findGateway(draft.provider)
    const credentials = mergeCredentials(previous?.credentials ?? {}, draft.credentials)
    const complete = requiredMissing(draft.provider, credentials).length === 0
    await upsertGateway({
      provider: draft.provider,
      mode: draft.mode,
      enabled: complete ? draft.enabled : false,
      status: resolveStatus(complete, complete && draft.enabled),
      credentials,
    })
  }
  return { ok: true, gateways: await listOperatorGateways() }
}

export async function testGateway(
  provider: PaymentProviderId,
): Promise<Fail | { ok: true; test: GatewayTestResult }> {
  const row = await findGateway(provider)
  if (!row) {
    return { ok: false, status: HTTP_STATUS.NOT_FOUND, detail: PAYMENT_MESSAGES.MISSING_KEYS }
  }
  const probe = gatewayAdapter(provider).test(row.credentials)
  const nextStatus = probe.ok
    ? row.enabled
      ? PAYMENT_STATUS.LIVE
      : PAYMENT_STATUS.READY
    : PAYMENT_STATUS.DRAFT
  await markTested(provider, nextStatus)
  return {
    ok: true,
    test: {
      provider,
      ok: probe.ok,
      wired: probe.wired,
      detail: probe.detail,
    },
  }
}

export async function createCheckout(
  draft: CheckoutDto,
): Promise<Fail | { ok: true; checkout: CheckoutSession }> {
  if (draft.method === 'whatsapp' || draft.method === 'mail') {
    return {
      ok: true,
      checkout: {
        method: draft.method,
        status: 'human',
        detail: PAYMENT_MESSAGES.HUMAN_ONLY,
      },
    }
  }

  const provider = draft.method as PaymentProviderId
  const row = await findGateway(provider)
  if (!row || !row.enabled || (row.status !== PAYMENT_STATUS.LIVE && row.status !== PAYMENT_STATUS.READY)) {
    return { ok: false, status: HTTP_STATUS.BAD_REQUEST, detail: PAYMENT_MESSAGES.NOT_READY }
  }

  const charge = gatewayAdapter(provider).charge(row.credentials, {
    amountCop: draft.amountCop ?? 0,
    reference: draft.reference,
    redirectUrl: '/tienda',
  })

  if (charge.ok) {
    return {
      ok: true,
      checkout: {
        method: provider,
        status: 'redirect',
        checkoutUrl: charge.checkoutUrl,
        detail: PAYMENT_MESSAGES.TEST_OK,
      },
    }
  }

  return {
    ok: true,
    checkout: {
      method: provider,
      status: 'deferred',
      detail: charge.detail,
    },
  }
}
