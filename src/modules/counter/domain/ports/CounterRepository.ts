import type { Counter, CounterId } from '../entities/Counter.ts'

export type CounterRepository = {
  findById(id: CounterId): Promise<Counter | null>
  save(counter: Counter): Promise<void>
}
