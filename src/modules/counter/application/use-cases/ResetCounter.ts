import { err, ok, type Result } from '@core/result.ts'
import { appError, type AppError } from '@core/errors/AppError.ts'
import {
  counterId,
  createCounter,
  resetCounter as reset,
  type Counter,
} from '../../domain/entities/Counter.ts'
import type { CounterRepository } from '../../domain/ports/CounterRepository.ts'

export type ResetCounter = (id?: string) => Promise<Result<Counter, AppError>>

export const makeResetCounter = (
  repository: CounterRepository,
): ResetCounter => {
  return async (id = 'default') => {
    try {
      const current =
        (await repository.findById(counterId(id))) ??
        createCounter(counterId(id), 0)
      const next = reset(current)
      await repository.save(next)
      return ok(next)
    } catch (cause) {
      return err(
        appError('INFRASTRUCTURE', 'No se pudo reiniciar el contador', cause),
      )
    }
  }
}
