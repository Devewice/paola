export const SHOP_EMPTY_OWN =
  'Aún no hay piezas propias en estantería. Cuando Paola publique algo de verdad, se ve aquí.'

export const SHOP_EMPTY_COLLAB =
  'No hay colaboraciones publicadas. Si entra una, vive en esta estantería, nunca mezclada con lo propio.'

export const SHOP_EMPTY_FICHA = 'Esa ficha no está. El catálogo no inventa piezas.'

export const SHOP_DELIVERY_COPY =
  'Entrega gratis solo en Bogotá y Soacha. Fuera: aún no. No improvisamos flete.'

export const SHOP_WARRANTY_COPY =
  'Garantía solo por defectos de fabricación. No cubre desgaste de rodada, golpe ni “no me gustó”.'

export type ProductKind = 'propia' | 'colaboracion'

export type Product = {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly kind: ProductKind
  readonly priceCop: number | null
  readonly stock: number | null
  readonly photoSrc?: string
}

export type ProductDraft = {
  readonly title: string
  readonly description: string
  readonly kind: ProductKind
  readonly priceCop?: number | null
  readonly stock?: number | null
  readonly photoSrc?: string
}

export type ShopShelves = {
  readonly own: readonly Product[]
  readonly collab: readonly Product[]
  readonly emptyOwnCopy: string
  readonly emptyCollabCopy: string
  readonly deliveryCopy: string
  readonly warrantyCopy: string
}
