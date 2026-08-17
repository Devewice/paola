import type { StoragePort } from '@shared/storage/StoragePort.ts'
import type { Counter } from '../domain/entities/Counter.ts'
import type { CounterRepository } from '../domain/ports/CounterRepository.ts'

const isCounter = (value: unknown): value is Counter => {
  if (typeof value !== 'object' || value === null) return false
  const record = value as Record<string, unknown>
  return typeof record.id === 'string' && typeof record.value === 'number'
}

export const createStorageCounterRepository = (
  storage: StoragePort,
  prefix = 'paola.counter',
): CounterRepository => ({
  async findById(id) {
    const raw = await storage.get(`${prefix}.${id}`)
    if (!raw) return null

    const parsed: unknown = JSON.parse(raw)
    return isCounter(parsed) ? parsed : null
  },
  async save(counter) {
    await storage.set(`${prefix}.${counter.id}`, JSON.stringify(counter))
  },
})
