export type EnquiryOrderDeliveryZone = 'bogota' | 'soacha' | 'fuera'

export type OrderKind = 'lavado' | 'producto' | 'evento'

export type OrderStatus = 'pendiente' | 'cancelado' | 'entregado'

export type ServiceOrder = {
  readonly id: string
  readonly kind: OrderKind
  readonly status: OrderStatus

  readonly serviceId: string
  readonly itemTitle: string
  readonly size: string | undefined

  readonly deliveryZone: EnquiryOrderDeliveryZone

  readonly customerName: string
  readonly customerWhatsapp: string

  readonly paid: boolean

  readonly createdAt: string
}

export type OperatorOrderRow = Pick<
  ServiceOrder,
  | 'id'
  | 'kind'
  | 'status'
  | 'serviceId'
  | 'itemTitle'
  | 'size'
  | 'deliveryZone'
  | 'customerName'
  | 'customerWhatsapp'
  | 'paid'
  | 'createdAt'
>

