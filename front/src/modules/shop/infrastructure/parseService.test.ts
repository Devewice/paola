import { describe, expect, it } from 'vitest'
import { parseService, parseServiceList } from '@modules/shop/infrastructure/parseService.ts'

const valid = {
  id: 's1',
  title: 'Lavado de casco',
  includesText: 'Interior y exterior',
  handoverText: 'Se deja y se recoge',
  turnaroundText: 'Tiempo que Paola publique',
  priceCop: null,
}

describe('parseService', () => {
  it('acepta ficha de lavado a preguntar', () => {
    expect(parseService(valid)).toMatchObject({
      title: 'Lavado de casco',
      priceCop: null,
    })
  })

  it('rechaza una gorra colada como servicio', () => {
    expect(
      parseService({
        id: 'p1',
        title: 'Gorra',
        description: 'Marca propia',
        kind: 'propia',
        priceCop: 45000,
      }),
    ).toBeNull()
  })
})

describe('parseServiceList', () => {
  it('devuelve vacío si no hay services', () => {
    expect(parseServiceList({ ok: true, products: [valid] })).toEqual([])
  })
})
