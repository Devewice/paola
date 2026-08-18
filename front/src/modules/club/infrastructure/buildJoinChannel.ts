import type { JoinChannel } from '@modules/club/domain/entities/JoinChannel.ts'
import { JOIN_COPY, JOIN_WHATSAPP_TEXT } from '@modules/club/constants/copy.ts'

/** Únete no es inventario: usa el WhatsApp de Paola hasta que exista grupo publicado. */
export function buildJoinChannel(whatsappHref: string): JoinChannel {
  const base = whatsappHref.split('?')[0] ?? whatsappHref
  return {
    href: `${base}?text=${encodeURIComponent(JOIN_WHATSAPP_TEXT)}`,
    cta: JOIN_COPY.cta,
    title: JOIN_COPY.title,
    copy: JOIN_COPY.copy,
  }
}
