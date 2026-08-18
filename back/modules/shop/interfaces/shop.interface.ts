export type ProductKind = 'propia' | 'colaboracion'

export interface Product {
  id: string
  title: string
  description: string
  kind: ProductKind
  priceCop: number | null
  stock: number | null
  photoSrc?: string
}
