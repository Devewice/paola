export const ALLIANCES_EMPTY_COPY = 'Aún no hay aliados.'

export const MEMBERS_EMPTY_COPY = 'Aún no hay integrantes.'

export const JOIN_WHATSAPP_TEXT = 'Quiero unirme al parche'

export const JOIN_COPY = {
  cta: 'Únete al grupo',
  title: 'Únete',
  copy: 'Entra al grupo de WhatsApp: ahí salen primero las rodadas, el punto de encuentro y los cambios de última hora.',
} as const

export const CLUB_ROSTER_COPY = {
  rosterHeading: 'Así va el parche',
  rosterLead: 'Solo sale quien dio permiso. Sin WhatsApp ni correo a la vista.',
  rosterEmptyTitle: 'Todavía nadie',
  alliancesHeading: 'Quiénes apoyan',
  alliancesLead: 'Marcas y personas que apoyan al parche.',
  alliancesEmptyTitle: 'Sin aliados aún',
  allianceVisit: 'Visitar',
  rosterEmptyKicker: 'Cámara Incauta',
  rosterEmptySteps: [
    'Entras al grupo de WhatsApp.',
    'Ruedas una salida con nosotros.',
    'Si quieres, sales aquí con alias y moto.',
  ],
  alliancesEmptyKicker: 'Paola Armargura',
  alliancesEmptyLead: '¿Tienes taller, marca o tienda y quieres apoyar al parche? Escríbenos y lo hablamos.',
  alliancesEmptyCta: 'Escríbenos',
  alliancesEmptyHref: 'mailto:contacto@paolabiker.com',
} as const

export const CLUB_ADMIN_COPY = {
  memberTitle: 'Nuevo integrante',
  memberLead: 'Solo con permiso. Sin WhatsApp ni correo: alias, moto e Instagram si quiere.',
  fieldAlias: 'Alias',
  fieldMoto: 'Moto (opcional)',
  fieldInstagram: 'Instagram (opcional)',
  memberCta: 'Agregar integrante',
  memberOk: 'Integrante agregado.',
  memberFail: 'No se pudo agregar el integrante.',
  allianceTitle: 'Nueva alianza',
  allianceLead: 'Quien apoya al parche. Sale en Parchese y en el pie de página.',
  fieldName: 'Nombre',
  fieldSupport: 'Cómo apoya',
  fieldHref: 'Enlace (opcional)',
  allianceCta: 'Agregar alianza',
  allianceOk: 'Alianza agregada.',
  allianceFail: 'No se pudo agregar la alianza.',
  currentMembers: 'Integrantes',
  currentAlliances: 'Alianzas',
  none: 'Ninguno todavía.',
  tabMembers: 'Integrantes',
  tabAlliances: 'Alianzas',
  membersLead: 'Quienes salen en Parchese › El parche. Solo con su permiso.',
  alliancesLead: 'Quienes apoyan al parche. Salen en Parchese y en el pie de página.',
  newMember: 'Nuevo integrante',
  newAlliance: 'Nueva alianza',
  editMemberTitle: 'Editar integrante',
  editAllianceTitle: 'Editar alianza',
  save: 'Guardar cambios',
  cancel: 'Cancelar',
  edit: 'Editar',
  remove: 'Borrar',
  removeConfirm: '¿Borrar? Toca otra vez',
  memberSaved: 'Integrante actualizado.',
  allianceSaved: 'Alianza actualizada.',
  removed: 'Borrado.',
  removeFail: 'No se pudo borrar.',
} as const

export const CLUB_API_MESSAGES = {
  ALLIANCE_PARSE_FAIL: 'No pudimos leer la alianza. Recarga la página.',
  MEMBER_PARSE_FAIL: 'No pudimos leer el integrante. Recarga la página.',
} as const
