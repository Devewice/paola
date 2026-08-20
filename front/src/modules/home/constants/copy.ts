export const HOME_JOIN_LABEL = 'Grupo de WhatsApp'

export const HOME_PULSE_COPY = {
  heading: 'El parche en vivo',
  lead: 'Lo que se comenta, se sube y se recuerda. Si algo quema, el grupo de WhatsApp.',
  empty: 'Aún no hay publicaciones en el feed.',
  cta: 'Ver todo el feed',
} as const

export const HOME_BOARD_COPY = {
  kicker: 'por el parche',
  tagline: 'La próxima rodada, los kilómetros y un recorte del parche.',
  splashPhrase: 'Nuestra voz importa',
  motto: 'No importa el CC · Aprendamos · Compartamos · Seguridad en la vía',
  scrollLabel: 'Ver más',
  panelLabel: 'Hoy',
  panelEmptyMedia: 'Aún no hay foto.',
  panelTitle: 'Rodada Anapoima :)',
  splashSoon: 'Pronto',
  nextCta: 'Parchese aquí',
  parcheseCta: 'Parchese',
  kmHeading: 'Kilómetros',
  kmLabel: 'Lo que hemos rodado',
  memoryHeading: 'Memoria',
  voiceHeading: 'Tu voz',
  voiceCta: 'Tips de vía',
  officialCta: 'Consulta oficial',
  paolaHeading: 'Paola',
  paolaCite: 'Paola',
  paolaCta: 'Conóceme',
  stamp: '¡Nos vemos en la ruta!',
  kpiRodadas: 'rodadas',
  kpiKm: 'km acumulados',
  kpiIntegrantes: 'integrantes',
  boardKicker: 'Del parche',
  boardTitle: 'Lo que sigue cuando bajas del hero',
  boardLead:
    'Próxima salida, kilómetros, memoria de ruta, tips de vía y la voz del parche. Todo en un vistazo.',
  nextHeading: 'Próxima salida',
  nextLead: 'Cupo, punto de encuentro y fecha. El detalle completo está en Parchese.',
  nextPhotoLabel: 'Foto de la rodada',
  nextCtaDetail: 'Ver cupo y ruta',
  memoryPhotoLabel: 'Foto de la memoria',
  shortcutsHeading: 'Entradas del portal',
  shortcutsLead: 'Las cinco pestañas del parche, sin perderte.',
  shortcutParchese: 'Parchese · rodadas',
  shortcutTienda: 'Tienda · equipo',
  shortcutVoz: 'Tu voz · tips y ley',
  shortcutFeed: 'Feed · comunidad',
} as const

export const HOME_SHORTCUTS = [
  { id: 'parchese', label: HOME_BOARD_COPY.shortcutParchese, to: '/parchese' as const },
  { id: 'tienda', label: HOME_BOARD_COPY.shortcutTienda, to: '/tienda' as const },
  { id: 'voz', label: HOME_BOARD_COPY.shortcutVoz, to: '/tu-voz' as const },
  { id: 'feed', label: HOME_BOARD_COPY.shortcutFeed, to: '/feed' as const },
] as const
