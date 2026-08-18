import { optionalText } from '../../../shared/text.js'
import { fail } from '../../../http/fail.js'
import { HTTP_STATUS } from '../../../http/constants.js'
import type { CreateOrderDto } from '../dtos/orders.dto.js'
import type { EnquiryOrderDeliveryZone, ServiceOrder } from '../interfaces/orders.interface.js'
import { ORDERS_DELIVERY_ZONES, ORDERS_LIMITS, ORDERS_MESSAGES } from '../constants/orders.constants.js'

const WHATSAPP_NON_DIGIT = /\D/g

const DELIVERY_ZONES_SET = new Set<string>(ORDERS_DELIVERY_ZONES)

export function parseCreateOrder(draft: Record<string, unknown>): { ok: true; value: CreateOrderDto } | { ok: false; status: number; detail: string } {
  if (draft.privacyAccepted !== true) {
    return fail(HTTP_STATUS.BAD_REQUEST, ORDERS_MESSAGES.PRIVACY_REQUIRED)
  }
  const serviceId = String(draft.serviceId ?? '').trim()
  const size = optionalText(draft.size)
  const deliveryZone = String(draft.deliveryZone ?? '').trim()
  const customerName = String(draft.customerName ?? '').trim()
  const customerWhatsappRaw = String(draft.customerWhatsapp ?? '').trim()

  const customerWhatsapp = customerWhatsappRaw.replace(WHATSAPP_NON_DIGIT, '')

  if (!serviceId) {
    return fail(HTTP_STATUS.NOT_FOUND, ORDERS_MESSAGES.SERVICE_NOT_FOUND)
  }
  if (customerName.length < ORDERS_LIMITS.CUSTOMER_NAME_MIN || customerName.length > ORDERS_LIMITS.CUSTOMER_NAME_MAX) {
    return fail(HTTP_STATUS.BAD_REQUEST, ORDERS_MESSAGES.CUSTOMER_NAME_REQUIRED)
  }

  if (
    customerWhatsapp.length < ORDERS_LIMITS.CUSTOMER_WHATSAPP_MIN ||
    customerWhatsapp.length > ORDERS_LIMITS.CUSTOMER_WHATSAPP_MAX
  ) {
    return fail(HTTP_STATUS.BAD_REQUEST, ORDERS_MESSAGES.CUSTOMER_WHATSAPP_INVALID)
  }

  if (!DELIVERY_ZONES_SET.has(deliveryZone)) {
    return fail(HTTP_STATUS.BAD_REQUEST, ORDERS_MESSAGES.DELIVERY_ZONE_INVALID)
  }

  return {
    ok: true,
    value: {
      serviceId,
      size,
      deliveryZone: deliveryZone as EnquiryOrderDeliveryZone,
      customerName,
      customerWhatsapp,
    },
  }
}

export function toServiceOrder(row: Record<string, unknown>): ServiceOrder {
  return {
    id: String(row.id),
    kind: (String(row.kind) as ServiceOrder['kind']) ?? 'lavado',
    status: (String(row.status) as ServiceOrder['status']) ?? 'pendiente',

    serviceId: String(row.service_id),
    itemTitle: String(row.item_title),
    size: optionalText(row.size),

    deliveryZone: String(row.delivery_zone) as EnquiryOrderDeliveryZone,

    customerName: String(row.customer_name),
    customerWhatsapp: String(row.customer_whatsapp),

    paid: Boolean(row.paid),
    createdAt: String(row.created_at),
  }
}

