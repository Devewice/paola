import type { JoinChannel } from '@modules/club/domain/entities/JoinChannel.ts'
import { JOIN_COPY, JOIN_WHATSAPP_TEXT } from '@modules/club/constants/copy.ts'

const GROUP_HOST = 'chat.whatsapp.com'

/** Con grupo publicado, Únete abre el grupo; si es un chat directo, lleva un mensaje listo. */
export function buildJoinChannel(whatsappHref: string): JoinChannel {
  const base = whatsappHref.split('?')[0] ?? whatsappHref
  return {
    href: base.includes(GROUP_HOST) ? base : `${base}?text=${encodeURIComponent(JOIN_WHATSAPP_TEXT)}`,
    cta: JOIN_COPY.cta,
    title: JOIN_COPY.title,
    copy: JOIN_COPY.copy,
  }
}
