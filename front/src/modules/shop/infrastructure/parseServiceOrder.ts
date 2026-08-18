import type { ServiceOrder } from '@modules/shop/domain/entities/ServiceOrder.ts'

export function parseServiceOrder(raw: unknown): ServiceOrder | null {
  if (!raw || typeof raw !== 'object') return null
  const row = raw as Record<string, unknown>

  if (typeof row.id !== 'string' || !row.id) return null
  if (typeof row.kind !== 'string' || !row.kind) return null
  if (typeof row.status !== 'string' || !row.status) return null
  if (typeof row.serviceId !== 'string' || !row.serviceId) return null
  if (typeof row.itemTitle !== 'string' || !row.itemTitle) return null
  if (typeof row.deliveryZone !== 'string' || !row.deliveryZone) return null
  if (typeof row.customerName !== 'string' || !row.customerName) return null
  if (typeof row.customerWhatsapp !== 'string' || !row.customerWhatsapp) return null

  const size = typeof row.size === 'string' ? row.size.trim() || undefined : undefined
  const paid = typeof row.paid === 'boolean' ? row.paid : false
  if (typeof row.createdAt !== 'string' || !row.createdAt) return null

  return {
    id: row.id,
    kind: row.kind as ServiceOrder['kind'],
    status: row.status as ServiceOrder['status'],
    serviceId: row.serviceId,
    itemTitle: row.itemTitle,
    size,
    deliveryZone: row.deliveryZone as ServiceOrder['deliveryZone'],
    customerName: row.customerName,
    customerWhatsapp: row.customerWhatsapp,
    paid,
    createdAt: row.createdAt,
  }
}

export function parseServiceOrderList(raw: unknown): readonly ServiceOrder[] {
  if (!raw || typeof raw !== 'object') return []
  const body = raw as Record<string, unknown>
  const ordersRaw = body.orders
  if (!Array.isArray(ordersRaw)) return []
  return ordersRaw.map(parseServiceOrder).filter((item): item is ServiceOrder => item !== null)
}

