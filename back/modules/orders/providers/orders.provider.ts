import { getDb } from '../../../db/knex.js'
import { ORDERS_TABLES } from '../constants/orders.constants.js'
import type { ServiceOrder } from '../interfaces/orders.interface.js'
import { toServiceOrder } from '../schemas/orders.schema.js'

export async function findServiceTitle(serviceId: string): Promise<string | null> {
  const row = await getDb()(ORDERS_TABLES.SERVICES)
    .select('title')
    .where({ id: serviceId })
    .first()

  if (!row) return null
  return typeof row.title === 'string' ? row.title : String(row.title)
}

export async function insertOrder(order: ServiceOrder): Promise<void> {
  await getDb()(ORDERS_TABLES.ORDERS).insert({
    id: order.id,
    service_id: order.serviceId,
    item_title: order.itemTitle,
    size: order.size ?? null,
    delivery_zone: order.deliveryZone,
    customer_name: order.customerName,
    customer_whatsapp: order.customerWhatsapp,
    kind: order.kind,
    status: order.status,
    paid: order.paid,
  })
}

export async function listOperatorOrders(): Promise<ServiceOrder[]> {
  const rows = await getDb()(ORDERS_TABLES.ORDERS)
    .select(
      'id',
      'kind',
      'status',
      'service_id',
      'item_title',
      'size',
      'delivery_zone',
      'customer_name',
      'customer_whatsapp',
      'paid',
      'created_at',
    )
    .orderBy('created_at', 'desc')

  return rows.map((row) => toServiceOrder(row as Record<string, unknown>))
}

