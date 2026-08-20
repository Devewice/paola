export type ProductKind = 'propia' | 'colaboracion'

export type Product = {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly kind: ProductKind
  readonly priceCop: number | null
  readonly stock: number | null
  readonly photoSrc?: string
  readonly color?: string
  readonly size?: string
  readonly category?: string
  readonly createdAt?: string
}

export type ProductDraft = {
  readonly title: string
  readonly description: string
  readonly kind: ProductKind
  readonly priceCop?: number | null
  readonly stock?: number | null
  readonly photoSrc?: string
  readonly category?: string
}

export type ShopShelves = {
  readonly own: readonly Product[]
  readonly collab: readonly Product[]
  readonly emptyOwnCopy: string
  readonly emptyCollabCopy: string
  readonly deliveryCopy: string
  readonly warrantyCopy: string
}
