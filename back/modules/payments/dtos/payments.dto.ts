import type { GatewayMode, PaymentProviderId } from '../constants/payments.constants.js'
import type { GatewayCredentials } from '../interfaces/payments.interface.js'

export type SaveGatewayDto = {
  readonly provider: PaymentProviderId
  readonly mode: GatewayMode
  readonly enabled: boolean
  readonly credentials: GatewayCredentials
}

export type CheckoutDto = {
  readonly method: string
  readonly amountCop: number | null
  readonly reference: string
}

export type TestGatewayDto = {
  readonly provider: PaymentProviderId
}
