import { describe, expect, it } from 'vitest'
import { parseAlliance, parseMember } from '@modules/club/infrastructure/parseClub.ts'

describe('parseAlliance', () => {
  it('acepta un aliado válido', () => {
    expect(
      parseAlliance({ id: 'a1', name: 'Taller', support: 'Revisa motos del parche' })?.name,
    ).toBe('Taller')
  })

  it('rechaza sin apoyo', () => {
    expect(parseAlliance({ id: 'a1', name: 'Taller', support: '' })).toBeNull()
  })
})

describe('parseMember', () => {
  it('acepta un integrante con alias', () => {
    expect(parseMember({ id: 'm1', alias: 'Luna' })?.alias).toBe('Luna')
  })

  it('rechaza alias vacío', () => {
    expect(parseMember({ id: 'm1', alias: '  ' })).toBeNull()
  })
})
