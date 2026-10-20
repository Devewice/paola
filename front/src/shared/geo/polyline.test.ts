import { describe, expect, it } from 'vitest'
import { decodePolyline } from '@shared/geo/polyline.ts'

describe('decodePolyline', () => {
  it('decodifica el ejemplo de referencia de Google', () => {
    expect(decodePolyline('_p~iF~ps|U_ulLnnqC_mqNvxq`@')).toEqual([
      [38.5, -120.2],
      [40.7, -120.95],
      [43.252, -126.453],
    ])
  })

  it('devuelve vacío si la cadena está cortada', () => {
    expect(decodePolyline('_p~iF')).toEqual([])
  })

  it('cadena vacía, sin puntos', () => {
    expect(decodePolyline('')).toEqual([])
  })
})
