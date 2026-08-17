import type { Counter, CounterId } from '../domain/entities/Counter.ts'
import type { CounterRepository } from '../domain/ports/CounterRepository.ts'

export const createInMemoryCounterRepository = (): CounterRepository => {
  const records = new Map<CounterId, Counter>()

  return {
    async findById(id) {
      return records.get(id) ?? null
    },
    async save(counter) {
      records.set(counter.id, counter)
    },
  }
}
