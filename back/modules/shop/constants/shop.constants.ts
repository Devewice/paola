import type { ProductKind } from '../interfaces/shop.interface.js'

export const SHOP_KINDS: readonly ProductKind[] = ['propia', 'colaboracion']
export const SHOP_DEFAULT_KIND: ProductKind = 'propia'
export const SHOP_KIND_SET = new Set<string>(SHOP_KINDS)

export const SHOP_LIMITS = {
  TITLE_MIN: 2,
  DESCRIPTION_MIN: 2,
  COUNT_MIN: 0,
} as const

export const SHOP_TABLES = {
  PRODUCTS: 'products',
} as const

export const SHOP_ROUTES = {
  LIST: '/api/products',
  CREATE: '/api/operar/products',
} as const

export const SHOP_MESSAGES = {
  TITLE_REQUIRED: 'El producto necesita un nombre.',
  DESCRIPTION_REQUIRED: 'Di qué es, en una frase.',
  KIND_INVALID: 'Elige estantería: propia o colaboración.',
  PRICE_INVALID: 'El precio es un entero en pesos, o vacío para preguntar.',
  STOCK_INVALID: 'El stock es un entero ≥ 0, o vacío si no aplica.',
} as const
