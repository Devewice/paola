import type { ServiceOrder, ServiceOrderDeliveryZone } from '@modules/shop/domain/entities/ServiceOrder.ts'
import { SHOP_SERVICE_WARRANTY_COPY, SHOP_SERVICE_ZONE_COPY } from '@modules/shop/constants/copy.ts'

function deliveryZoneText(zone: ServiceOrderDeliveryZone): string {
  if (zone === 'bogota') return 'Bogotá'
  if (zone === 'soacha') return 'Soacha'
  return 'Fuera'
}

export function buildOrderWhatsAppHref(
  order: ServiceOrder,
  contactWhatsAppHref: string,
): string {
  const base = contactWhatsAppHref.split('?')[0] ?? contactWhatsAppHref

  const zoneText = deliveryZoneText(order.deliveryZone)
  const sizeLine = order.size ? `Talla: ${order.size}` : 'Talla: (no aplica)'

  const body = [
    `Hola Paola, llegó un pedido por tu WhatsApp.`,
    ``,
    `Pedido #${order.id}`,
    `Ítem: ${order.itemTitle}`,
    sizeLine,
    `Ciudad: ${zoneText}`,
    ``,
    order.deliveryZone === 'fuera' ? 'Entrega: Fuera de Bogotá/Soacha: aún no.' : 'Entrega: gratis en Bogotá y Soacha.',
    `Garantía/Reglas: ${SHOP_SERVICE_WARRANTY_COPY}`,
    `Entrega/Zona: ${SHOP_SERVICE_ZONE_COPY}`,
  ].join('\n')

  return `${base}?text=${encodeURIComponent(body)}`
}

