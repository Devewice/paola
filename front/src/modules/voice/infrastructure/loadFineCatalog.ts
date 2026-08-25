import type { FineCatalogPort } from '@modules/voice/domain/ports/FineCatalogPort.ts'
import { InMemoryFineCatalog } from '@modules/voice/infrastructure/InMemoryFineCatalog.ts'
import { parseFineList } from '@modules/voice/infrastructure/parseFine.ts'
import { abortAfter } from '@shared/http/abortAfter.ts'
import { API, FETCH_TIMEOUT_MS } from '@shared/http/constants.ts'

/** Origen único: MySQL vía GET /api/fines. */
export async function loadFineCatalog(): Promise<FineCatalogPort> {
  try {
    const response = await fetch(API.FINES, { signal: abortAfter(FETCH_TIMEOUT_MS) })
    if (!response.ok) return new InMemoryFineCatalog()
    const body: unknown = await response.json()
    return new InMemoryFineCatalog(parseFineList(body).items)
  } catch {
    return new InMemoryFineCatalog()
  }
}
