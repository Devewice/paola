import { appError } from '@core/errors/AppError.ts'
import { err, ok } from '@core/result.ts'
import { PAYMENT_COPY, PAYMENT_HUMAN, paymentCatalogItem, type PaymentProviderId } from '@modules/shop/constants/payments.ts'
import type {
  CheckoutDraft,
  OperatorGateway,
  PaymentMethod,
  WizardGatewayDraft,
} from '@modules/shop/domain/entities/Payment.ts'
import type { PaymentPort } from '@modules/shop/domain/ports/PaymentPort.ts'
import { decorateMethod } from '@modules/shop/infrastructure/parsePayment.ts'

const HUMAN: readonly PaymentMethod[] = [
  decorateMethod({ id: PAYMENT_HUMAN.WHATSAPP, channel: 'human', available: true, wired: true })!,
  decorateMethod({ id: PAYMENT_HUMAN.MAIL, channel: 'human', available: true, wired: true })!,
]

export class InMemoryPaymentsApi implements PaymentPort {
  private rows: OperatorGateway[] = []
  private readonly secrets = new Map<string, Record<string, string>>()

  async listMethods() {
    const gateways = this.rows
      .filter((row) => row.enabled && row.status === 'live')
      .map((row) =>
        decorateMethod({
          id: row.provider,
          channel: 'gateway',
          available: true,
          wired: false,
        }),
      )
      .filter((item): item is PaymentMethod => item !== null)
    return ok([...HUMAN, ...gateways])
  }

  async listOperatorGateways(_clave: string) {
    return ok(this.rows)
  }

  async saveWizard(gateways: readonly WizardGatewayDraft[], _clave: string) {
    this.rows = gateways.map((draft) => {
      const previous = this.secrets.get(draft.provider) ?? {}
      const merged = { ...previous }
      for (const [key, value] of Object.entries(draft.credentials)) {
        if (value.trim()) merged[key] = value.trim()
      }
      this.secrets.set(draft.provider, merged)
      const catalog = paymentCatalogItem(draft.provider)
      const filled = (catalog?.fields ?? [])
        .filter((field) => merged[field.key])
        .map((field) => field.key)
      const complete = (catalog?.fields ?? []).filter((field) => field.required).every((field) => merged[field.key])
      return {
        provider: draft.provider,
        mode: draft.mode,
        enabled: complete ? draft.enabled : false,
        status: complete ? (draft.enabled ? 'live' : 'ready') : 'draft',
        filled,
      } satisfies OperatorGateway
    })
    return ok(this.rows)
  }

  async testGateway(provider: PaymentProviderId, _clave: string) {
    const secrets = this.secrets.get(provider) ?? {}
    const catalog = paymentCatalogItem(provider)
    if (!catalog) return err(appError('NOT_FOUND', PAYMENT_COPY.testNeedSave))
    const missing = catalog.fields.filter((field) => field.required && !secrets[field.key])
    if (missing.length) {
      return ok({ provider, ok: false, wired: false, detail: 'Faltan llaves obligatorias.' })
    }
    return ok({
      provider,
      ok: true,
      wired: false,
      detail: 'Las llaves alcanzan para enganchar. Aún no cobramos en vivo.',
    })
  }

  async createCheckout(draft: CheckoutDraft) {
    if (draft.method === PAYMENT_HUMAN.WHATSAPP || draft.method === PAYMENT_HUMAN.MAIL) {
      return ok({
        method: draft.method,
        status: 'human' as const,
        detail: PAYMENT_COPY.paySecureHuman,
      })
    }
    return ok({
      method: draft.method,
      status: 'deferred' as const,
      detail: PAYMENT_COPY.gatewayDeferred,
    })
  }
}
