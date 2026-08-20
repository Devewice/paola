export type ProductKind = 'propia' | 'colaboracion'

export interface Product {
  id: string
  title: string
  description: string
  kind: ProductKind
  priceCop: number | null
  stock: number | null
  photoSrc?: string
  color?: string
  size?: string
  category?: string
  createdAt?: string
}

export interface ShopService {
  id: string
  title: string
  includesText: string
  handoverText: string
  turnaroundText: string
  priceCop: number | null
  createdAt?: string
}
