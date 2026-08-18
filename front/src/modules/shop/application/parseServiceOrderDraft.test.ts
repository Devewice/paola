import { describe, expect, it } from 'vitest'
import { parseServiceOrderDraft } from '@modules/shop/application/parseServiceOrderDraft.ts'

describe('parseServiceOrderDraft', () => {
  it('acepta un pedido a Bogotá con WhatsApp sucio', () => {
    const result = parseServiceOrderDraft({
      serviceId: 'svc1',
      size: '',
      deliveryZone: 'bogota',
      customerName: 'Ana',
      customerWhatsapp: '+57 300 123 4567',
      privacyAccepted: true,
    })

    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.value.customerWhatsapp).toBe('573001234567')
    expect(result.value.customerWhatsapp.length).toBeGreaterThanOrEqual(10)
  })

  it('rechaza zona inválida', () => {
    const result = parseServiceOrderDraft({
      serviceId: 'svc1',
      size: '',
      deliveryZone: 'marte',
      customerName: 'Ana',
      customerWhatsapp: '3001234567',
      privacyAccepted: true,
    })

    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.error.message).toMatch(/Bogotá|Soacha|Fuera/i)
  })

  it('rechaza nombre muy corto', () => {
    const result = parseServiceOrderDraft({
      serviceId: 'svc1',
      size: '',
      deliveryZone: 'bogota',
      customerName: 'A',
      customerWhatsapp: '3001234567',
      privacyAccepted: true,
    })

    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.error.message).toMatch(/Di tu nombre/i)
  })

  it('no arma el pedido sin aceptar el aviso', () => {
    const result = parseServiceOrderDraft({
      serviceId: 'svc1',
      size: '',
      deliveryZone: 'bogota',
      customerName: 'Ana',
      customerWhatsapp: '3001234567',
      privacyAccepted: false,
    })

    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.error.message).toMatch(/aviso de privacidad/i)
  })
})

