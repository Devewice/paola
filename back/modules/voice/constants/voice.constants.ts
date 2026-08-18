export const VOICE_TABLES = {
  TIPS: 'tips',
  FINES: 'fines',
  REPORTS: 'reports',
  LEGACY_COMPARENDOS: 'comparendos',
  LEGACY_DENUNCIAS: 'denuncias',
} as const

export const VOICE_ROUTES = {
  LIST: '/api/tips',
  LIST_FINES: '/api/fines',
  LIST_REPORTS: '/api/reports',
  CREATE_REPORT: '/api/reports',
  OPERAR_CREATE_TIP: '/api/operar/tips',
  OPERAR_CREATE_FINE: '/api/operar/fines',
  OPERAR_REPORT_STATUS: '/api/operar/reports/:id/status',
  LEGACY_LIST_COMPARENDOS: '/api/comparendos',
  LEGACY_LIST_DENUNCIAS: '/api/denuncias',
  LEGACY_CREATE_DENUNCIA: '/api/denuncias',
  LEGACY_OPERAR_CREATE_COMPARENDO: '/api/operar/comparendos',
  LEGACY_OPERAR_DENUNCIA_STATUS: '/api/operar/denuncias/:id/status',
} as const

export const VOICE_MESSAGES = {
  PRIVACY_REQUIRED: 'Necesitas leer el aviso de privacidad para continuar.',
  REPORT_INCOMPLETE: 'Report incompleto: qué, dónde y cuándo son obligatorios.',
} as const
