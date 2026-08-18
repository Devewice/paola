import type { MemoryCatalogPort } from '@modules/rides/domain/ports/MemoryCatalogPort.ts'
import { InMemoryMemoryCatalog } from '@modules/rides/infrastructure/InMemoryMemoryCatalog.ts'
import { parseMemoryList } from '@modules/rides/infrastructure/parseMemory.ts'

function abortAfter(ms: number): AbortSignal {
  const controller = new AbortController()
  window.setTimeout(() => controller.abort(), ms)
  return controller.signal
}

/** Origen único: MySQL vía GET /api/memorias. Si falla, lista vacía — no hay JSON. */
export async function loadMemoryCatalog(): Promise<MemoryCatalogPort> {
  try {
    const response = await fetch('/api/memorias', { signal: abortAfter(2500) })
    if (!response.ok) return new InMemoryMemoryCatalog()
    const body: unknown = await response.json()
    const list = parseMemoryList(body)
    return new InMemoryMemoryCatalog(list.items, list.totalKm)
  } catch {
    return new InMemoryMemoryCatalog()
  }
}
