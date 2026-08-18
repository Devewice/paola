export const ORDERS_TABLES = {
  ORDERS: 'orders',
  SERVICES: 'services',
} as const

export const ORDERS_ROUTES = {
  CREATE: '/api/orders',
  OPERAR_LIST: '/api/operar/orders',
} as const

export const ORDERS_LIMITS = {
  CUSTOMER_NAME_MIN: 2,
  CUSTOMER_NAME_MAX: 120,
  CUSTOMER_WHATSAPP_MIN: 10,
  CUSTOMER_WHATSAPP_MAX: 15,
} as const

export const ORDERS_DELIVERY_ZONES = ['bogota', 'soacha', 'fuera'] as const

export const ORDERS_MESSAGES = {
  SERVICE_NOT_FOUND: 'Servicio no encontrado.',
  CUSTOMER_NAME_REQUIRED: 'Di tu nombre.',
  CUSTOMER_WHATSAPP_REQUIRED: 'WhatsApp requerido.',
  CUSTOMER_WHATSAPP_INVALID: 'WhatsApp inválido.',
  DELIVERY_ZONE_INVALID: 'Elige Bogotá, Soacha o Fuera.',
  PRIVACY_REQUIRED: 'Necesitas leer el aviso de privacidad para continuar.',
} as const

