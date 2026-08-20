export const PAYMENT_PROVIDER = {
  WOMPI: 'wompi',
  PSE: 'pse',
  ADDI: 'addi',
  PAYU: 'payu',
  EPAYCO: 'epayco',
  BOLD: 'bold',
  MERCADOPAGO: 'mercadopago',
} as const

export const PAYMENT_HUMAN = {
  WHATSAPP: 'whatsapp',
  MAIL: 'mail',
} as const

export const PAYMENT_MODE = {
  SANDBOX: 'sandbox',
  LIVE: 'live',
} as const

export const PAYMENT_WIZARD_STEP = {
  CHANNELS: 0,
  KEYS: 1,
  TEST: 2,
  ACTIVATE: 3,
} as const

export type PaymentProviderId = (typeof PAYMENT_PROVIDER)[keyof typeof PAYMENT_PROVIDER]
export type PaymentHumanId = (typeof PAYMENT_HUMAN)[keyof typeof PAYMENT_HUMAN]
export type PaymentMethodId = PaymentHumanId | PaymentProviderId
export type PaymentMode = (typeof PAYMENT_MODE)[keyof typeof PAYMENT_MODE]

export type GatewayFieldDef = {
  readonly key: string
  readonly label: string
  readonly hint: string
  readonly required: boolean
  readonly secret: boolean
}

export type GatewayCatalogItem = {
  readonly id: PaymentProviderId
  readonly title: string
  readonly copy: string
  readonly icon: string
  readonly fields: readonly GatewayFieldDef[]
}

export const PAYMENT_COPY = {
  humanWhatsappTitle: 'WhatsApp',
  humanWhatsappCopy: 'El chat del día a día. Este camino no se apaga.',
  humanMailTitle: 'Correo',
  humanMailCopy: 'Si prefieres dejarlo por escrito.',
  paySecureHuman: 'Pago humano primero. La pasarela se suma; el chat no se apaga.',
  paySecureGateway: 'Pasarela lista para enganchar. Mientras cobramos en vivo, escríbeme.',
  gatewayDeferred: 'La pasarela está configurada, todavía no cobra en vivo. Te dejo el WhatsApp para cuadrarlo.',
  wizardKicker: 'Pasarela',
  wizardTitle: 'Cobro en tienda',
  wizardLead:
    'WhatsApp sigue. Aquí enganchas Wompi, PSE, Addi y otras. Guardas llaves; el cobro en vivo se conecta cuando la cuenta esté lista.',
  stepChannels: 'Canales',
  stepChannelsMeta: 'Elige qué pasarelas quieres enganchar. WhatsApp no se quita.',
  stepKeys: 'Llaves',
  stepKeysMeta: 'Sandbox o live, y las credenciales de cada una.',
  stepTest: 'Prueba',
  stepTestMeta: 'Revisa que no falte nada. No cobra todavía.',
  stepActivate: 'Activar',
  stepActivateMeta: 'Si la prendes, aparece en Tienda. El chat sigue ahí.',
  next: 'Siguiente',
  back: 'Atrás',
  save: 'Guardar',
  test: 'Probar llaves',
  enable: 'Mostrar en tienda',
  modeSandbox: 'Sandbox',
  modeLive: 'Live',
  modeLabel: 'Ambiente',
  keepHint: 'En blanco se queda lo que ya guardaste.',
  emptyKeys: 'Elige una pasarela en el paso anterior.',
  saveOk: 'Quedó guardado.',
  testNeedSave: 'Guarda primero, y después prueba.',
  lockedLead: 'Entra con la clave de operadora para armar la pasarela.',
  enter: 'Entrar',
  unlockFail: 'Esa clave no entra.',
  kitCta: 'Ver componentes',
  humanLockTitle: 'WhatsApp y correo',
  humanLockCopy: 'Siempre prendidos. La pasarela se suma, no los reemplaza.',
} as const

