import { ref } from 'vue'
import type { SiteSectionId } from '@app/constants/sections.ts'
import { API, JSON_HEADERS, OPERADOR_CLAVE_HEADER } from '@shared/http/constants.ts'

export type SiteSectionState = { readonly enabled: boolean; readonly note?: string }

const states = ref<ReadonlyMap<string, SiteSectionState>>(new Map())
let pending: Promise<void> | null = null

function parse(raw: unknown): Map<string, SiteSectionState> {
  const next = new Map<string, SiteSectionState>()
  const list = raw && typeof raw === 'object' ? (raw as { sections?: unknown }).sections : undefined
  if (!Array.isArray(list)) return next
  for (const item of list) {
    if (!item || typeof item !== 'object') continue
    const row = item as Record<string, unknown>
    if (typeof row.id !== 'string') continue
    next.set(row.id, {
      enabled: row.enabled !== false,
      note: typeof row.note === 'string' && row.note.trim() ? row.note.trim() : undefined,
    })
  }
  return next
}

/** Una sola consulta; sin respuesta todo queda abierto. */
export function loadSiteSections(force = false): Promise<void> {
  if (pending && !force) return pending
  pending = fetch(API.SECTIONS)
    .then((response) => (response.ok ? response.json() : null))
    .then((body) => {
      states.value = parse(body)
    })
    .catch(() => undefined)
  return pending
}

export function sectionState(id: SiteSectionId | string | undefined): SiteSectionState {
  if (!id) return { enabled: true }
  return states.value.get(id) ?? { enabled: true }
}

export async function saveSiteSection(
  id: SiteSectionId,
  draft: SiteSectionState,
  session: string,
): Promise<{ ok: true } | { ok: false; detail?: string }> {
  try {
    const response = await fetch(`${API.OPERAR_SECTIONS}/${encodeURIComponent(id)}`, {
      method: 'POST',
      headers: { ...JSON_HEADERS, [OPERADOR_CLAVE_HEADER]: session },
      body: JSON.stringify({ enabled: draft.enabled, note: draft.note ?? '' }),
    })
    const body = (await response.json().catch(() => ({}))) as { detail?: string }
    if (!response.ok) return { ok: false, detail: body.detail }
    const next = new Map(states.value)
    next.set(id, draft)
    states.value = next
    return { ok: true }
  } catch {
    return { ok: false }
  }
}
