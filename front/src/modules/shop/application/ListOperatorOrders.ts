import type { AppError } from '@core/errors/AppError.ts'
import type { Result } from '@core/result.ts'
import type { ServiceOrderApiPort } from '@modules/shop/domain/ports/ServiceOrderApiPort.ts'
import type { ServiceOrder } from '@modules/shop/domain/entities/ServiceOrder.ts'

export class ListOperatorOrders {
  private readonly api: ServiceOrderApiPort

  constructor(api: ServiceOrderApiPort) {
    this.api = api
  }

  async execute(clave: string): Promise<Result<readonly ServiceOrder[], AppError>> {
    return await this.api.listOperatorOrders(clave)
  }
}

