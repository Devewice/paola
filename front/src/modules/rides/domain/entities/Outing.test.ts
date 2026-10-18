import { describe, expect, it } from 'vitest'
import { isClaimable, isConfirmOpen, type Outing } from '@modules/rides/domain/entities/Outing.ts'

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

describe('isConfirmOpen', () => {
  it('se abre dos días antes y sigue abierto el día de la salida', () => {
    expect(isConfirmOpen('2026-10-27', 'abierto', '2026-10-25')).toBe(true)
    expect(isConfirmOpen('2026-10-27', 'lleno', '2026-10-27')).toBe(true)
  })

  it('todavía no se abre tres días antes', () => {
    expect(isConfirmOpen('2026-10-27', 'abierto', '2026-10-24')).toBe(false)
  })

  it('cruza el cambio de mes', () => {
    expect(isConfirmOpen('2026-11-01', 'abierto', '2026-10-30')).toBe(true)
    expect(isConfirmOpen('2026-11-01', 'abierto', '2026-10-29')).toBe(false)
  })

  it('se cierra si ya pasó o se marcó realizada', () => {
    expect(isConfirmOpen('2026-10-27', 'abierto', '2026-10-28')).toBe(false)
    expect(isConfirmOpen('2026-10-27', 'realizado', '2026-10-27')).toBe(false)
  })
})
