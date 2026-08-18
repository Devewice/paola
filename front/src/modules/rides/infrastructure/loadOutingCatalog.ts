import type { OutingCatalogPort } from '@modules/rides/domain/ports/OutingCatalogPort.ts'
import { InMemoryOutingCatalog } from '@modules/rides/infrastructure/InMemoryOutingCatalog.ts'
import { parseOuting } from '@modules/rides/infrastructure/parseOuting.ts'

/** Origen único: MySQL vía `GET /api/salidas`. */
export async function loadOutingCatalog(): Promise<OutingCatalogPort> {
  const response = await fetch('/api/salidas')
  if (!response.ok) {
    throw new Error('No se pudo leer /api/salidas')
  }
  const body: unknown = await response.json()
  if (!body || typeof body !== 'object' || !('outings' in body)) {
    throw new Error('La respuesta de /api/salidas no es válida')
  }
  const raw = (body as { outings: unknown }).outings
  if (!Array.isArray(raw)) {
    throw new Error('La respuesta de /api/salidas no es válida')
  }
  return new InMemoryOutingCatalog(raw.map(parseOuting).filter((item) => item !== null))
}
