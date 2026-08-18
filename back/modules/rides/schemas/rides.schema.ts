import { HTTP_STATUS } from '../../../http/constants.js'
import { fail } from '../../../http/fail.js'
import type { Parsed } from '../../../http/types.js'
import { formatDate, isIsoDate } from '../../../shared/dates.js'
import {
  RIDES_DEFAULT_KIND,
  RIDES_DEFAULT_STATUS,
  RIDES_KIND_SET,
  RIDES_LIMITS,
  RIDES_MESSAGES,
  RIDES_OPERATOR_STATUSES,
  RIDES_STATUS_FULL,
  RIDES_STATUS_OPEN,
  RIDES_STATUS_SET,
  WHATSAPP_NON_DIGIT,
} from '../constants/rides.constants.js'
import type { ClaimSpotDto, CreateOutingDto, SetOutingStatusDto } from '../dtos/rides.dto.js'
import type {
  Outing,
  OutingKind,
  OutingStatus,
  Ticket,
} from '../interfaces/rides.interface.js'

export function parseClaimSpot(draft: Record<string, unknown>): Parsed<ClaimSpotDto> {
  const name = String(draft.name ?? '').trim()
  const whatsapp = String(draft.whatsapp ?? '').replace(WHATSAPP_NON_DIGIT, '')
  const moto = String(draft.moto ?? '').trim()

  if (name.length < RIDES_LIMITS.NAME_MIN) {
    return fail(HTTP_STATUS.BAD_REQUEST, RIDES_MESSAGES.NAME_REQUIRED)
  }
  if (whatsapp.length < RIDES_LIMITS.WHATSAPP_MIN || whatsapp.length > RIDES_LIMITS.WHATSAPP_MAX) {
    return fail(HTTP_STATUS.BAD_REQUEST, RIDES_MESSAGES.WHATSAPP_REQUIRED)
  }
  return { ok: true, value: { name, whatsapp, moto } }
}

export function parseCreateOuting(draft: Record<string, unknown>): Parsed<CreateOutingDto> {
  const title = String(draft.title ?? '').trim()
  const date = String(draft.date ?? '').trim()
  const kind = String(draft.kind ?? '').trim()
  const meetingPoint = String(draft.meetingPoint ?? '').trim()
  const routeText = String(draft.routeText ?? '').trim()
  const whatToBring = String(draft.whatToBring ?? '').trim()
  const capacity = Number(draft.capacity)
  const paid = draft.paid === true

  if (!isIsoDate(date)) {
    return fail(HTTP_STATUS.BAD_REQUEST, RIDES_MESSAGES.DATE_INVALID)
  }
  if (!Number.isInteger(capacity) || capacity < RIDES_LIMITS.CAPACITY_MIN) {
    return fail(HTTP_STATUS.BAD_REQUEST, RIDES_MESSAGES.CAPACITY_INVALID)
  }
  if (!title) {
    return fail(HTTP_STATUS.BAD_REQUEST, RIDES_MESSAGES.TITLE_REQUIRED)
  }
  if (!RIDES_KIND_SET.has(kind)) {
    return fail(HTTP_STATUS.BAD_REQUEST, RIDES_MESSAGES.KIND_INVALID)
  }
  if (!meetingPoint) {
    return fail(HTTP_STATUS.BAD_REQUEST, RIDES_MESSAGES.MEETING_REQUIRED)
  }

  return {
    ok: true,
    value: {
      title,
      date,
      kind: kind as OutingKind,
      meetingPoint,
      routeText,
      whatToBring,
      capacity,
      paid,
    },
  }
}

export function parseSetOutingStatus(status: unknown): Parsed<SetOutingStatusDto> {
  if (status !== RIDES_OPERATOR_STATUSES[0] && status !== RIDES_OPERATOR_STATUSES[1]) {
    return fail(HTTP_STATUS.BAD_REQUEST, RIDES_MESSAGES.STATUS_INVALID)
  }
  return { ok: true, value: { status } }
}

export function toOuting(row: Record<string, unknown>): Outing {
  const capacity = Number(row.capacity)
  const taken = Number(row.taken ?? 0)
  const rawStatus = String(row.status)
  let status: OutingStatus = RIDES_STATUS_SET.has(rawStatus)
    ? (rawStatus as OutingStatus)
    : RIDES_DEFAULT_STATUS
  if (status === RIDES_STATUS_OPEN && taken >= capacity) status = RIDES_STATUS_FULL
  const rawKind = String(row.kind)
  return {
    id: String(row.id),
    title: String(row.title),
    date: formatDate(row.date),
    kind: RIDES_KIND_SET.has(rawKind) ? (rawKind as OutingKind) : RIDES_DEFAULT_KIND,
    meetingPoint: String(row.meeting_point),
    routeText: String(row.route_text ?? ''),
    capacity,
    taken,
    whatToBring: String(row.what_to_bring ?? ''),
    paid: Boolean(row.paid),
    status,
  }
}

export function toTicket(row: Record<string, unknown>): Ticket {
  return {
    id: String(row.id),
    outingId: String(row.outing_id),
    name: String(row.name),
    whatsapp: String(row.whatsapp),
    moto: String(row.moto ?? ''),
  }
}
