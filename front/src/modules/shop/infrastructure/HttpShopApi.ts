import { appError, type AppError } from '@core/errors/AppError.ts'
import { err, ok, type Result } from '@core/result.ts'
import { SHOP_API_MESSAGES } from '@modules/shop/constants/copy.ts'
import type { ProductDraft } from '@modules/shop/domain/entities/Product.ts'
import type { ServiceDraft } from '@modules/shop/domain/entities/ShopService.ts'
import type { ShopWritePort } from '@modules/shop/domain/ports/ShopWritePort.ts'
import { parseProduct } from '@modules/shop/infrastructure/parseProduct.ts'
import { parseService } from '@modules/shop/infrastructure/parseService.ts'
import { API, API_FAIL_FALLBACK, HTTP_STATUS, JSON_HEADERS } from '@shared/http/constants.ts'

export class HttpShopApi implements ShopWritePort {
  async publish(draft: ProductDraft, clave: string) {
    const response = await fetch(API.OPERAR_PRODUCTS, {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify({ ...draft, clave }),
    })
    const body = await readBody(response)
    if (!response.ok) return fail(response.status, body)
    const product = parseProduct(body.product)
    if (!product) {
      return err(appError('INFRASTRUCTURE', SHOP_API_MESSAGES.PARSE_FAIL))
    }
    return ok(product)
  }

  async publishService(draft: ServiceDraft, clave: string) {
    const response = await fetch(API.OPERAR_SERVICES, {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify({ ...draft, clave }),
    })
    const body = await readBody(response)
    if (!response.ok) return fail(response.status, body)
    const service = parseService(body.service)
    if (!service) {
      return err(appError('INFRASTRUCTURE', SHOP_API_MESSAGES.PARSE_SERVICE_FAIL))
    }
    return ok(service)
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
