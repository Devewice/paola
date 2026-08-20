import {
  PAYMENT_MESSAGES,
  PAYMENT_PROVIDERS,
  type PaymentProviderId,
} from '../constants/payments.constants.js'
import type { GatewayCredentials } from '../interfaces/payments.interface.js'

export type GatewayChargeInput = {
  readonly amountCop: number
  readonly reference: string
  readonly redirectUrl: string
}

export type GatewayChargeResult =
  | { ok: true; checkoutUrl: string; externalId: string }
  | { ok: false; reason: 'not_wired' | 'bad_config'; detail: string }

export type GatewayProbe = {
  readonly ok: boolean
  readonly wired: boolean
  readonly detail: string
}

/** Cada pasarela implementa esto. Hoy valida llaves; el HTTP al proveedor se engancha después. */
export type PaymentGatewayAdapter = {
  readonly id: PaymentProviderId
  test(credentials: GatewayCredentials): GatewayProbe
  charge(credentials: GatewayCredentials, input: GatewayChargeInput): GatewayChargeResult
}

function catalogOf(id: PaymentProviderId) {
  return PAYMENT_PROVIDERS.find((item) => item.id === id)
}

function missingKeys(id: PaymentProviderId, credentials: GatewayCredentials): string[] {
  const item = catalogOf(id)
  if (!item) return ['provider']
  return item.fields
    .filter((field) => field.required && !String(credentials[field.key] ?? '').trim())
    .map((field) => field.key)
}

function stubAdapter(id: PaymentProviderId): PaymentGatewayAdapter {
  return {
    id,
    test(credentials) {
      const missing = missingKeys(id, credentials)
      if (missing.length) {
        return { ok: false, wired: false, detail: PAYMENT_MESSAGES.MISSING_KEYS }
      }
      return { ok: true, wired: false, detail: PAYMENT_MESSAGES.TEST_OK }
    },
    charge(credentials) {
      const missing = missingKeys(id, credentials)
      if (missing.length) {
        return { ok: false, reason: 'bad_config', detail: PAYMENT_MESSAGES.MISSING_KEYS }
      }
      return { ok: false, reason: 'not_wired', detail: PAYMENT_MESSAGES.NOT_WIRED }
    },
  }
}

const adapters: Record<PaymentProviderId, PaymentGatewayAdapter> = {
  wompi: stubAdapter('wompi'),
  pse: stubAdapter('pse'),
  addi: stubAdapter('addi'),
  payu: stubAdapter('payu'),
  epayco: stubAdapter('epayco'),
  bold: stubAdapter('bold'),
  mercadopago: stubAdapter('mercadopago'),
}

export function gatewayAdapter(id: PaymentProviderId): PaymentGatewayAdapter {
  return adapters[id]
}

export function requiredMissing(id: PaymentProviderId, credentials: GatewayCredentials): string[] {
  return missingKeys(id, credentials)
}
