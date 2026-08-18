import type { AllianceList } from '@modules/club/domain/entities/Alliance.ts'
import type { JoinChannel } from '@modules/club/domain/entities/JoinChannel.ts'
import type { MemberList } from '@modules/club/domain/entities/Member.ts'
import type { ClubContentPort } from '@modules/club/domain/ports/ClubContentPort.ts'

/**
 * Contenido de fases 4–5. Sin aliados ni integrantes publicados.
 * Únete: WhatsApp de Paola hasta que exista invite de grupo.
 */
export class StaticClubContentRepository implements ClubContentPort {
  getAlliances(): AllianceList {
    return {
      items: [],
      emptyCopy:
        'Aún estamos armando el apoyo. Aquí van quienes bancan el parche cuando Paola los publique. No son productos de la tienda.',
    }
  }

  getJoinChannel(): JoinChannel {
    return {
      href: 'https://wa.me/573123136679?text=Quiero%20unirme%20al%20parche',
      cta: 'Únete',
      title: 'Únete',
      copy: 'El parche caliente vive en WhatsApp. El grupo aún no está publicado: escríbele a Paola y ella te mete.',
    }
  }

  getMembers(): MemberList {
    return {
      items: [],
      emptyCopy:
        'Nadie sale aquí sin haber dicho que sí. Hoy no hay fichas públicas: el parche vive, pero las caras se publican con consentimiento.',
    }
  }
}
