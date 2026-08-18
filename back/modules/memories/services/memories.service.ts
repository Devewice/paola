import { randomUUID } from 'node:crypto'
import { HTTP_STATUS } from '../../../http/constants.js'
import { fail } from '../../../http/fail.js'
import type { Fail } from '../../../http/types.js'
import { MEMORY_MESSAGES, MEMORY_STATUS_DONE } from '../constants/memories.constants.js'
import type { Memory, MemoryList } from '../interfaces/memories.interface.js'
import {
  findMemories,
  findMemoryById,
  findMemoryByOuting,
  findOutingRow,
  insertMemory,
} from '../providers/memories.provider.js'
import { parseCreateMemory } from '../schemas/memories.schema.js'

export async function listMemories(): Promise<MemoryList> {
  return findMemories()
}

export async function createMemory(
  draft: Record<string, unknown>,
): Promise<Fail | { ok: true; memory: Memory }> {
  const parsed = parseCreateMemory(draft)
  if (!parsed.ok) return parsed

  const outing = await findOutingRow(parsed.value.outingId)
  if (!outing) {
    return fail(HTTP_STATUS.NOT_FOUND, MEMORY_MESSAGES.OUTING_NOT_FOUND)
  }
  if (String(outing.status) !== MEMORY_STATUS_DONE) {
    return fail(HTTP_STATUS.CONFLICT, MEMORY_MESSAGES.NOT_DONE)
  }

  const existing = await findMemoryByOuting(parsed.value.outingId)
  if (existing) {
    return fail(HTTP_STATUS.CONFLICT, MEMORY_MESSAGES.ALREADY_EXISTS)
  }

  const id = randomUUID()
  await insertMemory(id, parsed.value)
  const memory = await findMemoryById(id)
  if (!memory) {
    return fail(HTTP_STATUS.INTERNAL, MEMORY_MESSAGES.READ_FAIL)
  }
  return { ok: true, memory }
}
