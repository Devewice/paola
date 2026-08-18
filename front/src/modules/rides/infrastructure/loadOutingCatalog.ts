import type { OutingCatalogPort } from '@modules/rides/domain/ports/OutingCatalogPort.ts'
import { InMemoryOutingCatalog } from '@modules/rides/infrastructure/InMemoryOutingCatalog.ts'
import { parseOuting } from '@modules/rides/infrastructure/parseOuting.ts'
import { abortAfter } from '@shared/http/abortAfter.ts'
import { API, FETCH_TIMEOUT_MS } from '@shared/http/constants.ts'

/** Origen único: MySQL vía `GET /api/outings`. Si falla, lista vacía — no hay JSON. */
export async function loadOutingCatalog(): Promise<OutingCatalogPort> {
  try {
    const response = await fetch(API.OUTINGS, { signal: abortAfter(FETCH_TIMEOUT_MS) })
    if (!response.ok) return new InMemoryOutingCatalog()
    const body: unknown = await response.json()
    if (!body || typeof body !== 'object' || !('outings' in body)) {
      return new InMemoryOutingCatalog()
    }
    const raw = (body as { outings: unknown }).outings
    if (!Array.isArray(raw)) return new InMemoryOutingCatalog()
    return new InMemoryOutingCatalog(raw.map(parseOuting).filter((item) => item !== null))
  } catch {
    return new InMemoryOutingCatalog()
  }
}
