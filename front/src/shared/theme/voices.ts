/** Frases de tono (fase 1). Copy de voz, no tres fuentes. */
export const VOICE_TONES = {
  loigca: {
    name: 'Respeta la carretera',
    phrase: 'Dato, cupo, porqué.',
  },
  incauta: {
    name: 'Vive el trayecto',
    phrase: 'Yo estuve ahí.',
  },
  armargura: {
    name: 'Rueda con propósito',
    phrase: 'Nombro lo injusto.',
  },
} as const

export type VoiceId = keyof typeof VOICE_TONES
