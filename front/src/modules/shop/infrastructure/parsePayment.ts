import { PAYMENT_CATALOG, PAYMENT_COPY, PAYMENT_HUMAN, type PaymentMethodId } from '@modules/shop/constants/payments.ts'
import type {
  CheckoutSession,
  GatewayTest,
  OperatorGateway,
  PaymentMethod,
} from '@modules/shop/domain/entities/Payment.ts'

function isMethodId(value: string): value is PaymentMethodId {
  if (value === PAYMENT_HUMAN.WHATSAPP || value === PAYMENT_HUMAN.MAIL) return true
  return PAYMENT_CATALOG.some((item) => item.id === value)
}

export function decorateMethod(raw: {
  id: string
  channel: 'human' | 'gateway'
  available: boolean
  wired: boolean
}): PaymentMethod | null {
  if (!isMethodId(raw.id)) return null
  if (raw.id === PAYMENT_HUMAN.WHATSAPP) {
    return {
      id: raw.id,
      channel: 'human',
      title: PAYMENT_COPY.humanWhatsappTitle,
      copy: PAYMENT_COPY.humanWhatsappCopy,
      icon: 'W',
      available: true,
      wired: true,
    }
  }
  if (raw.id === PAYMENT_HUMAN.MAIL) {
    return {
      id: raw.id,
      channel: 'human',
      title: PAYMENT_COPY.humanMailTitle,
      copy: PAYMENT_COPY.humanMailCopy,
      icon: '@',
      available: true,
      wired: true,
    }
  }
  const catalog = PAYMENT_CATALOG.find((item) => item.id === raw.id)
  if (!catalog) return null
  return {
    id: catalog.id,
    channel: 'gateway',
    title: catalog.title,
    copy: catalog.copy,
    icon: catalog.icon,
    available: raw.available,
    wired: raw.wired,
  }
}

export function parseMethodList(raw: unknown): readonly PaymentMethod[] {
  if (!raw || typeof raw !== 'object') return []
  const body = raw as Record<string, unknown>
  if (!Array.isArray(body.methods)) return []
  return body.methods
    .map((row) => {
      if (!row || typeof row !== 'object') return null
      const item = row as Record<string, unknown>
      if (typeof item.id !== 'string') return null
      const channel = item.channel === 'gateway' ? 'gateway' : 'human'
      return decorateMethod({
        id: item.id,
        channel,
        available: Boolean(item.available),
        wired: Boolean(item.wired),
      })
    })
    .filter((item): item is PaymentMethod => item !== null)
}

export function parseOperatorGateways(raw: unknown): readonly OperatorGateway[] {
  if (!raw || typeof raw !== 'object') return []
  const body = raw as Record<string, unknown>
  if (!Array.isArray(body.gateways)) return []
  const items: OperatorGateway[] = []
  for (const row of body.gateways) {
    if (!row || typeof row !== 'object') continue
    const item = row as Record<string, unknown>
    const catalog = PAYMENT_CATALOG.find((entry) => entry.id === item.provider)
    if (!catalog) continue
    const filled = Array.isArray(item.filled)
      ? item.filled.filter((key): key is string => typeof key === 'string')
      : []
    const status =
      item.status === 'live' || item.status === 'ready' || item.status === 'draft' || item.status === 'off'
        ? item.status
        : 'off'
    items.push({
      provider: catalog.id,
      mode: item.mode === 'live' ? 'live' : 'sandbox',
      enabled: Boolean(item.enabled),
      status,
      filled,
    })
  }
  return items
}

export function parseGatewayTest(raw: unknown): GatewayTest | null {
  if (!raw || typeof raw !== 'object') return null
  const body = raw as Record<string, unknown>
  const test = body.test
  if (!test || typeof test !== 'object') return null
  const item = test as Record<string, unknown>
  const catalog = PAYMENT_CATALOG.find((entry) => entry.id === item.provider)
  if (!catalog || typeof item.detail !== 'string') return null
  return {
    provider: catalog.id,
    ok: Boolean(item.ok),
    wired: Boolean(item.wired),
    detail: item.detail,
  }
}

export function parseCheckoutSession(raw: unknown): CheckoutSession | null {
  if (!raw || typeof raw !== 'object') return null
  const body = raw as Record<string, unknown>
  const session = body.checkout
  if (!session || typeof session !== 'object') return null
  const item = session as Record<string, unknown>
  if (typeof item.method !== 'string' || !isMethodId(item.method) || typeof item.detail !== 'string') {
    return null
  }
  const status =
    item.status === 'redirect' || item.status === 'deferred' || item.status === 'human' ? item.status : null
  if (!status) return null
  return {
    method: item.method,
    status,
    href: typeof item.href === 'string' ? item.href : undefined,
    checkoutUrl: typeof item.checkoutUrl === 'string' ? item.checkoutUrl : undefined,
    detail: item.detail,
  }
}
