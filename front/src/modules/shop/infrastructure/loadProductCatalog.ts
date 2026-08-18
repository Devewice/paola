import type { ProductCatalogPort } from '@modules/shop/domain/ports/ProductCatalogPort.ts'
import { InMemoryProductCatalog } from '@modules/shop/infrastructure/InMemoryProductCatalog.ts'
import { parseProductList } from '@modules/shop/infrastructure/parseProduct.ts'

function abortAfter(ms: number): AbortSignal {
  const controller = new AbortController()
  window.setTimeout(() => controller.abort(), ms)
  return controller.signal
}

/** Origen único: MySQL vía GET /api/productos. Si falla, lista vacía — no hay JSON. */
export async function loadProductCatalog(): Promise<ProductCatalogPort> {
  try {
    const response = await fetch('/api/productos', { signal: abortAfter(2500) })
    if (!response.ok) return new InMemoryProductCatalog()
    const body: unknown = await response.json()
    return new InMemoryProductCatalog(parseProductList(body))
  } catch {
    return new InMemoryProductCatalog()
  }
}
