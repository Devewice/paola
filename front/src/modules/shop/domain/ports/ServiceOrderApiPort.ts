import type { AppError } from '@core/errors/AppError.ts'
import type { Result } from '@core/result.ts'
import type { ServiceOrder, ServiceOrderDraft, ServiceOrderNotice } from '../entities/ServiceOrder.ts'

export interface ServiceOrderApiPort {
  create(draft: ServiceOrderDraft): Promise<Result<{ order: ServiceOrder; notice: ServiceOrderNotice }, AppError>>
  listOperatorOrders(clave: string): Promise<Result<readonly ServiceOrder[], AppError>>
}

