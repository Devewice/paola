import type { AppError } from '@core/errors/AppError.ts'
import { ok, type Result } from '@core/result.ts'
import type { ServiceOrderApiPort } from '@modules/shop/domain/ports/ServiceOrderApiPort.ts'
import type { ServiceOrder, ServiceOrderDraft } from '@modules/shop/domain/entities/ServiceOrder.ts'

type Contact = { readonly whatsappHref: string }

export class InMemoryServiceOrderApi implements ServiceOrderApiPort {
  private readonly orders: ServiceOrder[] = []
  private nextIdValue = 1

  private readonly contact: Contact

  constructor(contact: Contact) {
    this.contact = contact
  }

  async create(draft: ServiceOrderDraft): Promise<Result<{ order: ServiceOrder; notice: { whatsappHref: string } }, AppError>> {
    // Para desarrollo local sin back: guardamos y devolvemos un href "vacío".
    const order: ServiceOrder = {
      id: `mem-${this.nextIdValue++}`,
      kind: 'lavado',
      status: 'pendiente',
      serviceId: draft.serviceId,
      itemTitle: 'Lavado (memoria local)',
      size: draft.size,
      deliveryZone: draft.deliveryZone,
      customerName: draft.customerName,
      customerWhatsapp: draft.customerWhatsapp,
      paid: false,
      createdAt: new Date().toISOString(),
    }

    this.orders.unshift(order)
    return ok({
      order,
      notice: { whatsappHref: this.contact.whatsappHref },
    })
  }

  async listOperatorOrders(_clave: string): Promise<Result<readonly ServiceOrder[], AppError>> {
    return ok(this.orders)
  }
}

