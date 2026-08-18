import type { AppError } from '@core/errors/AppError.ts'
import type { Result } from '@core/result.ts'
import type { Product, ProductDraft } from '@modules/shop/domain/entities/Product.ts'

export interface ShopWritePort {
  publish(draft: ProductDraft, clave: string): Promise<Result<Product, AppError>>
}
