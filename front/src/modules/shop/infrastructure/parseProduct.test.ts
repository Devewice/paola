import { describe, expect, it } from 'vitest'
import { parseProduct, parseProductList } from '@modules/shop/infrastructure/parseProduct.ts'

describe('parseProduct', () => {
  it('acepta pieza propia con precio', () => {
    expect(
      parseProduct({
        id: 'p1',
        title: 'Gorra',
        description: 'Gorra del parche',
        kind: 'propia',
        priceCop: 45000,
        stock: 2,
      }),
    ).toMatchObject({ title: 'Gorra', kind: 'propia', priceCop: 45000, stock: 2 })
  })

  it('acepta colaboración a preguntar', () => {
    const product = parseProduct({
      id: 'c1',
      title: 'Pañoleta',
      description: 'Collab aparte',
      kind: 'colaboracion',
      priceCop: null,
      stock: null,
    })
    expect(product?.kind).toBe('colaboracion')
    expect(product?.priceCop).toBeNull()
  })

  it('rechaza mezclar kind inventado', () => {
    expect(
      parseProduct({
        id: 'x1',
        title: 'Algo',
        description: 'Texto',
        kind: 'alianza',
        priceCop: null,
      }),
    ).toBeNull()
  })
})

describe('parseProductList', () => {
  it('devuelve vacío si no hay products', () => {
    expect(parseProductList({ ok: true })).toEqual([])
  })
})
