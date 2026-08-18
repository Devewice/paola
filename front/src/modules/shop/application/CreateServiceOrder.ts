import type { AppError } from '@core/errors/AppError.ts'
import type { Result } from '@core/result.ts'
import type { ServiceOrderApiPort } from '@modules/shop/domain/ports/ServiceOrderApiPort.ts'
import type { ServiceOrder, ServiceOrderNotice } from '@modules/shop/domain/entities/ServiceOrder.ts'
import { parseServiceOrderDraft } from '@modules/shop/application/parseServiceOrderDraft.ts'

export class CreateServiceOrder {
  private readonly api: ServiceOrderApiPort

  constructor(api: ServiceOrderApiPort) {
    this.api = api
  }

  async execute(
    draft: Record<string, unknown>,
  ): Promise<Result<{ order: ServiceOrder; notice: ServiceOrderNotice }, AppError>> {
    const parsed = parseServiceOrderDraft(draft as Record<string, unknown>)
    if (!parsed.ok) return parsed

    return await this.api.create(parsed.value)
  }
}

