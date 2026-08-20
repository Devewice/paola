import { describe, expect, it } from 'vitest'
import { ListShelves } from '@modules/shop/application/ListShelves.ts'
import type { Product } from '@modules/shop/domain/entities/Product.ts'
import { InMemoryProductCatalog } from '@modules/shop/infrastructure/InMemoryProductCatalog.ts'

const propia: Product = {
  id: 'p1',
  title: 'Gorra Paola',
  description: 'Marca propia, no collab.',
  kind: 'propia',
  priceCop: 45000,
  stock: 3,
}

const collab: Product = {
  id: 'c1',
  title: 'Pañoleta collab',
  description: 'Colaboración, estantería aparte.',
  kind: 'colaboracion',
  priceCop: null,
  stock: null,
}

describe('ListShelves', () => {
  it('no mezcla propia con colaboración', () => {
    const shelves = new ListShelves(new InMemoryProductCatalog([collab, propia])).execute()
    expect(shelves.own.map((item) => item.id)).toEqual(['p1'])
    expect(shelves.collab.map((item) => item.id)).toEqual(['c1'])
  })

  it('deja hueco honesto si no hay filas', () => {
    const shelves = new ListShelves(new InMemoryProductCatalog()).execute()
    expect(shelves.own).toHaveLength(0)
    expect(shelves.collab).toHaveLength(0)
    expect(shelves.emptyOwnCopy.length).toBeGreaterThan(10)
    expect(shelves.deliveryCopy).toMatch(/Bogotá y Soacha/)
    expect(shelves.warrantyCopy).toMatch(/defectos de fábrica/)
  })
})
