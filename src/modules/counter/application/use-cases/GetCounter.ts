import { err, ok, type Result } from '@core/result.ts'
import { appError, type AppError } from '@core/errors/AppError.ts'
import {
  counterId,
  createCounter,
  type Counter,
} from '../../domain/entities/Counter.ts'
import type { CounterRepository } from '../../domain/ports/CounterRepository.ts'

export type GetCounter = (id?: string) => Promise<Result<Counter, AppError>>

export const makeGetCounter = (repository: CounterRepository): GetCounter => {
  return async (id = 'default') => {
    try {
      const existing = await repository.findById(counterId(id))
      return ok(existing ?? createCounter(counterId(id), 0))
    } catch (cause) {
      return err(
        appError('INFRASTRUCTURE', 'No se pudo leer el contador', cause),
      )
    }
  }
}
