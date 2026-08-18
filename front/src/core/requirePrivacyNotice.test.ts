import { describe, expect, it } from 'vitest'
import { requirePrivacyNotice } from '@core/requirePrivacyNotice.ts'

const MESSAGE = 'Necesitas leer el aviso de privacidad para continuar.'

describe('requirePrivacyNotice', () => {
  it('bloquea el envío si no se aceptó el aviso', () => {
    const result = requirePrivacyNotice(false, MESSAGE)
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error.message).toBe(MESSAGE)
  })

  it('bloquea si el aviso ni siquiera viene', () => {
    const result = requirePrivacyNotice(undefined, MESSAGE)
    expect(result.ok).toBe(false)
  })

  it('sigue si el aviso se leyó', () => {
    const result = requirePrivacyNotice(true, MESSAGE)
    expect(result.ok).toBe(true)
  })
})
