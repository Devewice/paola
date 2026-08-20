import type { AppError } from '@core/errors/AppError.ts'
import type { Result } from '@core/result.ts'
import type {
  CheckoutDraft,
  CheckoutSession,
  GatewayTest,
  OperatorGateway,
  PaymentMethod,
  WizardGatewayDraft,
} from '@modules/shop/domain/entities/Payment.ts'
import type { PaymentProviderId } from '@modules/shop/constants/payments.ts'

export interface PaymentPort {
  listMethods(): Promise<Result<readonly PaymentMethod[], AppError>>
  listOperatorGateways(clave: string): Promise<Result<readonly OperatorGateway[], AppError>>
  saveWizard(
    gateways: readonly WizardGatewayDraft[],
    clave: string,
  ): Promise<Result<readonly OperatorGateway[], AppError>>
  testGateway(provider: PaymentProviderId, clave: string): Promise<Result<GatewayTest, AppError>>
  createCheckout(draft: CheckoutDraft): Promise<Result<CheckoutSession, AppError>>
}
