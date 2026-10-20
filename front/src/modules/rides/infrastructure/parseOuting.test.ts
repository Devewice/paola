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

  it('lee salida, destino y trazado de la ruta', () => {
    const outing = parseOuting({
      ...valid,
      route: {
        start: { label: 'Peaje', lat: '4.66', lng: -74.0 },
        end: { label: 'Guatavita', lat: 4.93, lng: -73.83 },
        path: '_p~iF~ps|U_ulLnnqC',
        distanceKm: 43.6,
        durationMin: 48,
      },
    })
    expect(outing?.route?.start).toEqual({ label: 'Peaje', lat: 4.66, lng: -74 })
    expect(outing?.route?.path).toHaveLength(2)
    expect(outing?.route?.distanceKm).toBe(43.6)
  })

  it('sin puntos válidos no hay ruta', () => {
    expect(parseOuting({ ...valid, route: { start: { label: 'X', lat: 200, lng: 0 } } })?.route).toBeUndefined()
  })
})
