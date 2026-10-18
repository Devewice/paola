import { fail } from '../../../http/fail.js'
import { HTTP_STATUS } from '../../../http/constants.js'
import type { Parsed } from '../../../http/types.js'
import { ACCOUNT_LIMITS, ACCOUNT_MESSAGES, BLOOD_TYPES, WHATSAPP_NON_DIGIT } from '../constants/account.constants.js'
import type { MotorcycleDraftDto, ProfilePatchDto, SafetyPatchDto } from '../dtos/account.dto.js'
import type { UserMotorcycle } from '../interfaces/account.interface.js'

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : ''
}

export function parseProfilePatch(draft: Record<string, unknown>): Parsed<ProfilePatchDto> {
  const alias = text(draft.alias)
  if (alias.length < ACCOUNT_LIMITS.ALIAS_MIN || alias.length > ACCOUNT_LIMITS.ALIAS_MAX) {
    return fail(HTTP_STATUS.BAD_REQUEST, ACCOUNT_MESSAGES.ALIAS_INVALID)
  }
  const fullName = text(draft.fullName)
  if (fullName.length > ACCOUNT_LIMITS.FULL_NAME_MAX) {
    return fail(HTTP_STATUS.BAD_REQUEST, ACCOUNT_MESSAGES.FULL_NAME_INVALID)
  }
  const whatsapp = text(draft.whatsapp).replace(WHATSAPP_NON_DIGIT, '')
  if (whatsapp && (whatsapp.length < ACCOUNT_LIMITS.WHATSAPP_MIN || whatsapp.length > ACCOUNT_LIMITS.WHATSAPP_MAX)) {
    return fail(HTTP_STATUS.BAD_REQUEST, ACCOUNT_MESSAGES.WHATSAPP_INVALID)
  }
  return {
    ok: true,
    value: {
      alias,
      fullName: fullName || null,
      whatsapp: whatsapp || null,
    },
  }
}

/** Nombre y teléfono van juntos: o ambos o ninguno. */
export function parseSafetyPatch(draft: Record<string, unknown>): Parsed<SafetyPatchDto> {
  const emergencyName = text(draft.emergencyName)
  const emergencyPhone = text(draft.emergencyPhone).replace(WHATSAPP_NON_DIGIT, '')
  const bloodType = text(draft.bloodType).toUpperCase()
  const medicalNotes = text(draft.medicalNotes)
  if (emergencyName || emergencyPhone) {
    if (emergencyName.length < ACCOUNT_LIMITS.EMERGENCY_NAME_MIN || emergencyName.length > ACCOUNT_LIMITS.EMERGENCY_NAME_MAX) {
      return fail(HTTP_STATUS.BAD_REQUEST, ACCOUNT_MESSAGES.EMERGENCY_NAME_INVALID)
    }
    if (
      emergencyPhone.length < ACCOUNT_LIMITS.EMERGENCY_PHONE_MIN ||
      emergencyPhone.length > ACCOUNT_LIMITS.EMERGENCY_PHONE_MAX
    ) {
      return fail(HTTP_STATUS.BAD_REQUEST, ACCOUNT_MESSAGES.EMERGENCY_PHONE_INVALID)
    }
  }
  if (bloodType && !(BLOOD_TYPES as readonly string[]).includes(bloodType)) {
    return fail(HTTP_STATUS.BAD_REQUEST, ACCOUNT_MESSAGES.BLOOD_TYPE_INVALID)
  }
  if (medicalNotes.length > ACCOUNT_LIMITS.MEDICAL_NOTES_MAX) {
    return fail(HTTP_STATUS.BAD_REQUEST, ACCOUNT_MESSAGES.MEDICAL_NOTES_INVALID)
  }
  return {
    ok: true,
    value: {
      emergencyName: emergencyName || null,
      emergencyPhone: emergencyPhone || null,
      bloodType: bloodType || null,
      medicalNotes: medicalNotes || null,
    },
  }
}

export function parseMotorcycleDraft(draft: Record<string, unknown>): Parsed<MotorcycleDraftDto> {
  const catalogId = text(draft.catalogId)
  if (catalogId) return { ok: true, value: { kind: 'catalog', catalogId } }

  const brand = text(draft.brand)
  if (!brand || brand.length > ACCOUNT_LIMITS.BRAND_MAX) return fail(HTTP_STATUS.BAD_REQUEST, ACCOUNT_MESSAGES.BRAND_REQUIRED)
  const model = text(draft.model)
  if (!model || model.length > ACCOUNT_LIMITS.MODEL_MAX) return fail(HTTP_STATUS.BAD_REQUEST, ACCOUNT_MESSAGES.MODEL_REQUIRED)
  const cc = Number(draft.cc)
  if (!Number.isInteger(cc) || cc < ACCOUNT_LIMITS.CC_MIN || cc > ACCOUNT_LIMITS.CC_MAX) {
    return fail(HTTP_STATUS.BAD_REQUEST, ACCOUNT_MESSAGES.CC_INVALID)
  }
  return { ok: true, value: { kind: 'custom', brand, model, cc } }
}

/** Texto corto que usan los cupos de rodada (`users.moto`). */
export function motoLabel(moto: UserMotorcycle | undefined): string | null {
  if (!moto) return null
  const showCc = moto.cc && !moto.model.includes(String(moto.cc))
  const label = [moto.brand, moto.model, showCc ? `${moto.cc}cc` : ''].filter(Boolean).join(' ')
  return label.slice(0, ACCOUNT_LIMITS.MOTO_LABEL_MAX)
}
