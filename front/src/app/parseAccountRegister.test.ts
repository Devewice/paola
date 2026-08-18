import { describe, expect, it } from 'vitest'
import { parseAccountRegister } from '@app/parseAccountRegister.ts'
import { LEGAL_COPY } from '@app/constants/legal.ts'

describe('parseAccountRegister', () => {
  it('no registra sin aceptar el aviso', () => {
    const result = parseAccountRegister({ privacyAccepted: false })
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error.message).toBe(LEGAL_COPY.privacyRequired)
  })

  it('sigue si se leyó el aviso', () => {
    const result = parseAccountRegister({ privacyAccepted: true })
    expect(result.ok).toBe(true)
  })
})
