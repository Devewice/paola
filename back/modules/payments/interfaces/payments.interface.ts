import type { GatewayMode, GatewayStatus, PaymentProviderId } from '../constants/payments.constants.js'

export type GatewayCredentials = Record<string, string>

export type PaymentGatewayRow = {
  readonly id: string
  readonly provider: PaymentProviderId
  readonly mode: GatewayMode
  readonly enabled: boolean
  readonly status: GatewayStatus
  readonly credentials: GatewayCredentials
  readonly testedAt: string | null
}

export type PublicPaymentMethod = {
  readonly id: string
  readonly channel: 'human' | 'gateway'
  readonly available: boolean
  readonly wired: boolean
}

export type OperatorGateway = {
  readonly provider: PaymentProviderId
  readonly mode: GatewayMode
  readonly enabled: boolean
  readonly status: GatewayStatus
  readonly filled: readonly string[]
}

export type GatewayTestResult = {
  readonly provider: PaymentProviderId
  readonly ok: boolean
  readonly wired: boolean
  readonly detail: string
}

export type CheckoutSession = {
  readonly method: string
  readonly status: 'human' | 'redirect' | 'deferred'
  readonly href?: string
  readonly checkoutUrl?: string
  readonly detail: string
}
