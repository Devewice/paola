export const TIPS_EMPTY_COPY = 'Aún no hay tips.'

export const FINES_EMPTY_COPY = 'Aún no hay guía de comparendos.'

export const REPORTS_EMPTY_COPY = 'Aún no hay reportes publicados.'

export const VOICE_HERO_PHOTO = '/kit-assets/paola-moto.png'

export const VOICE_COPY = {
  kicker: 'Moto Loigca',
  title: 'Tu voz',
  plate: 'Voz',
  lead: 'Tips de vía, comparendos y reportes del parche. Aquí no tramitamos comparendos ni damos asesoría jurídica.',
  heroCta: 'Dejar un reporte',
  navTips: 'Tips',
  navFines: 'Comparendos',
  navReports: 'Reportes',
  tipsHeading: 'Tips de vía',
  tipsLead: 'Cosas que conviene saber en la calle. Loigca habla claro, sin vueltas de abogado.',
  tipsEmpty: 'Sin tips por ahora. Cuando haya, quedan aquí.',
  tipsRailTitle: 'Cómo leer esto',
  tipsRailItems: [
    'Es orientación del parche, no un código de tránsito.',
    'Si hay enlace oficial, ábrelo y confirma ahí.',
    'WhatsApp sigue siendo el chat del día a día.',
  ],
  tipOfficial: 'Fuente oficial',
  finesHeading: 'Comparendos',
  finesLead: 'Solo educación: qué suele significar y por dónde consultar. Aquí no tramitamos ni representamos.',
  finesEmpty: 'Aún no hay guías. Cuando Paola publique, aparecen aquí.',
  finesOfficial: 'Consulta oficial',
  finesRailTitle: 'Antes de pagar o pelear',
  reportsHeading: 'Reportes del parche',
  reportsLead: 'Constancia comunitaria. No es denuncia penal. Sin linchamiento, menores ni doxxing.',
  publishedHeading: 'Publicados',
  publishedEmpty: 'Nada publicado aún. Lo que pase moderación sale aquí.',
  formHeading: 'Enviar a moderación',
  formLead: 'Cuenta qué pasó, dónde y cuándo. Yo reviso antes de que se vea en el parche.',
  formTitle: 'Título corto',
  formWhat: 'Qué pasó',
  formWhere: 'Dónde',
  formWhen: 'Cuándo',
  formEvidence: 'Enlace a evidencia (opcional)',
  sendCta: 'Enviar reporte',
  sendOk: 'Quedó en moderación. Si pasa, lo ves en publicados.',
  sendFail: 'No se pudo enviar el reporte.',
  statusPublished: 'Publicada',
  dualWa: 'El grupo del día a día. Este camino no se apaga.',
  dualWeb: 'Tips, guías y constancias quedan en la web del parche.',
  dualTitle: 'Dos canales',
  featuredKicker: 'Tip del momento',
  featuredEmpty: 'Pronto hay tip de vía aquí.',
} as const

export const VOICE_ADMIN_COPY = {
  tipTitle: 'Nuevo tip de vía',
  tipLead: 'Corto y claro. Si hay fuente oficial, pon el enlace.',
  tipFieldTitle: 'Título',
  tipFieldBody: 'Qué hay que saber',
  tipFieldHref: 'Enlace oficial (opcional)',
  tipCta: 'Publicar tip',
  tipOk: 'Tip publicado.',
  tipFail: 'No se pudo publicar el tip.',
  fineTitle: 'Nueva guía de comparendo',
  fineLead: 'Solo educación: qué significa y dónde consultar. El aviso legal es obligatorio.',
  fineFieldTitle: 'Comparendo',
  fineFieldGuide: 'Qué suele significar',
  fineFieldHref: 'Enlace de consulta oficial',
  fineFieldDisclaimer: 'Aviso',
  fineDisclaimerDefault: 'Orientación del parche. No es asesoría jurídica ni trámite oficial.',
  fineCta: 'Publicar guía',
  fineOk: 'Guía publicada.',
  fineFail: 'No se pudo publicar la guía.',
  reportsTitle: 'Reportes por moderar',
  reportsLead: 'Publica solo lo que sea constancia. Sin linchamiento, menores ni doxxing.',
  reportsEmpty: 'No hay reportes por revisar.',
  reportsLoadFail: 'No se pudieron cargar los reportes.',
  reportPublish: 'Publicar',
  reportHide: 'Ocultar',
  reportReject: 'Rechazar',
  reportOk: 'Reporte actualizado.',
  reportFail: 'No se pudo actualizar el reporte.',
  reportEvidence: 'Ver evidencia',
  statusLabels: {
    in_review: 'En revisión',
    published: 'Publicado',
    hidden: 'Oculto',
    rejected: 'Rechazado',
  },
} as const

export const VOICE_LIMITS = {
  TITLE_MIN: 2,
  BODY_MIN: 2,
} as const

export const VOICE_MESSAGES = {
  PRIVACY_REQUIRED: 'Necesitas leer el aviso de privacidad para continuar.',
  REPORT_INCOMPLETE: 'Cuenta qué pasó, dónde y cuándo.',
} as const
