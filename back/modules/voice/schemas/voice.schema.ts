import { optionalText } from '../../../shared/text.js'
import type { Tip } from '../interfaces/voice.interface.js'

export function toTip(row: Record<string, unknown>): Tip {
  return {
    id: String(row.id),
    title: String(row.title),
    body: String(row.body),
    officialHref: optionalText(row.official_href),
  }
}
