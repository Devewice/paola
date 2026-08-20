import { describe, expect, it } from 'vitest'
import {
  compareCatalog,
  matchingShelfCounts,
  productPasses,
  servicePasses,
  shelfIsOn,
  SHOP_SHELF,
  type CatalogFilter,
} from '@modules/shop/application/filterCatalog.ts'
import { SHOP_PRICE_BAND, SHOP_SORT, SHOP_STOCK } from '@modules/shop/constants/copy.ts'
import type { Product } from '@modules/shop/domain/entities/Product.ts'
import type { ShopService } from '@modules/shop/domain/entities/ShopService.ts'

const open: CatalogFilter = {
  query: '',
  shelves: [],
  priceBands: [],
  colors: [],
  sizes: [],
  categories: [],
  stocks: [],
  withPhoto: false,
}

const gorra: Product = {
  id: 'p1',
  title: 'Gorra Paola',
  description: 'Marca propia',
  kind: 'propia',
  priceCop: 45000,
  stock: 3,
}

const collab: Product = {
  id: 'c1',
  title: 'Pañoleta collab',
  description: 'Aparte',
  kind: 'colaboracion',
  priceCop: null,
  stock: null,
}

const wash: ShopService = {
  id: 's1',
  title: 'Lavado de casco',
  includesText: 'Interior y exterior.',
  handoverText: 'Se deja y se recoge.',
  turnaroundText: 'Lo confirmamos.',
  priceCop: 25000,
}

describe('filterCatalog', () => {
  it('deja pasar el catálogo si no hay recortes', () => {
    expect(productPasses(gorra, open)).toBe(true)
    expect(productPasses(collab, open)).toBe(true)
    expect(servicePasses(wash, open)).toBe(true)
  })

  it('recorta por franja de precio y por preguntar', () => {
    expect(productPasses(gorra, { ...open, priceBands: [SHOP_PRICE_BAND.UPTO_50] })).toBe(true)
    expect(productPasses(gorra, { ...open, priceBands: [SHOP_PRICE_BAND.FROM_150] })).toBe(false)
    expect(productPasses(collab, { ...open, priceBands: [SHOP_PRICE_BAND.ASK] })).toBe(true)
    expect(productPasses(gorra, { ...open, priceBands: [SHOP_PRICE_BAND.ASK] })).toBe(false)
  })

  it('filtra color y deja el lavado fuera si hay recorte de color', () => {
    expect(productPasses({ ...gorra, color: 'negro' }, { ...open, colors: ['negro'] })).toBe(true)
    expect(productPasses({ ...gorra, color: 'negro' }, { ...open, colors: ['rojo'] })).toBe(false)
    expect(servicePasses(wash, { ...open, colors: ['negro'] })).toBe(false)
  })

  it('recorta por pieza de motero', () => {
    expect(productPasses({ ...gorra, category: 'gorra' }, { ...open, categories: ['gorra'] })).toBe(true)
    expect(productPasses({ ...gorra, category: 'gorra' }, { ...open, categories: ['chaqueta'] })).toBe(false)
    expect(servicePasses(wash, { ...open, categories: ['gorra'] })).toBe(false)
  })

  it('ordena por tiempo y por precio', () => {
    const older = { title: 'A', priceCop: 80000, createdAt: '2026-01-01T00:00:00.000Z' }
    const newer = { title: 'B', priceCop: 20000, createdAt: '2026-08-01T00:00:00.000Z' }
    expect(compareCatalog(newer, older, SHOP_SORT.NEWEST)).toBeLessThan(0)
    expect(compareCatalog(older, newer, SHOP_SORT.OLDEST)).toBeLessThan(0)
    expect(compareCatalog(newer, older, SHOP_SORT.PRICE_ASC)).toBeLessThan(0)
    expect(compareCatalog(older, newer, SHOP_SORT.PRICE_DESC)).toBeLessThan(0)
  })

  it('con foto deja fuera lavado y piezas sin imagen', () => {
    expect(productPasses(gorra, { ...open, withPhoto: true })).toBe(false)
    expect(servicePasses(wash, { ...open, withPhoto: true })).toBe(false)
  })

  it('recorta por stock y deja el lavado solo si hay cupo de stock', () => {
    expect(productPasses(gorra, { ...open, stocks: [SHOP_STOCK.IN] })).toBe(true)
    expect(productPasses({ ...gorra, stock: 0 }, { ...open, stocks: [SHOP_STOCK.IN] })).toBe(false)
    expect(productPasses(collab, { ...open, stocks: [SHOP_STOCK.ASK] })).toBe(true)
    expect(servicePasses(wash, { ...open, stocks: [SHOP_STOCK.OUT] })).toBe(false)
    expect(servicePasses(wash, { ...open, stocks: [SHOP_STOCK.IN] })).toBe(true)
  })

  it('estantería vacía cuenta como todas; si hay recorte, solo las marcadas', () => {
    expect(shelfIsOn(SHOP_SHELF.OWN, [])).toBe(true)
    expect(shelfIsOn(SHOP_SHELF.COLLAB, [SHOP_SHELF.OWN])).toBe(false)
    expect(
      matchingShelfCounts([gorra], [collab], [wash], { ...open, query: 'casco' }),
    ).toEqual({ own: 0, collab: 0, service: 1 })
  })
})
