import type { JoinChannel } from '@modules/club/domain/entities/JoinChannel.ts'

/** Únete no es inventario: usa el WhatsApp de Paola hasta que exista grupo publicado. */
export function buildJoinChannel(whatsappHref: string): JoinChannel {
  const base = whatsappHref.split('?')[0] ?? whatsappHref
  return {
    href: `${base}?text=${encodeURIComponent('Quiero unirme al parche')}`,
    cta: 'Únete',
    title: 'Únete',
    copy: 'El parche caliente vive en WhatsApp. El grupo aún no está publicado: escríbele a Paola y ella te mete.',
  }
}
