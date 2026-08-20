export const SHOP_EMPTY_OWN = 'Aún no hay nada a la venta.'

export const SHOP_EMPTY_COLLAB = 'Aún no hay colaboraciones.'

export const SHOP_EMPTY_FICHA = 'Ese producto no está.'

export const SHOP_EMPTY_SERVICE = 'Aún no hay lavado de casco.'

export const SHOP_EMPTY_SERVICE_FICHA = 'Ese lavado no está.'

export const SHOP_DELIVERY_COPY =
  'La entrega es gratis en Bogotá y Soacha. Al resto del país todavía no llegamos.'

export const SHOP_WARRANTY_COPY =
  'La garantía cubre solo defectos de fábrica. No cubre golpe, desgaste ni si no te gustó.'

export const SHOP_SERVICE_WARRANTY_COPY =
  'Si el lavado quedó mal, lo corregimos.'

export const SHOP_SERVICE_ZONE_COPY =
  'El lavado es solo en Bogotá y Soacha.'

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
  lead: 'Marca propia, colaboraciones aparte y lavado de casco. Para pedir, escríbeme.',
  writeCta: 'Escríbeme',
  mailCta: 'Correo',
  backCta: 'Volver a Tienda',
  rulesHeading: 'Reglas',
  rulesAria: 'Reglas',
  ownHeading: 'Marca propia',
  ownAria: 'Marca propia',
  ownEmptyTitle: 'Sin piezas propias',
  collabHeading: 'Colaboraciones',
  collabAria: 'Colaboraciones',
  collabNote: 'Las colaboraciones van en su propia lista, no mezcladas con la marca propia.',
  collabEmptyTitle: 'Sin collab',
  fichaEmptyTitle: 'Sin ficha',
  deliveryAria: 'Entrega y garantía',
  kindOwn: 'Marca propia',
  kindCollab: 'Colaboración',
  serviceHeading: 'Lavado de cascos',
  serviceAria: 'Lavado de cascos',
  serviceEmptyTitle: 'Sin lavado publicado',
  serviceKind: 'Servicio',
  serviceAskCta: 'Pedir el lavado',
  serviceIncludes: 'Qué incluye',
  serviceHandover: 'Cómo se entrega el casco',
  serviceTurnaround: 'Tiempo',
  serviceFichaEmptyTitle: 'Sin ficha de lavado',
  serviceMediaLabel: 'Lavado',
} as const

export function shopStockCopy(stock: number): string {
  return `${stock} en stock`
}

export const SHOP_API_MESSAGES = {
  PARSE_FAIL: 'La API devolvió un producto que no se entiende.',
  PARSE_SERVICE_FAIL: 'La API devolvió un lavado que no se entiende.',
} as const
