import { getDb } from '../../../db/knex.js'
import { VOICE_TABLES } from '../constants/voice.constants.js'
import type { Tip } from '../interfaces/voice.interface.js'
import { toTip } from '../schemas/voice.schema.js'

export async function findTips(): Promise<Tip[]> {
  const rows = await getDb()(VOICE_TABLES.TIPS)
    .select('id', 'title', 'body', 'official_href')
    .orderBy('created_at', 'desc')
  return rows.map((row) => toTip(row as Record<string, unknown>))
}
