import type { TipCatalogPort } from '@modules/voice/domain/ports/TipCatalogPort.ts'
import { InMemoryTipCatalog } from '@modules/voice/infrastructure/InMemoryTipCatalog.ts'
import { parseTipList } from '@modules/voice/infrastructure/parseTip.ts'
import { abortAfter } from '@shared/http/abortAfter.ts'
import { API, FETCH_TIMEOUT_MS } from '@shared/http/constants.ts'

/** Origen único: MySQL vía GET /api/tips. Si falla, lista vacía — no hay JSON. */
export async function loadTipCatalog(): Promise<TipCatalogPort> {
  try {
    const response = await fetch(API.TIPS, { signal: abortAfter(FETCH_TIMEOUT_MS) })
    if (!response.ok) return new InMemoryTipCatalog()
    const body: unknown = await response.json()
    const list = parseTipList(body)
    return new InMemoryTipCatalog(list.items)
  } catch {
    return new InMemoryTipCatalog()
  }
}
