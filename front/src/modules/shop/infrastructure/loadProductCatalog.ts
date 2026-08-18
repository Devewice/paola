import type { ProductCatalogPort } from '@modules/shop/domain/ports/ProductCatalogPort.ts'
import { InMemoryProductCatalog } from '@modules/shop/infrastructure/InMemoryProductCatalog.ts'
import { parseProductList } from '@modules/shop/infrastructure/parseProduct.ts'
import { abortAfter } from '@shared/http/abortAfter.ts'
import { API, FETCH_TIMEOUT_MS } from '@shared/http/constants.ts'

/** Origen único: MySQL vía GET /api/products. Si falla, lista vacía — no hay JSON. */
export async function loadProductCatalog(): Promise<ProductCatalogPort> {
  try {
    const response = await fetch(API.PRODUCTS, { signal: abortAfter(FETCH_TIMEOUT_MS) })
    if (!response.ok) return new InMemoryProductCatalog()
    const body: unknown = await response.json()
    return new InMemoryProductCatalog(parseProductList(body))
  } catch {
    return new InMemoryProductCatalog()
  }
}
