export const ACCOUNT_ROUTES = {
  PROFILE: '/api/me/profile',
  MOTORCYCLES: '/api/me/motorcycles',
  MOTORCYCLE_DELETE: '/api/me/motorcycles/:id/delete',
  MOTORCYCLE_PRIMARY: '/api/me/motorcycles/:id/primary',
  SAFETY: '/api/me/safety',
  CATALOG: '/api/motorcycles/catalog',
} as const

export const ACCOUNT_TABLES = {
  USERS: 'users',
  SESSIONS: 'sessions',
  CATALOG: 'motorcycle_catalog',
  MOTORCYCLES: 'user_motorcycles',
} as const

export const ACCOUNT_LIMITS = {
  ALIAS_MIN: 2,
  ALIAS_MAX: 80,
  FULL_NAME_MAX: 120,
  WHATSAPP_MIN: 10,
  WHATSAPP_MAX: 15,
  BRAND_MAX: 80,
  MODEL_MAX: 120,
  CC_MIN: 49,
  CC_MAX: 2500,
  MOTORCYCLES_MAX: 10,
  MOTO_LABEL_MAX: 120,
  EMERGENCY_NAME_MIN: 2,
  EMERGENCY_NAME_MAX: 80,
  EMERGENCY_PHONE_MIN: 7,
  EMERGENCY_PHONE_MAX: 15,
  MEDICAL_NOTES_MAX: 200,
} as const

export const BLOOD_TYPES = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'] as const

export const WHATSAPP_NON_DIGIT = /\D/g

export const ACCOUNT_MESSAGES = {
  SESSION_REQUIRED: 'Sesión requerida.',
  SESSION_INVALID: 'Sesión inválida o vencida.',
  ALIAS_INVALID: 'El apodo necesita de 2 a 80 caracteres.',
  ALIAS_TAKEN: 'Ese apodo ya lo tiene otro parcero.',
  FULL_NAME_INVALID: 'El nombre es de máximo 120 caracteres.',
  WHATSAPP_INVALID: 'El WhatsApp necesita de 10 a 15 dígitos.',
  CATALOG_NOT_FOUND: 'Esa moto no está en la lista.',
  BRAND_REQUIRED: 'Escribe la marca.',
  MODEL_REQUIRED: 'Escribe el modelo.',
  CC_INVALID: 'El cilindraje va en números, de 49 a 2500 cc.',
  MOTORCYCLES_MAX: 'Máximo 10 motos por cuenta.',
  MOTORCYCLE_NOT_FOUND: 'Esa moto no está en tu cuenta.',
  EMERGENCY_NAME_INVALID: 'El contacto de emergencia necesita un nombre (2 a 80 caracteres).',
  EMERGENCY_PHONE_INVALID: 'El teléfono de emergencia va de 7 a 15 dígitos.',
  BLOOD_TYPE_INVALID: 'Elige un tipo de sangre de la lista.',
  MEDICAL_NOTES_INVALID: 'Las notas médicas son de máximo 200 caracteres.',
} as const
