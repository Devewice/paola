import { MASCOT } from '@shared/ui/mascot.ts'

export const HOME_JOIN_LABEL = 'Grupo de WhatsApp'

export const HOME_FIGURES = {
  TIP: MASCOT.EN_PIE,
  MEMORY: MASCOT.LENTE,
  PAOLA: '/kit-assets/paola-hero.png',
  /** Ocupa el cuadro del panel del hero cuando la salida aún no tiene foto. */
  PANEL_FALLBACK: '/kit-assets/paola-moto.png',
  PULSE: MASCOT.X5,
} as const

export const HOME_LOGO_SRC = '/logo.png'
export const HOME_PULSE_COPY = {
  kicker: 'Del parche',
  heading: 'El parche en vivo',
  lead: 'Lo último que publicó el parche en el feed. Si es urgente, mejor por el grupo de WhatsApp.',
  emptyTitle: 'El muro está quieto',
  empty: 'Todavía nadie ha subido nada. Sé el primero en contar cómo te fue en la última rodada.',
  cta: 'Ver todo el feed',
  emptyCta: 'Contar mi rodada',
} as const

export const HOME_BOARD_COPY = {
  kicker: 'por el parche',
  tagline: 'La próxima rodada, los kilómetros y un recorte del parche.',
  splashPhrase: 'Nuestra voz importa',
  motto: 'No importa el CC · Aprendamos · Compartamos · Seguridad en la vía',
  scrollLabel: 'Ver más',
  panelLabel: 'Hoy',
  panelEmptyMedia: 'La foto sale con la próxima rodada.',
  panelEmptyTitle: 'Sin fecha',
  splashSoon: 'Pronto',
  nextCta: 'Parchese aquí',
  stamp: '¡Nos vemos en la ruta!',

  nextKicker: 'Próxima salida',
  nextSpotsLabel: 'cupos libres',
  nextNoCapacity: 'Sin límite de cupo',
  nextCtaDetail: 'Ver cupo y ruta',
  nextEmptyTitle: 'Sin fecha por ahora',
  nextEmptyLead: 'La próxima la anuncio primero en el grupo. Únete y te aviso apenas haya ruta.',
  nextLastPrefix: 'La última fue',
  nextAgendaCta: 'Ver agenda',

  voicesKicker: 'Tres voces',
  voicesTitle: 'Así habla el parche',
  voicesLead: 'Un consejo para la vía, una foto de ruta y algo de lo que vivo en la moto.',

  loigcaTitle: 'Tip de vía',
  loigcaEmpty: 'Pronto subo tips de vía, normas y comparendos. Mientras, date una vuelta por Tu voz.',
  loigcaCta: 'Ir a Tu voz',
  officialCta: 'Consulta oficial',

  incautaTitle: 'Memoria de ruta',
  incautaEmpty: 'Después de cada rodada, las fotos y los kilómetros quedan aquí.',
  incautaCta: 'Ver memorias',
  memoryPhotoLabel: 'Foto de la memoria',
  kmUnit: 'km',

  armarguraTitle: 'Desde la moto',
  paolaCite: 'Paola',
  paolaCta: 'Conóceme',
} as const
