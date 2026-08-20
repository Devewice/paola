import { describe, expect, it } from 'vitest'
import { PAYMENT_HUMAN, PAYMENT_PROVIDER } from '@modules/shop/constants/payments.ts'
import { InMemoryPaymentsApi } from '@modules/shop/infrastructure/InMemoryPaymentsApi.ts'

describe('InMemoryPaymentsApi', () => {
  it('WhatsApp y correo siguen aunque no haya pasarela', async () => {
    const api = new InMemoryPaymentsApi()
    const methods = await api.listMethods()
    expect(methods.ok).toBe(true)
    if (!methods.ok) return
    expect(methods.value.map((item) => item.id)).toEqual([PAYMENT_HUMAN.WHATSAPP, PAYMENT_HUMAN.MAIL])
  })

  it('guarda llaves y lista Wompi en tienda si está activa', async () => {
    const api = new InMemoryPaymentsApi()
    const saved = await api.saveWizard(
      [
        {
          provider: PAYMENT_PROVIDER.WOMPI,
          mode: 'sandbox',
          enabled: true,
          credentials: { publicKey: 'pub_test', privateKey: 'prv_test' },
        },
      ],
      'clave',
    )
    expect(saved.ok).toBe(true)
    const methods = await api.listMethods()
    if (!methods.ok) return
    expect(methods.value.some((item) => item.id === PAYMENT_PROVIDER.WOMPI)).toBe(true)
    const test = await api.testGateway(PAYMENT_PROVIDER.WOMPI, 'clave')
    expect(test.ok).toBe(true)
    if (!test.ok) return
    expect(test.value.ok).toBe(true)
    expect(test.value.wired).toBe(false)
  })

  it('el checkout de pasarela no cobra: queda diferido', async () => {
    const api = new InMemoryPaymentsApi()
    const checkout = await api.createCheckout({
      method: PAYMENT_PROVIDER.ADDI,
      amountCop: 50000,
      reference: 'tienda',
    })
    expect(checkout.ok).toBe(true)
    if (!checkout.ok) return
    expect(checkout.value.status).toBe('deferred')
  })
})
