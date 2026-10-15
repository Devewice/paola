import { describe, expect, it } from 'vitest'
import { isClaimable, type Outing } from '@modules/rides/domain/entities/Outing.ts'

function outing(partial: Partial<Outing>): Outing {
  return {
    id: 'o1',
    title: 'Rodada',
    date: '2026-10-20',
    kind: 'rodada',
    meetingPoint: 'Peaje',
    routeText: '',
    capacity: 10,
    taken: 0,
    whatToBring: '',
    paid: false,
    status: 'abierto',
    ...partial,
  }
}

describe('isClaimable', () => {
  it('acepta una salida abierta con fecha de hoy en adelante', () => {
    expect(isClaimable(outing({ date: '2026-10-14' }), '2026-10-14')).toBe(true)
  })

  it('rechaza una salida abierta con fecha pasada', () => {
    expect(isClaimable(outing({ date: '2026-09-29' }), '2026-10-14')).toBe(false)
  })

  it('rechaza una salida llena aunque la fecha venga', () => {
    expect(isClaimable(outing({ status: 'lleno' }), '2026-10-14')).toBe(false)
  })
})
