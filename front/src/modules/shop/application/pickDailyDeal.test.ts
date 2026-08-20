import { describe, expect, it } from 'vitest'
import { pickDailyDeal } from '@modules/shop/application/pickDailyDeal.ts'
import type { Product } from '@modules/shop/domain/entities/Product.ts'

function product(partial: Partial<Product> & Pick<Product, 'id'>): Product {
  return {
    title: partial.title ?? 'Pieza',
    description: partial.description ?? 'Desc',
    kind: partial.kind ?? 'propia',
    priceCop: partial.priceCop ?? 10_000,
    stock: partial.stock ?? 1,
    photoSrc: partial.photoSrc,
    ...partial,
  }
}

describe('pickDailyDeal', () => {
  it('devuelve null si no hay piezas con foto y stock', () => {
    expect(pickDailyDeal([])).toBeNull()
    expect(
      pickDailyDeal([
        product({ id: 'a', stock: 0, photoSrc: '/a.png' }),
        product({ id: 'b', stock: 2 }),
      ]),
    ).toBeNull()
  })

  it('elige una pieza con foto y stock', () => {
    const a = product({ id: 'a', photoSrc: '/a.png' })
    expect(pickDailyDeal([a])?.id).toBe('a')
  })

  it('rota por día', () => {
    const a = product({ id: 'a', photoSrc: '/a.png' })
    const b = product({ id: 'b', photoSrc: '/b.png' })
    const day0 = 0
    const day1 = 86_400_000
    expect(pickDailyDeal([a, b], day0)?.id).toBe('a')
    expect(pickDailyDeal([a, b], day1)?.id).toBe('b')
  })
})
