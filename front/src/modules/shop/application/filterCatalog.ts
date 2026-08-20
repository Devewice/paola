import type { Product } from '@modules/shop/domain/entities/Product.ts'
import type { ShopService } from '@modules/shop/domain/entities/ShopService.ts'
import { SHOP_PRICE_BAND, SHOP_PRICE_LIMITS, SHOP_SORT, SHOP_STOCK } from '@modules/shop/constants/copy.ts'

export const SHOP_SHELF = {
  OWN: 'own',
  COLLAB: 'collab',
  SERVICE: 'service',
} as const

export type ShopShelfId = (typeof SHOP_SHELF)[keyof typeof SHOP_SHELF]

export type CatalogFilter = {
  readonly query: string
  readonly shelves: readonly ShopShelfId[]
  readonly priceBands: readonly string[]
  readonly colors: readonly string[]
  readonly sizes: readonly string[]
  readonly categories: readonly string[]
  readonly stocks: readonly string[]
  readonly withPhoto: boolean
}

type SortableItem = {
  readonly title: string
  readonly priceCop: number | null
  readonly createdAt?: string
  readonly color?: string
}

export function shelfIsOn(id: ShopShelfId, shelves: readonly ShopShelfId[]): boolean {
  return shelves.length === 0 || shelves.includes(id)
}

function needleOf(query: string): string {
  return query.trim().toLocaleLowerCase('es')
}

function matchesQuery(text: string, query: string): boolean {
  const needle = needleOf(query)
  if (!needle) return true
  return text.toLocaleLowerCase('es').includes(needle)
}

function priceInBand(priceCop: number | null, band: string): boolean {
  if (band === SHOP_PRICE_BAND.ASK) return priceCop === null
  if (priceCop === null) return false
  if (band === SHOP_PRICE_BAND.UPTO_50) return priceCop <= SHOP_PRICE_LIMITS.MID_MIN
  if (band === SHOP_PRICE_BAND.MID) {
    return priceCop > SHOP_PRICE_LIMITS.MID_MIN && priceCop <= SHOP_PRICE_LIMITS.MID_MAX
  }
  if (band === SHOP_PRICE_BAND.FROM_150) return priceCop > SHOP_PRICE_LIMITS.MID_MAX
  return false
}

function matchesPrice(priceCop: number | null, filter: CatalogFilter): boolean {
  if (!filter.priceBands.length) return true
  return filter.priceBands.some((band) => priceInBand(priceCop, band))
}

function stockInKind(stock: number | null, kind: string): boolean {
  if (kind === SHOP_STOCK.ASK) return stock === null
  if (stock === null) return false
  if (kind === SHOP_STOCK.OUT) return stock <= 0
  if (kind === SHOP_STOCK.IN) return stock > 0
  return false
}

function matchesStock(stock: number | null, filter: CatalogFilter): boolean {
  if (!filter.stocks.length) return true
  return filter.stocks.some((kind) => stockInKind(stock, kind))
}

function matchesPhoto(photoSrc: string | undefined, filter: CatalogFilter): boolean {
  if (!filter.withPhoto) return true
  return Boolean(photoSrc)
}

function matchesFacet(value: string | undefined, selected: readonly string[]): boolean {
  if (!selected.length) return true
  return Boolean(value && selected.includes(value))
}

export function productPasses(item: Product, filter: CatalogFilter): boolean {
  if (!matchesQuery(`${item.title} ${item.description}`, filter.query)) return false
  if (!matchesPrice(item.priceCop, filter)) return false
  if (!matchesStock(item.stock, filter)) return false
  if (!matchesPhoto(item.photoSrc, filter)) return false
  if (!matchesFacet(item.color, filter.colors)) return false
  if (!matchesFacet(item.size, filter.sizes)) return false
  if (!matchesFacet(item.category, filter.categories)) return false
  return true
}

export function servicePasses(item: ShopService, filter: CatalogFilter): boolean {
  if (!matchesQuery(`${item.title} ${item.includesText} ${item.handoverText}`, filter.query)) return false
  if (!matchesPrice(item.priceCop, filter)) return false
  if (filter.withPhoto) return false
  if (filter.colors.length || filter.sizes.length || filter.categories.length) return false
  if (!filter.stocks.length) return true
  return filter.stocks.includes(SHOP_STOCK.IN)
}

export function matchingShelfCounts(
  own: readonly Product[],
  collab: readonly Product[],
  services: readonly ShopService[],
  filter: CatalogFilter,
): { readonly own: number; readonly collab: number; readonly service: number } {
  const rest: CatalogFilter = { ...filter, shelves: [] }
  return {
    own: own.filter((item) => productPasses(item, rest)).length,
    collab: collab.filter((item) => productPasses(item, rest)).length,
    service: services.filter((item) => servicePasses(item, rest)).length,
  }
}

export function uniqueLabels(values: readonly (string | undefined)[]): string[] {
  return [...new Set(values.filter((item): item is string => Boolean(item)))].sort((a, b) =>
    a.localeCompare(b, 'es'),
  )
}

function createdMs(item: SortableItem): number {
  if (!item.createdAt) return 0
  const ms = Date.parse(item.createdAt)
  return Number.isNaN(ms) ? 0 : ms
}

function priceRank(priceCop: number | null, desc: boolean): number {
  if (priceCop === null) return Number.POSITIVE_INFINITY
  return desc ? -priceCop : priceCop
}

function textRank(value: string | undefined): string {
  return value ?? ''
}

export function compareCatalog(a: SortableItem, b: SortableItem, sort: string): number {
  if (sort === SHOP_SORT.NEWEST) return createdMs(b) - createdMs(a)
  if (sort === SHOP_SORT.OLDEST) return createdMs(a) - createdMs(b)
  if (sort === SHOP_SORT.PRICE_ASC) return priceRank(a.priceCop, false) - priceRank(b.priceCop, false)
  if (sort === SHOP_SORT.PRICE_DESC) return priceRank(a.priceCop, true) - priceRank(b.priceCop, true)
  if (sort === SHOP_SORT.NAME) return a.title.localeCompare(b.title, 'es')
  if (sort === SHOP_SORT.COLOR_ASC) return textRank(a.color).localeCompare(textRank(b.color), 'es')
  if (sort === SHOP_SORT.COLOR_DESC) return textRank(b.color).localeCompare(textRank(a.color), 'es')
  return 0
}

export function sortCatalog<T extends SortableItem>(items: readonly T[], sort: string): T[] {
  return [...items].sort((a, b) => compareCatalog(a, b, sort))
}

export function pricedCeiling(products: readonly Product[], services: readonly ShopService[]): number | null {
  const prices = [
    ...products.map((item) => item.priceCop),
    ...services.map((item) => item.priceCop),
  ].filter((value): value is number => value !== null)
  if (!prices.length) return null
  return Math.max(...prices)
}
