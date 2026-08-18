import { appError, type AppError } from '@core/errors/AppError.ts'
import { err, ok, type Result } from '@core/result.ts'
import type { ProductDraft } from '@modules/shop/domain/entities/Product.ts'
import type { ShopWritePort } from '@modules/shop/domain/ports/ShopWritePort.ts'
import { parseProduct } from '@modules/shop/infrastructure/parseProduct.ts'

export class HttpShopApi implements ShopWritePort {
  async publish(draft: ProductDraft, clave: string) {
    const response = await fetch('/api/operar/productos', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...draft, clave }),
    })
    const body = await readBody(response)
    if (!response.ok) return fail(response.status, body)
    const product = parseProduct(body.product)
    if (!product) {
      return err(appError('INFRASTRUCTURE', 'La API devolvió un producto que no se entiende.'))
    }
    return ok(product)
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
  const detail = typeof body.detail === 'string' ? body.detail : 'No se pudo completar.'
  if (status === 400 || status === 403) return err(appError('VALIDATION', detail))
  return err(appError('INFRASTRUCTURE', detail))
}
