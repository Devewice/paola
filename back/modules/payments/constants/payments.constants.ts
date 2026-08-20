export type PaymentProviderId =
  | 'wompi'
  | 'pse'
  | 'addi'
  | 'payu'
  | 'epayco'
  | 'bold'
  | 'mercadopago'

export type GatewayMode = 'sandbox' | 'live'
export type GatewayStatus = 'off' | 'draft' | 'ready' | 'live'

export type GatewayFieldDef = {
  readonly key: string
  readonly required: boolean
  readonly secret: boolean
}

export type GatewayCatalogItem = {
  readonly id: PaymentProviderId
  readonly fields: readonly GatewayFieldDef[]
}

export const PAYMENT_TABLES = {
  GATEWAYS: 'payment_gateways',
} as const

export const PAYMENT_ROUTES = {
  METHODS: '/api/payments/methods',
  CHECKOUT: '/api/payments/checkout',
  OPERAR_LIST: '/api/operar/payments',
  OPERAR_SAVE: '/api/operar/payments',
  OPERAR_TEST: '/api/operar/payments/test',
} as const

export const PAYMENT_MODE = {
  SANDBOX: 'sandbox',
  LIVE: 'live',
} as const

export const PAYMENT_STATUS = {
  OFF: 'off',
  DRAFT: 'draft',
  READY: 'ready',
  LIVE: 'live',
} as const

export const PAYMENT_PROVIDERS: readonly GatewayCatalogItem[] = [
  {
    id: 'wompi',
    fields: [
      { key: 'publicKey', required: true, secret: false },
      { key: 'privateKey', required: true, secret: true },
      { key: 'eventsSecret', required: false, secret: true },
      { key: 'integrityKey', required: false, secret: true },
    ],
  },
  {
    id: 'pse',
    fields: [
      { key: 'login', required: true, secret: false },
      { key: 'tranKey', required: true, secret: true },
      { key: 'merchantId', required: true, secret: false },
    ],
  },
  {
    id: 'addi',
    fields: [
      { key: 'allySlug', required: true, secret: false },
      { key: 'apiKey', required: true, secret: true },
      { key: 'secretKey', required: true, secret: true },
    ],
  },
  {
    id: 'payu',
    fields: [
      { key: 'merchantId', required: true, secret: false },
      { key: 'accountId', required: true, secret: false },
      { key: 'apiKey', required: true, secret: true },
      { key: 'apiLogin', required: true, secret: true },
    ],
  },
  {
    id: 'epayco',
    fields: [
      { key: 'publicKey', required: true, secret: false },
      { key: 'privateKey', required: true, secret: true },
    ],
  },
  {
    id: 'bold',
    fields: [
      { key: 'apiKey', required: true, secret: true },
    ],
  },
  {
    id: 'mercadopago',
    fields: [
      { key: 'publicKey', required: true, secret: false },
      { key: 'accessToken', required: true, secret: true },
    ],
  },
]

export const PAYMENT_PROVIDER_IDS = PAYMENT_PROVIDERS.map((item) => item.id)

export const PAYMENT_PROVIDER_SET = new Set<string>(PAYMENT_PROVIDER_IDS)

export const PAYMENT_MESSAGES = {
  PROVIDER_INVALID: 'Esa pasarela no está en el catálogo.',
  MODE_INVALID: 'Elige sandbox o live.',
  GATEWAY_REQUIRED: 'Elige al menos una pasarela, o deja solo WhatsApp.',
  NOT_READY: 'Esa pasarela todavía no está lista para cobrar.',
  NOT_WIRED: 'Las llaves quedaron. El cobro en vivo se engancha cuando conectemos la cuenta. Mientras tanto el pedido sigue por WhatsApp.',
  MISSING_KEYS: 'Faltan llaves obligatorias.',
  TEST_OK: 'Las llaves alcanzan para enganchar. Aún no cobramos en vivo.',
  SAVE_OK: 'Pasarela guardada.',
  HUMAN_ONLY: 'Este cobro va por WhatsApp o correo.',
  AMOUNT_INVALID: 'El monto es un entero en pesos, o vacío.',
} as const
