import { describe, expect, it } from 'vitest'
import { parsePublicParcero } from '@app/parsePublicParcero.ts'

describe('parsePublicParcero', () => {
  it('no deja pasar WhatsApp ni correo', () => {
    expect(
      parsePublicParcero({
        id: 'u1',
        alias: 'parcero',
        km: 0,
        email: 'alguien@correo.com',
      }),
    ).toBeNull()
    expect(
      parsePublicParcero({
        id: 'u2',
        alias: 'parcero',
        km: 0,
        whatsapp: '3000000000',
      }),
    ).toBeNull()
  })

  it('acepta alias, km y moto, nada de contacto', () => {
    expect(
      parsePublicParcero({
        id: 'u3',
        alias: 'parcero',
        km: 12,
        moto: 'Boxer',
      }),
    ).toMatchObject({ alias: 'parcero', km: 12, moto: 'Boxer' })
  })
})
