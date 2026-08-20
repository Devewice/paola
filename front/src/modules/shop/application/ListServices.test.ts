import { describe, expect, it } from 'vitest'
import { ListServices } from '@modules/shop/application/ListServices.ts'
import type { ShopService } from '@modules/shop/domain/entities/ShopService.ts'
import { InMemoryServiceCatalog } from '@modules/shop/infrastructure/InMemoryServiceCatalog.ts'

const wash: ShopService = {
  id: 's1',
  title: 'Lavado de casco',
  includesText: 'Limpieza interior y exterior.',
  handoverText: 'Se deja y se recoge en punto acordado.',
  turnaroundText: 'Lo confirmamos en la ficha.',
  priceCop: null,
}

describe('ListServices', () => {
  it('deja hueco honesto si no hay ficha de lavado', () => {
    const board = new ListServices(new InMemoryServiceCatalog()).execute()
    expect(board.items).toHaveLength(0)
    expect(board.emptyCopy).toMatch(/lavado/)
    expect(board.warrantyCopy).toMatch(/corregimos/)
    expect(board.warrantyCopy).not.toMatch(/defectos de fabricación/)
    expect(board.zoneCopy).toMatch(/Bogotá y Soacha/)
  })

  it('lista el lavado como servicio, no como pieza', () => {
    const board = new ListServices(new InMemoryServiceCatalog([wash])).execute()
    expect(board.items.map((item) => item.id)).toEqual(['s1'])
    expect(board.items[0]?.includesText.length).toBeGreaterThan(2)
  })
})
