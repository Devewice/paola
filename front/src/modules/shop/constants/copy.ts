export const SHOP_EMPTY_OWN =
  'Aún no hay piezas propias en estantería. Cuando Paola publique algo de verdad, se ve aquí.'

export const SHOP_EMPTY_COLLAB =
  'No hay colaboraciones publicadas. Si entra una, vive en esta estantería, nunca mezclada con lo propio.'

export const SHOP_EMPTY_FICHA = 'Esa ficha no está. El catálogo no inventa piezas.'

export const SHOP_DELIVERY_COPY =
  'Entrega gratis solo en Bogotá y Soacha. Fuera: aún no. No improvisamos flete.'

export const SHOP_WARRANTY_COPY =
  'Garantía solo por defectos de fabricación. No cubre desgaste de rodada, golpe ni “no me gustó”.'

export const SHOP_KIND = {
  OWN: 'propia',
  COLLAB: 'colaboracion',
} as const

export const SHOP_LIMITS = {
  TITLE_MIN: 2,
  DESCRIPTION_MIN: 2,
  COUNT_MIN: 0,
} as const

export const SHOP_ASK_PRICE = 'Preguntar'
export const SHOP_PRICE_LOCALE = 'es-CO'

export const SHOP_COPY = {
  kicker: 'Oficio',
  title: 'Tienda',
  plate: 'Tienda',
  lead: 'Piezas propias y colaboraciones en estanterías distintas. Sin checkout: se le escribe a Paola.',
  writeCta: 'Escribirle a Paola',
  mailCta: 'Correo',
  backCta: 'Volver a Tienda',
  rulesHeading: 'Reglas',
  rulesAria: 'Reglas',
  ownHeading: 'Marca propia',
  ownAria: 'Marca propia',
  ownEmptyTitle: 'Sin piezas propias',
  collabHeading: 'Colaboraciones',
  collabAria: 'Colaboraciones',
  collabNote: 'Estantería aparte. Nunca en la misma ficha que lo propio.',
  collabEmptyTitle: 'Sin collab',
  fichaEmptyTitle: 'Sin ficha',
  deliveryAria: 'Entrega y garantía',
  kindOwn: 'Marca propia',
  kindCollab: 'Colaboración',
} as const

export function shopStockCopy(stock: number): string {
  return `${stock} en stock`
}

export const SHOP_API_MESSAGES = {
  PARSE_FAIL: 'La API devolvió un producto que no se entiende.',
} as const
