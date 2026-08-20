import { appError, type AppError } from '@core/errors/AppError.ts'
import { err, ok, type Result } from '@core/result.ts'
import { PAYMENT_API_MESSAGES, type PaymentProviderId } from '@modules/shop/constants/payments.ts'
import type {
  CheckoutDraft,
  CheckoutSession,
  GatewayTest,
  OperatorGateway,
  PaymentMethod,
  WizardGatewayDraft,
} from '@modules/shop/domain/entities/Payment.ts'
import type { PaymentPort } from '@modules/shop/domain/ports/PaymentPort.ts'
import {
  parseCheckoutSession,
  parseGatewayTest,
  parseMethodList,
  parseOperatorGateways,
} from '@modules/shop/infrastructure/parsePayment.ts'
import { API, API_FAIL_FALLBACK, HTTP_STATUS, JSON_HEADERS, OPERADOR_CLAVE_HEADER } from '@shared/http/constants.ts'

export class HttpPaymentsApi implements PaymentPort {
  async listMethods(): Promise<Result<readonly PaymentMethod[], AppError>> {
    try {
      const response = await fetch(API.PAYMENTS_METHODS)
      const body = await readBody(response)
      if (!response.ok) return fail(response.status, body)
      return ok(parseMethodList(body))
    } catch {
      return ok([])
    }
  }

  async listOperatorGateways(clave: string): Promise<Result<readonly OperatorGateway[], AppError>> {
    const response = await fetch(API.OPERAR_PAYMENTS, {
      headers: { [OPERADOR_CLAVE_HEADER]: clave },
    })
    const body = await readBody(response)
    if (!response.ok) return fail(response.status, body)
    return ok(parseOperatorGateways(body))
  }

  async saveWizard(
    gateways: readonly WizardGatewayDraft[],
    clave: string,
  ): Promise<Result<readonly OperatorGateway[], AppError>> {
    const response = await fetch(API.OPERAR_PAYMENTS, {
      method: 'POST',
      headers: { ...JSON_HEADERS, [OPERADOR_CLAVE_HEADER]: clave },
      body: JSON.stringify({ clave, gateways }),
    })
    const body = await readBody(response)
    if (!response.ok) return fail(response.status, body)
    return ok(parseOperatorGateways(body))
  }

  async testGateway(provider: PaymentProviderId, clave: string): Promise<Result<GatewayTest, AppError>> {
    const response = await fetch(API.OPERAR_PAYMENTS_TEST, {
      method: 'POST',
      headers: { ...JSON_HEADERS, [OPERADOR_CLAVE_HEADER]: clave },
      body: JSON.stringify({ clave, provider }),
    })
    const body = await readBody(response)
    if (!response.ok) return fail(response.status, body)
    const parsed = parseGatewayTest(body)
    if (!parsed) return err(appError('INFRASTRUCTURE', PAYMENT_API_MESSAGES.PARSE_FAIL))
    return ok(parsed)
  }

  async createCheckout(draft: CheckoutDraft): Promise<Result<CheckoutSession, AppError>> {
    const response = await fetch(API.PAYMENTS_CHECKOUT, {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify(draft),
    })
    const body = await readBody(response)
    if (!response.ok) return fail(response.status, body)
    const parsed = parseCheckoutSession(body)
    if (!parsed) return err(appError('INFRASTRUCTURE', PAYMENT_API_MESSAGES.PARSE_FAIL))
    return ok(parsed)
  }
}

async function readBody(response: Response): Promise<Record<string, unknown>> {
  try {
    const body: unknown = await response.json()
    if (body && typeof body === 'object') return body as Record<string, unknown>
  } catch {
    /* vacío */
  }
  return {}
}

function fail(status: number, body: Record<string, unknown>): Result<never, AppError> {
  const detail = typeof body.detail === 'string' ? body.detail : API_FAIL_FALLBACK
  if (status === HTTP_STATUS.BAD_REQUEST || status === HTTP_STATUS.FORBIDDEN) {
    return err(appError('VALIDATION', detail))
  }
  return err(appError('INFRASTRUCTURE', detail))
}
