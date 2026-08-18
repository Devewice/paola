import type { OutingCatalogPort } from '@modules/rides/domain/ports/OutingCatalogPort.ts'
import { InMemoryOutingCatalog } from '@modules/rides/infrastructure/InMemoryOutingCatalog.ts'
import { parseOuting } from '@modules/rides/infrastructure/parseOuting.ts'

function abortAfter(ms: number): AbortSignal {
  const controller = new AbortController()
  window.setTimeout(() => controller.abort(), ms)
  return controller.signal
}

/** Origen único: MySQL vía `GET /api/salidas`. Si falla, lista vacía — no hay JSON. */
export async function loadOutingCatalog(): Promise<OutingCatalogPort> {
  try {
    const response = await fetch('/api/salidas', { signal: abortAfter(2500) })
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
