import { describe, expect, it } from 'vitest'
import { parseMemory, parseMemoryPhoto } from '@modules/rides/infrastructure/parseMemory.ts'

const valid = {
  id: 'm1',
  outingId: 's1',
  title: 'Usme',
  date: '2026-09-01',
  km: 42,
  closingText: 'Rodamos con propósito.',
  credit: 'Paola',
  participantsText: 'Luna · RX115',
  photos: [{ id: 'p1', src: 'https://example.com/foto.webp', alt: 'Salida Usme' }],
}

describe('parseMemory', () => {
  it('acepta una memoria válida', () => {
    expect(parseMemory(valid)?.title).toBe('Usme')
  })

  it('rechaza km menor a 1', () => {
    expect(parseMemory({ ...valid, km: 0 })).toBeNull()
  })
})

describe('parseMemoryPhoto', () => {
  it('rechaza alt vacío', () => {
    expect(parseMemoryPhoto({ id: 'p1', src: 'https://x.co/a.jpg', alt: '  ' })).toBeNull()
  })
})
