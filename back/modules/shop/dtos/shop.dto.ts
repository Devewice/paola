import type { ProductKind } from '../interfaces/shop.interface.js'

export interface CreateProductDto {
  title: string
  description: string
  kind: ProductKind
  priceCop: number | null
  stock: number | null
  photoSrc?: string
  color?: string
  size?: string
  category?: string
}

export interface CreateServiceDto {
  title: string
  includesText: string
  handoverText: string
  turnaroundText: string
  priceCop: number | null
}
