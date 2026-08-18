import { getDb } from '../../../db/knex.js'
import { VOICE_TABLES } from '../constants/voice.constants.js'
import type { FineGuide, Report, Tip } from '../interfaces/voice.interface.js'
import { toFine, toReport, toTip } from '../schemas/voice.schema.js'

async function resolveVoiceTable(primary: string, legacy: string): Promise<string> {
  const hasPrimary = await getDb().schema.hasTable(primary)
  if (hasPrimary) return primary
  const hasLegacy = await getDb().schema.hasTable(legacy)
  return hasLegacy ? legacy : primary
}

export async function findTips(): Promise<Tip[]> {
  const rows = await getDb()(VOICE_TABLES.TIPS)
    .select('id', 'title', 'body', 'official_href')
    .orderBy('created_at', 'desc')
  return rows.map((row) => toTip(row as Record<string, unknown>))
}

export async function insertTip(tip: Tip): Promise<void> {
  await getDb()(VOICE_TABLES.TIPS).insert({
    id: tip.id,
    title: tip.title,
    body: tip.body,
    official_href: tip.officialHref ?? null,
  })
}

export async function findFines(): Promise<FineGuide[]> {
  const table = await resolveVoiceTable(VOICE_TABLES.FINES, VOICE_TABLES.LEGACY_COMPARENDOS)
  const rows = await getDb()(table)
    .select('id', 'title', 'guide', 'official_href', 'disclaimer')
    .orderBy('created_at', 'desc')
  return rows.map((row) => toFine(row as Record<string, unknown>))
}

export async function insertFine(item: FineGuide): Promise<void> {
  const table = await resolveVoiceTable(VOICE_TABLES.FINES, VOICE_TABLES.LEGACY_COMPARENDOS)
  await getDb()(table).insert({
    id: item.id,
    title: item.title,
    guide: item.guide,
    official_href: item.officialHref,
    disclaimer: item.disclaimer,
  })
}

export async function findPublicReports(): Promise<Report[]> {
  const table = await resolveVoiceTable(VOICE_TABLES.REPORTS, VOICE_TABLES.LEGACY_DENUNCIAS)
  const rows = await getDb()(table)
    .select('id', 'title', 'what_happened', 'where_text', 'happened_at', 'evidence_src', 'moderation_status', 'moderation_note')
    .whereIn('moderation_status', ['published', 'publicada'])
    .orderBy('created_at', 'desc')
  return rows.map((row) => toReport(row as Record<string, unknown>))
}

export async function insertReport(item: Report): Promise<void> {
  const table = await resolveVoiceTable(VOICE_TABLES.REPORTS, VOICE_TABLES.LEGACY_DENUNCIAS)
  await getDb()(table).insert({
    id: item.id,
    title: item.title,
    what_happened: item.whatHappened,
    where_text: item.whereText,
    happened_at: item.happenedAt,
    evidence_src: item.evidenceSrc ?? null,
    moderation_status: item.moderationStatus,
    moderation_note: item.moderationNote ?? null,
  })
}

export async function setReportStatus(id: string, status: Report['moderationStatus'], note?: string): Promise<number> {
  const table = await resolveVoiceTable(VOICE_TABLES.REPORTS, VOICE_TABLES.LEGACY_DENUNCIAS)
  return getDb()(table)
    .where({ id })
    .update({
      moderation_status: status,
      moderation_note: note ?? null,
    })
}
