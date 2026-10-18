import { randomUUID } from 'node:crypto'
import type { TipDto } from '../dtos/voice.dto.js'
import type { FineGuide, Report } from '../interfaces/voice.interface.js'
import { HTTP_STATUS } from '../../../http/constants.js'
import { fail } from '../../../http/fail.js'
import { VOICE_MESSAGES } from '../constants/voice.constants.js'
import {
  deleteFine,
  deleteTip,
  findAllReports,
  findFines,
  findPublicReports,
  findTips,
  insertFine,
  insertReport,
  insertTip,
  setReportStatus,
  updateFine,
  updateTip,
} from '../providers/voice.provider.js'
import { parseFineDraft, parseReportDraft, parseTipDraft } from '../schemas/voice.schema.js'

export async function listTips(): Promise<TipDto[]> {
  return findTips()
}

export async function createTip(draft: Record<string, unknown>) {
  const parsed = parseTipDraft(draft)
  if (!parsed.ok) return parsed
  const tip = { id: randomUUID(), ...parsed.value }
  await insertTip(tip)
  return { ok: true as const, tip }
}

type Done = { ok: true } | { ok: false; status: number; detail: string }

export async function editTip(id: string, draft: Record<string, unknown>) {
  const parsed = parseTipDraft(draft)
  if (!parsed.ok) return parsed
  const tip = { id, ...parsed.value }
  if (!(await updateTip(tip))) return fail(HTTP_STATUS.NOT_FOUND, VOICE_MESSAGES.TIP_NOT_FOUND)
  return { ok: true as const, tip }
}

export async function removeTip(id: string): Promise<Done> {
  if (!(await deleteTip(id))) return fail(HTTP_STATUS.NOT_FOUND, VOICE_MESSAGES.TIP_NOT_FOUND)
  return { ok: true }
}

export async function editFine(id: string, draft: Record<string, unknown>) {
  const parsed = parseFineDraft(draft)
  if (!parsed.ok) return parsed
  const fine = { id, ...parsed.value }
  if (!(await updateFine(fine))) return fail(HTTP_STATUS.NOT_FOUND, VOICE_MESSAGES.FINE_NOT_FOUND)
  return { ok: true as const, fine }
}

export async function removeFine(id: string): Promise<Done> {
  if (!(await deleteFine(id))) return fail(HTTP_STATUS.NOT_FOUND, VOICE_MESSAGES.FINE_NOT_FOUND)
  return { ok: true }
}

export async function listFines(): Promise<FineGuide[]> {
  return findFines()
}

export async function createFine(draft: Record<string, unknown>) {
  const parsed = parseFineDraft(draft)
  if (!parsed.ok) return parsed
  const fine = { id: randomUUID(), ...parsed.value }
  await insertFine(fine)
  return { ok: true as const, fine }
}

export async function listReports(): Promise<Report[]> {
  return findPublicReports()
}

export async function listOperatorReports(): Promise<Report[]> {
  return findAllReports()
}

export async function createReport(draft: Record<string, unknown>) {
  const parsed = parseReportDraft(draft)
  if (!parsed.ok) return parsed
  const report: Report = {
    id: randomUUID(),
    ...parsed.value,
    moderationStatus: 'in_review',
  }
  await insertReport(report)
  return { ok: true as const, report }
}

export async function moderateReport(
  id: string,
  status: Report['moderationStatus'],
  note?: string,
): Promise<{ ok: true } | { ok: false; status: number; detail: string }> {
  if (!['published', 'hidden', 'rejected'].includes(status)) {
    return { ok: false, status: 400, detail: 'Estado de moderación no válido.' }
  }
  const affected = await setReportStatus(id, status, note)
  if (!affected) return { ok: false, status: 404, detail: 'Reporte no encontrado.' }
  return { ok: true }
}
