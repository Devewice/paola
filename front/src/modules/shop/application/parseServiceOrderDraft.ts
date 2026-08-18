import { appError, type AppError } from '@core/errors/AppError.ts'
import { requirePrivacyNotice } from '@core/requirePrivacyNotice.ts'
import { err, ok, type Result } from '@core/result.ts'
import { ORDERS_DELIVERY_ZONES, ORDERS_LIMITS, ORDERS_MESSAGES, type OrderDeliveryZone } from '@modules/shop/constants/orders.constants.ts'
import type { ServiceOrderDeliveryZone, ServiceOrderDraft } from '@modules/shop/domain/entities/ServiceOrder.ts'

const WHATSAPP_NON_DIGIT = /\D/g

type UnknownDraft = Record<string, unknown>

export function parseServiceOrderDraft(draft: UnknownDraft): Result<ServiceOrderDraft, AppError> {
  const privacy = requirePrivacyNotice(draft.privacyAccepted, ORDERS_MESSAGES.PRIVACY_REQUIRED)
  if (!privacy.ok) return privacy

  const serviceId = String(draft.serviceId ?? '').trim()
  const sizeRaw = draft.size
  const size = typeof sizeRaw === 'string' ? sizeRaw.trim() || undefined : undefined
  const deliveryZoneRaw = String(draft.deliveryZone ?? '').trim()
  const customerName = String(draft.customerName ?? '').trim()
  const customerWhatsappRaw = String(draft.customerWhatsapp ?? '').trim()

  const customerWhatsapp = customerWhatsappRaw.replace(WHATSAPP_NON_DIGIT, '')

  const deliveryZone: OrderDeliveryZone | '' = ORDERS_DELIVERY_ZONES.includes(deliveryZoneRaw as OrderDeliveryZone)
    ? (deliveryZoneRaw as OrderDeliveryZone)
    : ''

  if (!serviceId) {
    return err(appError('VALIDATION', ORDERS_MESSAGES.SERVICE_REQUIRED))
  }

  if (customerName.length < ORDERS_LIMITS.CUSTOMER_NAME_MIN || customerName.length > ORDERS_LIMITS.CUSTOMER_NAME_MAX) {
    return err(appError('VALIDATION', ORDERS_MESSAGES.CUSTOMER_NAME_REQUIRED))
  }

  if (
    customerWhatsapp.length < ORDERS_LIMITS.CUSTOMER_WHATSAPP_MIN ||
    customerWhatsapp.length > ORDERS_LIMITS.CUSTOMER_WHATSAPP_MAX
  ) {
    return err(appError('VALIDATION', ORDERS_MESSAGES.CUSTOMER_WHATSAPP_INVALID))
  }

  if (!deliveryZone) {
    return err(appError('VALIDATION', ORDERS_MESSAGES.DELIVERY_ZONE_INVALID))
  }

  const orderDraft: ServiceOrderDraft = {
    serviceId,
    size,
    deliveryZone: deliveryZone as ServiceOrderDeliveryZone,
    customerName,
    customerWhatsapp,
    privacyAccepted: true,
  }

  return ok(orderDraft)
}

