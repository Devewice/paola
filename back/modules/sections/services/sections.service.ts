import type { Fail } from '../../../http/types.js'
import { SECTION_IDS } from '../constants/sections.constants.js'
import type { SiteSection } from '../interfaces/sections.interface.js'
import { findSections, saveSection } from '../providers/sections.provider.js'
import { parseSectionUpdate } from '../schemas/sections.schema.js'

/** Todas las secciones conocidas; las que no tienen fila están abiertas. */
export async function listSections(): Promise<SiteSection[]> {
  const saved = new Map((await findSections()).map((section) => [section.id, section]))
  return SECTION_IDS.map((id) => saved.get(id) ?? { id, enabled: true })
}

export async function updateSection(
  id: string,
  body: Record<string, unknown>,
): Promise<Fail | { ok: true; section: SiteSection }> {
  const parsed = parseSectionUpdate(id, body)
  if (!parsed.ok) return parsed
  await saveSection(parsed.value)
  return { ok: true, section: parsed.value }
}
