import { appError, type AppError } from '@core/errors/AppError.ts'
import { err, ok, type Result } from '@core/result.ts'
import { API_FAIL_FALLBACK, HTTP_STATUS, JSON_HEADERS, OPERADOR_CLAVE_HEADER, API } from '@shared/http/constants.ts'
import type { ServiceOrderApiPort } from '@modules/shop/domain/ports/ServiceOrderApiPort.ts'
import type { ServiceOrder, ServiceOrderNotice } from '@modules/shop/domain/entities/ServiceOrder.ts'
import { parseServiceOrder, parseServiceOrderList } from '@modules/shop/infrastructure/parseServiceOrder.ts'
import { buildOrderWhatsAppHref } from '@modules/shop/infrastructure/buildOrderWhatsAppHref.ts'
import type { ServiceOrderDraft } from '@modules/shop/domain/entities/ServiceOrder.ts'

type Contact = {
  readonly whatsappHref: string
}

function fail(status: number, body: Record<string, unknown>): Result<never, AppError> {
  const detail = typeof body.detail === 'string' ? body.detail : API_FAIL_FALLBACK
  if (status === HTTP_STATUS.BAD_REQUEST || status === HTTP_STATUS.FORBIDDEN) {
    return err(appError('VALIDATION', detail))
  }
  return err(appError('INFRASTRUCTURE', detail))
}

export class HttpShopOrdersApi implements ServiceOrderApiPort {
  private readonly contact: Contact

  constructor(contact: Contact) {
    this.contact = contact
  }

  async create(draft: ServiceOrderDraft): Promise<Result<{ order: ServiceOrder; notice: { whatsappHref: string } }, AppError>> {
    const response = await fetch(API.ORDERS, {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify(draft),
    })
    const body = await readBody(response)
    if (!response.ok) return fail(response.status, body)

    const order = parseServiceOrder(body.order)
    if (!order) {
      return err(appError('INFRASTRUCTURE', 'Pedido no se pudo entender.'))
    }

    const notice: ServiceOrderNotice = {
      whatsappHref: buildOrderWhatsAppHref(order, this.contact.whatsappHref),
    }
    return ok({ order, notice })
  }

  async listOperatorOrders(clave: string): Promise<Result<readonly ServiceOrder[], AppError>> {
    const response = await fetch(API.OPERAR_ORDERS, {
      headers: { [OPERADOR_CLAVE_HEADER]: clave },
    })
    const body = await readBody(response)
    if (!response.ok) return fail(response.status, body)

    if (!body || typeof body !== 'object' || !Array.isArray((body as Record<string, unknown>).orders)) {
      return err(appError('INFRASTRUCTURE', 'Respuesta de pedidos no se entiende.'))
    }

    return ok(parseServiceOrderList(body))
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

