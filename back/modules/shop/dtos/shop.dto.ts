import type { ProductKind } from '../interfaces/shop.interface.js'

export interface CreateProductDto {
  title: string
  description: string
  kind: ProductKind
  priceCop: number | null
  stock: number | null
  photoSrc?: string
}
