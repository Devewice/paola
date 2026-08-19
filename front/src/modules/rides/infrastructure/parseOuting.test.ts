import { describe, expect, it } from 'vitest'
import { parseOuting } from '@modules/rides/infrastructure/parseOuting.ts'

const valid = {
  id: 'salida-1',
  title: 'Usme',
  date: '2026-09-01',
  kind: 'rodada',
  meetingPoint: 'Usme',
  routeText: 'Por definir',
  capacity: 12,
  whatToBring: 'Casco',
  paid: false,
  status: 'abierto',
}

describe('parseOuting', () => {
  it('acepta una salida válida', () => {
    expect(parseOuting(valid)?.id).toBe('salida-1')
  })

  it('rechaza fecha que no es ISO', () => {
    expect(parseOuting({ ...valid, date: '01-09-2026' })).toBeNull()
  })

  it('acepta mapHref opcional', () => {
    expect(parseOuting({ ...valid, mapHref: 'https://ejemplo.test/ruta.png' })?.mapHref).toBe(
      'https://ejemplo.test/ruta.png',
    )
    expect(parseOuting(valid)?.mapHref).toBeUndefined()
  })
})
