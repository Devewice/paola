export type ServiceOrderDeliveryZone = 'bogota' | 'soacha' | 'fuera'

export type ServiceOrderStatus = 'pendiente' | 'cancelado' | 'entregado'

export type ServiceOrderKind = 'lavado'

export type ServiceOrder = {
  readonly id: string
  readonly kind: ServiceOrderKind
  readonly status: ServiceOrderStatus

  readonly serviceId: string
  readonly itemTitle: string
  readonly size: string | undefined
  readonly deliveryZone: ServiceOrderDeliveryZone

  readonly customerName: string
  readonly customerWhatsapp: string

  readonly paid: boolean
  readonly createdAt: string
}

export type ServiceOrderDraft = {
  readonly serviceId: string
  readonly size: string | undefined
  readonly deliveryZone: ServiceOrderDeliveryZone
  readonly customerName: string
  readonly customerWhatsapp: string
  readonly privacyAccepted: boolean
}

export type ServiceOrderNotice = {
  readonly whatsappHref: string
}

