import type { AppError } from '@core/errors/AppError.ts'
import type { Result } from '@core/result.ts'
import type { Product, ProductDraft } from '@modules/shop/domain/entities/Product.ts'
import type { ServiceDraft, ShopService } from '@modules/shop/domain/entities/ShopService.ts'

export interface ShopWritePort {
  publish(draft: ProductDraft, clave: string): Promise<Result<Product, AppError>>
  publishService(draft: ServiceDraft, clave: string): Promise<Result<ShopService, AppError>>
}
