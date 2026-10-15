import type { Poll } from '@modules/polls/index.ts'

const o = (prefix: string, labels: string[]) => labels.map((label, i) => ({ id: `${prefix}${i}`, label }))
const always = { questionId: 'f', optionIds: ['f0'], mode: 'any' as const }

export const PREVIEW_POLL: Poll = {
  id: 'preview',
  title: 'Encuesta – Motociclistas',
  description: 'Objetivo: Identificar las experiencias y percepciones de los motociclistas frente a la educación vial.',
  audience: 'public',
  status: 'open',
  featured: false,
  createdAt: '2026-10-15',
  isOpen: true,
  hasVoted: false,
  ridersOnly: false,
  isInscribed: false,
  questions: [
    { id: 'f', kind: 'single', display: 'gate', prompt: '¿Se moviliza en motocicleta en Bogotá?', required: true, options: o('f', ['Sí', 'No']) },
    { id: 'q1', code: '1', section: '3. Educación vial y prácticas de movilidad', kind: 'single', prompt: '¿Cuál es su edad?', required: true, showIf: always, options: o('a', ['18–20', '21–25', '26–30', '31–35']) },
    { id: 'q2', code: '2', kind: 'single', prompt: '¿Con cuál género se identifica?', required: true, showIf: always, options: o('b', ['Femenino', 'Masculino', 'No binario', 'Otro']) },
  ],
}
