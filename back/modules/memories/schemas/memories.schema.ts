import { HTTP_STATUS } from '../../../http/constants.js'
import { fail } from '../../../http/fail.js'
import type { Parsed } from '../../../http/types.js'
import { formatDate } from '../../../shared/dates.js'
import { optionalText } from '../../../shared/text.js'
import { MEMORY_LIMITS, MEMORY_MESSAGES } from '../constants/memories.constants.js'
import type { CreateMemoryDto, MemoryPhotoDraftDto } from '../dtos/memories.dto.js'
import type { Memory, MemoryPhoto } from '../interfaces/memories.interface.js'

function parsePhotos(raw: unknown): MemoryPhotoDraftDto[] {
  if (!Array.isArray(raw)) return []
  const photos: MemoryPhotoDraftDto[] = []
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue
    const row = item as Record<string, unknown>
    const src = String(row.src ?? '').trim()
    const alt = String(row.alt ?? '').trim()
    if (src.length < MEMORY_LIMITS.PHOTO_SRC_MIN || alt.length < MEMORY_LIMITS.PHOTO_ALT_MIN) {
      continue
    }
    photos.push({ src, alt })
  }
  return photos
}

export function parseCreateMemory(draft: Record<string, unknown>): Parsed<CreateMemoryDto> {
  const outingId = String(draft.outingId ?? '').trim()
  const km = Number(draft.km)
  const closingText = String(draft.closingText ?? '').trim()
  const credit = String(draft.credit ?? '').trim()
  const participantsText = String(draft.participantsText ?? '').trim()
  const instagramHref = optionalText(draft.instagramHref)
  const photos = parsePhotos(draft.photos)

  if (!outingId) {
    return fail(HTTP_STATUS.BAD_REQUEST, MEMORY_MESSAGES.OUTING_REQUIRED)
  }
  if (!Number.isInteger(km) || km < MEMORY_LIMITS.KM_MIN) {
    return fail(HTTP_STATUS.BAD_REQUEST, MEMORY_MESSAGES.KM_REQUIRED)
  }
  if (closingText.length < MEMORY_LIMITS.TEXT_MIN) {
    return fail(HTTP_STATUS.BAD_REQUEST, MEMORY_MESSAGES.CLOSING_REQUIRED)
  }
  if (credit.length < MEMORY_LIMITS.TEXT_MIN) {
    return fail(HTTP_STATUS.BAD_REQUEST, MEMORY_MESSAGES.CREDIT_REQUIRED)
  }
  if (participantsText.length < MEMORY_LIMITS.TEXT_MIN) {
    return fail(HTTP_STATUS.BAD_REQUEST, MEMORY_MESSAGES.PARTICIPANTS_REQUIRED)
  }
  if (photos.length === 0) {
    return fail(HTTP_STATUS.BAD_REQUEST, MEMORY_MESSAGES.PHOTO_REQUIRED)
  }

  return {
    ok: true,
    value: {
      outingId,
      km,
      closingText,
      credit,
      participantsText,
      instagramHref,
      photos,
    },
  }
}

export function toPhoto(row: Record<string, unknown>): MemoryPhoto {
  return {
    id: String(row.id),
    src: String(row.src),
    alt: String(row.alt),
  }
}

export function toMemory(row: Record<string, unknown>, photos: MemoryPhoto[]): Memory {
  return {
    id: String(row.id),
    outingId: String(row.outing_id),
    title: String(row.title),
    date: formatDate(row.date),
    km: Number(row.km),
    closingText: String(row.closing_text),
    credit: String(row.credit),
    participantsText: String(row.participants_text),
    instagramHref: optionalText(row.instagram_href),
    photos,
  }
}
