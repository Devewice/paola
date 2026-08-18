import { describe, expect, it } from 'vitest'
import { parseTip, parseTipList } from '@modules/voice/infrastructure/parseTip.ts'

describe('parseTip', () => {
  it('acepta tip con enlace oficial', () => {
    const tip = parseTip({
      id: 't1',
      title: 'Casco siempre',
      body: 'Sin casco no hay parche.',
      officialHref: 'https://example.com/norma',
    })
    expect(tip).toEqual({
      id: 't1',
      title: 'Casco siempre',
      body: 'Sin casco no hay parche.',
      officialHref: 'https://example.com/norma',
    })
  })

  it('rechaza tip sin título', () => {
    expect(parseTip({ id: 't1', title: ' ', body: 'Algo útil.' })).toBeNull()
  })
})

describe('parseTipList', () => {
  it('devuelve lista vacía si el cuerpo no trae tips', () => {
    expect(parseTipList({ ok: true })).toEqual({
      items: [],
      emptyCopy: expect.any(String),
    })
  })
})
