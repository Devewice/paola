import type { Brand } from '@core/types/brand.ts'

export type CounterId = Brand<string, 'CounterId'>

export const counterId = (value: string): CounterId => value as CounterId

export type Counter = {
  readonly id: CounterId
  readonly value: number
}

export const createCounter = (id: CounterId, value = 0): Counter => ({
  id,
  value,
})

export const incrementCounter = (counter: Counter, by = 1): Counter => ({
  ...counter,
  value: counter.value + by,
})

export const resetCounter = (counter: Counter): Counter => ({
  ...counter,
  value: 0,
})
