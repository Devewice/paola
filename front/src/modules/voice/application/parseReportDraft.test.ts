import { describe, expect, it } from 'vitest'
import { parseReportDraft } from '@modules/voice/application/parseReportDraft.ts'
import { VOICE_MESSAGES } from '@modules/voice/constants/copy.ts'

const valid = {
  title: 'Alcantarilla abierta',
  whatHappened: 'Hueco sin señal',
  whereText: 'Usme',
  happenedAt: '2026-08-18T10:00',
  evidenceSrc: '',
  privacyAccepted: true,
}

describe('parseReportDraft', () => {
  it('no envía denuncia sin aceptar el aviso', () => {
    const result = parseReportDraft({ ...valid, privacyAccepted: false })
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error.message).toBe(VOICE_MESSAGES.PRIVACY_REQUIRED)
  })

  it('acepta la constancia cuando el aviso está leído', () => {
    const result = parseReportDraft(valid)
    expect(result.ok).toBe(true)
  })
})
