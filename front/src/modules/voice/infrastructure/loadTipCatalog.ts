import type { TipCatalogPort } from '@modules/voice/domain/ports/TipCatalogPort.ts'
import { InMemoryTipCatalog } from '@modules/voice/infrastructure/InMemoryTipCatalog.ts'
import { parseTipList } from '@modules/voice/infrastructure/parseTip.ts'

function abortAfter(ms: number): AbortSignal {
  const controller = new AbortController()
  window.setTimeout(() => controller.abort(), ms)
  return controller.signal
}

/** Origen único: MySQL vía GET /api/tips. Si falla, lista vacía — no hay JSON. */
export async function loadTipCatalog(): Promise<TipCatalogPort> {
  try {
    const response = await fetch('/api/tips', { signal: abortAfter(2500) })
    if (!response.ok) return new InMemoryTipCatalog()
    const body: unknown = await response.json()
    const list = parseTipList(body)
    return new InMemoryTipCatalog(list.items)
  } catch {
    return new InMemoryTipCatalog()
  }
}
