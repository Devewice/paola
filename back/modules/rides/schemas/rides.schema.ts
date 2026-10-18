import { HTTP_STATUS } from '../../../http/constants.js'
import { fail } from '../../../http/fail.js'
import type { Parsed } from '../../../http/types.js'
import { formatDate, isIsoDate } from '../../../shared/dates.js'
import {
  RIDES_DEFAULT_KIND,
  RIDES_DEFAULT_STATUS,
  RIDES_CONFIRM_PENDING,
  RIDES_KIND_SET,
  RIDES_LEVEL_SET,
  RIDES_LIMITS,
  RIDES_MESSAGES,
  RIDES_MOTO_LABEL_MAX,
  RIDES_OPERATOR_STATUSES,
  RIDES_STATUS_DONE,
  RIDES_STATUS_FULL,
  RIDES_STATUS_OPEN,
  RIDES_STATUS_SET,
  RIDES_TIMEZONE,
  WHATSAPP_NON_DIGIT,
  type RideLevel,
} from '../constants/rides.constants.js'
import type { ClaimSpotDto, CreateOutingDto, SetOutingStatusDto } from '../dtos/rides.dto.js'
import type {
  Outing,
  OutingKind,
  OperatorTicket,
  OutingStatus,
  Ticket,
} from '../interfaces/rides.interface.js'

function clean(value: unknown): string {
  return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : ''
}

/** La cuenta pone alias, WhatsApp, moto y emergencia; el cuerpo trae lo propio de esta salida. */
export function parseClaimSpot(
  draft: Record<string, unknown>,
  user: { alias: string; whatsapp?: string; moto?: string; hasEmergency: boolean },
): Parsed<ClaimSpotDto> {
  const noMoto = draft.noMoto === true
  const moto = noMoto ? '' : clean(draft.moto).slice(0, RIDES_MOTO_LABEL_MAX) || user.moto || ''
  const level = clean(draft.level)
  const passengerName = draft.passenger === true ? clean(draft.passengerName) : ''

  if (user.alias.length < RIDES_LIMITS.NAME_MIN) {
    return fail(HTTP_STATUS.BAD_REQUEST, RIDES_MESSAGES.NAME_REQUIRED)
  }
  if (!RIDES_LEVEL_SET.has(level)) {
    return fail(HTTP_STATUS.BAD_REQUEST, RIDES_MESSAGES.LEVEL_REQUIRED)
  }
  if (
    draft.passenger === true &&
    (passengerName.length < RIDES_LIMITS.PASSENGER_MIN || passengerName.length > RIDES_LIMITS.PASSENGER_MAX)
  ) {
    return fail(HTTP_STATUS.BAD_REQUEST, RIDES_MESSAGES.PASSENGER_REQUIRED)
  }
  if (draft.docsOk !== true) {
    return fail(HTTP_STATUS.BAD_REQUEST, RIDES_MESSAGES.DOCS_REQUIRED)
  }
  if (draft.rulesOk !== true) {
    return fail(HTTP_STATUS.BAD_REQUEST, RIDES_MESSAGES.RULES_REQUIRED)
  }

  let emergency: ClaimSpotDto['emergency']
  if (!user.hasEmergency) {
    const name = clean(draft.emergencyName)
    const phone = clean(draft.emergencyPhone).replace(WHATSAPP_NON_DIGIT, '')
    if (
      name.length < RIDES_LIMITS.EMERGENCY_NAME_MIN ||
      name.length > RIDES_LIMITS.EMERGENCY_NAME_MAX ||
      phone.length < RIDES_LIMITS.EMERGENCY_PHONE_MIN ||
      phone.length > RIDES_LIMITS.EMERGENCY_PHONE_MAX
    ) {
      return fail(HTTP_STATUS.BAD_REQUEST, RIDES_MESSAGES.EMERGENCY_REQUIRED)
    }
    emergency = { name, phone }
  }

  return {
    ok: true,
    value: {
      name: user.alias,
      whatsapp: user.whatsapp ?? '',
      moto,
      passengerName: passengerName || undefined,
      level: level as RideLevel,
      emergency,
    },
  }
}

/** Hoy en Bogotá como `YYYY-MM-DD`: el servidor puede estar en otra zona. */
export function todayIso(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: RIDES_TIMEZONE }).format(new Date())
}

/** "¿Sigues firme?" se responde desde `CONFIRM_WINDOW_DAYS` antes hasta el día de la salida. */
export function isConfirmOpen(date: string, status: OutingStatus, today = todayIso()): boolean {
  if (status === RIDES_STATUS_DONE || date < today) return false
  const opens = new Date(`${date}T00:00:00Z`)
  opens.setUTCDate(opens.getUTCDate() - RIDES_LIMITS.CONFIRM_WINDOW_DAYS)
  return today >= opens.toISOString().slice(0, 10)
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
  const allowed = RIDES_OPERATOR_STATUSES.find((item) => item === status)
  if (!allowed) {
    return fail(HTTP_STATUS.BAD_REQUEST, RIDES_MESSAGES.STATUS_INVALID)
  }
  return { ok: true, value: { status: allowed } }
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
    mapHref: row.map_href ? String(row.map_href) : undefined,
  }
}

export function toTicket(row: Record<string, unknown>): Ticket {
  return {
    id: String(row.id),
    outingId: String(row.outing_id),
    name: String(row.name),
    whatsapp: String(row.whatsapp),
    moto: String(row.moto ?? ''),
    userId: row.user_id ? String(row.user_id) : undefined,
    passengerName: row.passenger_name ? String(row.passenger_name) : undefined,
    level: String(row.level ?? ''),
    docsOk: Boolean(row.docs_ok),
    rulesOk: Boolean(row.rules_ok),
    confirmation: row.confirmation ? String(row.confirmation) : RIDES_CONFIRM_PENDING,
  }
}

export function toOperatorTicket(row: Record<string, unknown>): OperatorTicket {
  const optional = (value: unknown) => (value ? String(value) : undefined)
  return {
    ...toTicket(row),
    emergencyName: optional(row.emergency_name),
    emergencyPhone: optional(row.emergency_phone),
    bloodType: optional(row.blood_type),
    medicalNotes: optional(row.medical_notes),
  }
}
