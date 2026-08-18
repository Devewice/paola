import type { TipDto } from '../dtos/voice.dto.js'
import { findTips } from '../providers/voice.provider.js'

export async function listTips(): Promise<TipDto[]> {
  return findTips()
}
