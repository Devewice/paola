import { appError, type AppError } from '@core/errors/AppError.ts'
import { err, ok, type Result } from '@core/result.ts'
import { SHOP_API_MESSAGES } from '@modules/shop/constants/copy.ts'
import type { Product, ProductDraft } from '@modules/shop/domain/entities/Product.ts'
import type { ServiceDraft, ShopService } from '@modules/shop/domain/entities/ShopService.ts'
import type { ShopWritePort } from '@modules/shop/domain/ports/ShopWritePort.ts'
import { parseProduct } from '@modules/shop/infrastructure/parseProduct.ts'
import { parseService } from '@modules/shop/infrastructure/parseService.ts'
import {
  API,
  API_FAIL_FALLBACK,
  HTTP_STATUS,
  JSON_HEADERS,
  apiOperarItem,
  apiOperarItemDelete,
} from '@shared/http/constants.ts'

export class HttpShopApi implements ShopWritePort {
  publish(draft: ProductDraft, clave: string) {
    return this.saveProduct(API.OPERAR_PRODUCTS, draft, clave)
  }

  update(id: string, draft: ProductDraft, clave: string) {
    return this.saveProduct(apiOperarItem(API.OPERAR_PRODUCTS, id), draft, clave)
  }

  remove(id: string, clave: string) {
    return postDone(apiOperarItemDelete(API.OPERAR_PRODUCTS, id), clave)
  }

  publishService(draft: ServiceDraft, clave: string) {
    return this.saveService(API.OPERAR_SERVICES, draft, clave)
  }

  updateService(id: string, draft: ServiceDraft, clave: string) {
    return this.saveService(apiOperarItem(API.OPERAR_SERVICES, id), draft, clave)
  }

  removeService(id: string, clave: string) {
    return postDone(apiOperarItemDelete(API.OPERAR_SERVICES, id), clave)
  }

  private async saveProduct(url: string, draft: ProductDraft, clave: string): Promise<Result<Product, AppError>> {
    const response = await fetch(url, {
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

  private async saveService(url: string, draft: ServiceDraft, clave: string): Promise<Result<ShopService, AppError>> {
    const response = await fetch(url, {
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

async function postDone(url: string, clave: string): Promise<Result<true, AppError>> {
  const response = await fetch(url, { method: 'POST', headers: JSON_HEADERS, body: JSON.stringify({ clave }) })
  const body = await readBody(response)
  if (!response.ok) return fail(response.status, body)
  return ok(true)
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
  if (status === HTTP_STATUS.CONFLICT) return err(appError('CONFLICT', detail))
  if (status === HTTP_STATUS.NOT_FOUND) return err(appError('NOT_FOUND', detail))
  return err(appError('INFRASTRUCTURE', detail))
}
