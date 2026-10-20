import type { SECTION_IDS } from '../constants/sections.constants.js'

export type SectionId = (typeof SECTION_IDS)[number]

export interface SiteSection {
  id: SectionId
  enabled: boolean
  note?: string
}
