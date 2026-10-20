import { getDb } from '../../../db/knex.js'
import { SECTIONS_TABLE } from '../constants/sections.constants.js'
import type { SiteSection } from '../interfaces/sections.interface.js'
import { toSection } from '../schemas/sections.schema.js'

export async function findSections(): Promise<SiteSection[]> {
  if (!(await getDb().schema.hasTable(SECTIONS_TABLE))) return []
  const rows = (await getDb()(SECTIONS_TABLE).select('id', 'enabled', 'note')) as Record<string, unknown>[]
  return rows.map(toSection).filter((item): item is SiteSection => item !== null)
}

export async function saveSection(section: SiteSection): Promise<void> {
  await getDb()(SECTIONS_TABLE)
    .insert({ id: section.id, enabled: section.enabled, note: section.note ?? null })
    .onConflict('id')
    .merge(['enabled', 'note'])
}
