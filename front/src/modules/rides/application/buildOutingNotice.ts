import type { Outing } from '@modules/rides/domain/entities/Outing.ts'
import type { OutingNotice, Ticket } from '@modules/rides/domain/entities/Ticket.ts'

export function buildOutingNotice(
  outing: Outing,
  ticket: Ticket,
  contact: { email: string; whatsappHref: string },
): OutingNotice {
  const moto = ticket.moto ? `, moto ${ticket.moto}` : ''
  const body = `Hola Paola, me apunto a ${outing.title} (${outing.date}). Soy ${ticket.name}, WhatsApp ${ticket.whatsapp}${moto}.`
  const base = contact.whatsappHref.split('?')[0] ?? contact.whatsappHref
  return {
    whatsappHref: `${base}?text=${encodeURIComponent(body)}`,
    mailtoHref: `mailto:${contact.email}?subject=${encodeURIComponent(`Cupo: ${outing.title}`)}&body=${encodeURIComponent(body)}`,
  }
}
