import type { PaymentMethodId, PaymentMode, PaymentProviderId } from '@modules/shop/constants/payments.ts'

export type PaymentChannel = 'human' | 'gateway'

export type PaymentMethod = {
  readonly id: PaymentMethodId
  readonly channel: PaymentChannel
  readonly title: string
  readonly copy: string
  readonly icon: string
  readonly available: boolean
  readonly wired: boolean
}

export type GatewayStatus = 'off' | 'draft' | 'ready' | 'live'

export type OperatorGateway = {
  readonly provider: PaymentProviderId
  readonly mode: PaymentMode
  readonly enabled: boolean
  readonly status: GatewayStatus
  readonly filled: readonly string[]
}

export type GatewayCredentials = Record<string, string>

export type WizardGatewayDraft = {
  readonly provider: PaymentProviderId
  readonly mode: PaymentMode
  readonly enabled: boolean
  readonly credentials: GatewayCredentials
}

export type GatewayTest = {
  readonly provider: PaymentProviderId
  readonly ok: boolean
  readonly wired: boolean
  readonly detail: string
}

export type CheckoutDraft = {
  readonly method: PaymentMethodId
  readonly amountCop: number | null
  readonly reference: string
}

export type CheckoutSession = {
  readonly method: PaymentMethodId
  readonly status: 'human' | 'redirect' | 'deferred'
  readonly href?: string
  readonly checkoutUrl?: string
  readonly detail: string
}
