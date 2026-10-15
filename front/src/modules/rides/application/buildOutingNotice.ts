import { RIDES_SIGNUP_COPY } from '@modules/rides/constants/copy.ts'
import type { Outing } from '@modules/rides/domain/entities/Outing.ts'
import type { OutingNotice, Ticket } from '@modules/rides/domain/entities/Ticket.ts'

type Contact = { email: string; whatsappHref: string }

export function buildOutingNotice(outing: Outing, ticket: Ticket, contact: Contact): OutingNotice {
  const moto = ticket.moto ? `, moto ${ticket.moto}` : ''
  const body = `Hola, me apunto a ${outing.title} (${outing.date}). Soy ${ticket.name}, WhatsApp ${ticket.whatsapp}${moto}.`
  return noticeLinks(outing, body, contact)
}

/** Aviso para quien ya está inscrito con su cuenta y vuelve a la página de la rodada. */
export function buildSignupNotice(outing: Outing, alias: string, contact: Contact): OutingNotice {
  return noticeLinks(outing, RIDES_SIGNUP_COPY.noticeBody(outing.title, outing.date, alias), contact)
}

function noticeLinks(outing: Outing, body: string, contact: Contact): OutingNotice {
  const base = contact.whatsappHref.split('?')[0] ?? contact.whatsappHref
  return {
    whatsappHref: `${base}?text=${encodeURIComponent(body)}`,
    mailtoHref: `mailto:${contact.email}?subject=${encodeURIComponent(`Cupo: ${outing.title}`)}&body=${encodeURIComponent(body)}`,
  }
}
