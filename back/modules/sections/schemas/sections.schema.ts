import { HTTP_STATUS } from '../../../http/constants.js'
import { fail } from '../../../http/fail.js'
import type { Parsed } from '../../../http/types.js'
import { optionalText } from '../../../shared/text.js'
import { SECTION_IDS, SECTIONS_LIMITS, SECTIONS_MESSAGES } from '../constants/sections.constants.js'
import type { SectionId, SiteSection } from '../interfaces/sections.interface.js'

export function sectionId(raw: string): SectionId | undefined {
  return SECTION_IDS.find((id) => id === raw)
}

export function parseSectionUpdate(id: string, body: Record<string, unknown>): Parsed<SiteSection> {
  const known = sectionId(id)
  if (!known) return fail(HTTP_STATUS.NOT_FOUND, SECTIONS_MESSAGES.UNKNOWN)
  const note = optionalText(body.note)
  if (note && note.length > SECTIONS_LIMITS.NOTE_MAX) {
    return fail(HTTP_STATUS.BAD_REQUEST, SECTIONS_MESSAGES.NOTE_TOO_LONG)
  }
  return { ok: true, value: { id: known, enabled: body.enabled !== false, note } }
}

export function toSection(row: Record<string, unknown>): SiteSection | null {
  const id = sectionId(String(row.id))
  if (!id) return null
  return { id, enabled: Boolean(row.enabled), note: optionalText(row.note) }
}
