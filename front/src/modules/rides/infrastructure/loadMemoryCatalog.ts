import type { MemoryCatalogPort } from '@modules/rides/domain/ports/MemoryCatalogPort.ts'
import { InMemoryMemoryCatalog } from '@modules/rides/infrastructure/InMemoryMemoryCatalog.ts'
import { parseMemoryList } from '@modules/rides/infrastructure/parseMemory.ts'
import { abortAfter } from '@shared/http/abortAfter.ts'
import { API, FETCH_TIMEOUT_MS } from '@shared/http/constants.ts'

/** Origen único: MySQL vía GET /api/memories. Si falla, lista vacía — no hay JSON. */
export async function loadMemoryCatalog(): Promise<MemoryCatalogPort> {
  try {
    const response = await fetch(API.MEMORIES, { signal: abortAfter(FETCH_TIMEOUT_MS) })
    if (!response.ok) return new InMemoryMemoryCatalog()
    const body: unknown = await response.json()
    const list = parseMemoryList(body)
    return new InMemoryMemoryCatalog(list.items, list.totalKm)
  } catch {
    return new InMemoryMemoryCatalog()
  }
}
