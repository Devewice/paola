import { describe, expect, it } from 'vitest'
import { buildPollDraft, emptyPollForm, emptyQuestion } from '@modules/polls/application/buildPollDraft.ts'

describe('buildPollDraft', () => {
  it('exige título', () => {
    const result = buildPollDraft(emptyPollForm())
    expect(result.ok).toBe(false)
  })

  it('pide dos opciones con texto en preguntas de elegir', () => {
    const form = emptyPollForm()
    form.title = '¿Próxima ruta?'
    form.questions[0] = { ...emptyQuestion(), prompt: '¿A dónde?' }
    form.questions[0].options[0]!.label = 'Anapoima'
    const result = buildPollDraft(form)
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error.message).toContain('pregunta 1')
  })

  it('valida la escala', () => {
    const form = emptyPollForm()
    form.title = 'Califica'
    form.questions = [{ ...emptyQuestion('scale'), prompt: '¿Qué tal?', scaleMin: '5', scaleMax: '3' }]
    expect(buildPollDraft(form).ok).toBe(false)
  })

  it('limpia campos y descarta opciones vacías', () => {
    const form = emptyPollForm()
    form.title = '  ¿Próxima ruta?  '
    form.featured = true
    form.questions = [
      {
        ...emptyQuestion('multiple'),
        prompt: '¿A dónde?',
        maxChoices: '2',
        options: [
          { label: 'Anapoima', imageSrc: ' https://x/a.jpg ' },
          { label: '', imageSrc: '' },
          { label: 'La Vega', imageSrc: '' },
        ],
      },
      { ...emptyQuestion('text'), prompt: 'Cuéntame', required: false },
    ]
    const result = buildPollDraft(form)
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.value.title).toBe('¿Próxima ruta?')
    expect(result.value.outingId).toBeUndefined()
    expect(result.value.questions[0]).toEqual({
      kind: 'multiple',
      prompt: '¿A dónde?',
      help: undefined,
      required: true,
      maxChoices: 2,
      options: [
        { label: 'Anapoima', imageSrc: 'https://x/a.jpg' },
        { label: 'La Vega', imageSrc: undefined },
      ],
    })
    expect(result.value.questions[1]?.options).toEqual([])
  })
})
