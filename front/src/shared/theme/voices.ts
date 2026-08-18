/** Frases de tono (fase 1). Copy de voz, no tres fuentes. */
export const VOICE_TONES = {
  loigca: {
    name: 'Moto Loigca',
    phrase: 'Dato, cupo, porqué.',
  },
  incauta: {
    name: 'Cámara Incauta',
    phrase: 'Yo estuve ahí.',
  },
  armargura: {
    name: 'Paola Armargura',
    phrase: 'Nombro lo injusto.',
  },
} as const

export type VoiceId = keyof typeof VOICE_TONES
