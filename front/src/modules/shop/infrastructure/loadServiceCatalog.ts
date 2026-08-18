import type { ServiceCatalogPort } from '@modules/shop/domain/ports/ServiceCatalogPort.ts'
import { InMemoryServiceCatalog } from '@modules/shop/infrastructure/InMemoryServiceCatalog.ts'
import { parseServiceList } from '@modules/shop/infrastructure/parseService.ts'
import { abortAfter } from '@shared/http/abortAfter.ts'
import { API, FETCH_TIMEOUT_MS } from '@shared/http/constants.ts'

/** Origen único: MySQL vía GET /api/services. Si falla, lista vacía — no hay JSON. */
export async function loadServiceCatalog(): Promise<ServiceCatalogPort> {
  try {
    const response = await fetch(API.SERVICES, { signal: abortAfter(FETCH_TIMEOUT_MS) })
    if (!response.ok) return new InMemoryServiceCatalog()
    const body: unknown = await response.json()
    return new InMemoryServiceCatalog(parseServiceList(body))
  } catch {
    return new InMemoryServiceCatalog()
  }
}
