import type { GetCounter } from './application/use-cases/GetCounter.ts'
import { makeGetCounter } from './application/use-cases/GetCounter.ts'
import type { IncrementCounter } from './application/use-cases/IncrementCounter.ts'
import { makeIncrementCounter } from './application/use-cases/IncrementCounter.ts'
import type { ResetCounter } from './application/use-cases/ResetCounter.ts'
import { makeResetCounter } from './application/use-cases/ResetCounter.ts'
import type { CounterRepository } from './domain/ports/CounterRepository.ts'

export type CounterModule = {
  getCounter: GetCounter
  incrementCounter: IncrementCounter
  resetCounter: ResetCounter
}

export const createCounterModule = (
  repository: CounterRepository,
): CounterModule => ({
  getCounter: makeGetCounter(repository),
  incrementCounter: makeIncrementCounter(repository),
  resetCounter: makeResetCounter(repository),
})
