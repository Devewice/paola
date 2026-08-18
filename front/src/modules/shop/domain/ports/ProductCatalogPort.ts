import type { Product } from '@modules/shop/domain/entities/Product.ts'

export interface ProductCatalogPort {
  list(): readonly Product[]
  get(id: string): Product | undefined
}
