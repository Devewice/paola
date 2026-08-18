import type { EnquiryOrderDeliveryZone } from '../interfaces/orders.interface.js'

export type CreateOrderDto = {
  readonly serviceId: string
  readonly size: string | undefined
  readonly deliveryZone: EnquiryOrderDeliveryZone
  readonly customerName: string
  readonly customerWhatsapp: string
}