export const PAYMENT_CATALOG: readonly GatewayCatalogItem[] = [
  {
    id: PAYMENT_PROVIDER.WOMPI,
    title: 'Wompi',
    copy: 'Tarjeta, Nequi y PSE por Bancolombia.',
    icon: 'W',
    fields: [
      { key: 'publicKey', label: 'Llave pública', hint: 'pub_test_… o pub_prod_…', required: true, secret: false },
      { key: 'privateKey', label: 'Llave privada', hint: 'prv_…', required: true, secret: true },
      { key: 'eventsSecret', label: 'Secreto de eventos', hint: 'Opcional, webhooks', required: false, secret: true },
      { key: 'integrityKey', label: 'Integrity', hint: 'Opcional, firma del checkout', required: false, secret: true },
    ],
  },
  {
    id: PAYMENT_PROVIDER.PSE,
    title: 'PSE',
    copy: 'Débito a cuenta colombiana (Place.to.pay / ACH).',
    icon: 'P',
    fields: [
      { key: 'login', label: 'Login', hint: 'Identificador del comercio', required: true, secret: false },
      { key: 'tranKey', label: 'TranKey', hint: 'Llave de transacción', required: true, secret: true },
      { key: 'merchantId', label: 'Comercio', hint: 'ID del comercio', required: true, secret: false },
    ],
  },
  {
    id: PAYMENT_PROVIDER.ADDI,
    title: 'Addi',
    copy: 'Cuotas en el checkout, sin tarjeta de crédito.',
    icon: 'A',
    fields: [
      { key: 'allySlug', label: 'Ally slug', hint: 'Identificador de aliado', required: true, secret: false },
      { key: 'apiKey', label: 'API key', hint: 'Llave de aplicación', required: true, secret: true },
      { key: 'secretKey', label: 'Secret', hint: 'Secreto de aplicación', required: true, secret: true },
    ],
  },
  {
    id: PAYMENT_PROVIDER.PAYU,
    title: 'PayU',
    copy: 'Pasarela clásica, todavía en muchos comercios.',
    icon: 'U',
    fields: [
      { key: 'merchantId', label: 'Merchant ID', hint: 'Comercio PayU', required: true, secret: false },
      { key: 'accountId', label: 'Account ID', hint: 'Cuenta de cobro', required: true, secret: false },
      { key: 'apiKey', label: 'API key', hint: 'Llave de integración', required: true, secret: true },
      { key: 'apiLogin', label: 'API login', hint: 'Usuario técnico', required: true, secret: true },
    ],
  },
  {
    id: PAYMENT_PROVIDER.EPAYCO,
    title: 'ePayco',
    copy: 'Tarjeta, PSE y efectivo en un solo panel.',
    icon: 'E',
    fields: [
      { key: 'publicKey', label: 'Llave pública', hint: 'public_…', required: true, secret: false },
      { key: 'privateKey', label: 'Llave privada', hint: 'private_…', required: true, secret: true },
    ],
  },
  {
    id: PAYMENT_PROVIDER.BOLD,
    title: 'Bold',
    copy: 'Datáfono y link de pago, pensado para oficio chico.',
    icon: 'B',
    fields: [
      { key: 'apiKey', label: 'API key', hint: 'Llave de Bold', required: true, secret: true },
    ],
  },
  {
    id: PAYMENT_PROVIDER.MERCADOPAGO,
    title: 'Mercado Pago',
    copy: 'Checkout Pro / API. Útil si ya tienes cuenta.',
    icon: 'M',
    fields: [
      { key: 'publicKey', label: 'Llave pública', hint: 'APP_USR o TEST', required: true, secret: false },
      { key: 'accessToken', label: 'Access token', hint: 'No se muestra de nuevo', required: true, secret: true },
    ],
  },
]

export const PAYMENT_API_MESSAGES = {
  PARSE_FAIL: 'La API devolvió un cobro que no se entiende.',
  SAVE_FAIL: 'No se pudo guardar la pasarela.',
  TEST_FAIL: 'No se pudo probar la pasarela.',
} as const

export function paymentCatalogItem(id: string): GatewayCatalogItem | undefined {
  return PAYMENT_CATALOG.find((item) => item.id === id)
}
