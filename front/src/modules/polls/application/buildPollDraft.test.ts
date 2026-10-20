import { describe, expect, it } from 'vitest'
import { buildPollDraft, emptyPollForm, emptyQuestion, pollToForm } from '@modules/polls/application/buildPollDraft.ts'

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

  it('arma cuadrícula, «Otro», exclusiva y condición por posición', () => {
    const form = emptyPollForm()
    form.title = 'Educación vial'
    form.questions = [
      {
        ...emptyQuestion('single'),
        prompt: '¿Rodas en Bogotá?',
        section: ' Filtro ',
        options: [
          { label: 'Sí', imageSrc: '' },
          { label: 'No', imageSrc: '' },
        ],
      },
      {
        ...emptyQuestion('multiple'),
        prompt: '¿Dónde aprendiste?',
        showIfQuestion: '0',
        showIfOptions: [0],
        options: [
          { label: 'CEA', imageSrc: '' },
          { label: '', imageSrc: '' },
          { label: 'Otro', imageSrc: '', isOther: true },
          { label: 'Ninguna', imageSrc: '', exclusive: true },
        ],
      },
      {
        ...emptyQuestion('multiple'),
        prompt: '¿Qué recuerdas?',
        showIfQuestion: '1',
        showIfOptions: [3],
        showIfMode: 'none',
        options: [
          { label: 'Normas', imageSrc: '' },
          { label: 'Señales', imageSrc: '' },
        ],
      },
      {
        ...emptyQuestion('grid'),
        prompt: '¿Con qué frecuencia…?',
        rows: ['Respetas la velocidad', ' ', 'Usas casco'],
        options: [
          { label: 'Nunca', imageSrc: '' },
          { label: 'Siempre', imageSrc: '' },
        ],
      },
    ]
    const result = buildPollDraft(form)
    expect(result.ok).toBe(true)
    if (!result.ok) return
    const [filter, training, contents, grid] = result.value.questions
    expect(filter?.section).toBe('Filtro')
    expect(training?.showIf).toEqual({ question: 0, options: [0], mode: 'any' })
    expect(training?.options.map((option) => [option.label, option.isOther, option.exclusive])).toEqual([
      ['CEA', undefined, undefined],
      ['Otro', true, undefined],
      ['Ninguna', undefined, true],
    ])
    expect(contents?.showIf).toEqual({ question: 1, options: [2], mode: 'none' })
    expect(grid?.rows).toEqual([{ label: 'Respetas la velocidad' }, { label: 'Usas casco' }])
  })

  it('al editar conserva ids, condiciones y filas de la encuesta publicada', () => {
    const form = pollToForm({
      title: 'Educación vial',
      audience: 'public',
      status: 'open',
      featured: false,
      showResults: false,
      questions: [
        {
          id: 'q1',
          kind: 'single',
          prompt: '¿Rodas en Bogotá?',
          required: true,
          options: [
            { id: 'o1', label: 'Sí' },
            { id: 'o2', label: 'No' },
          ],
        },
        {
          id: 'q2',
          kind: 'grid',
          prompt: '¿Con qué frecuencia…?',
          required: true,
          options: [
            { id: 'c1', label: 'Nunca' },
            { id: 'c2', label: 'Siempre' },
          ],
          rows: [{ id: 'r1', label: 'Usas casco', code: 'a' }],
          showIf: { questionId: 'q1', optionIds: ['o2'], mode: 'any' },
        },
      ],
    })
    form.questions[0]!.options.push({ label: 'A veces', imageSrc: '' })
    const result = buildPollDraft(form)
    expect(result.ok).toBe(true)
    if (!result.ok) return
    const [first, second] = result.value.questions
    expect(result.value.showResults).toBe(false)
    expect(first?.id).toBe('q1')
    expect(first?.options.map((option) => option.id)).toEqual(['o1', 'o2', undefined])
    expect(second?.id).toBe('q2')
    expect(second?.showIf).toEqual({ question: 0, options: [1], mode: 'any' })
    expect(second?.rows).toEqual([{ id: 'r1', label: 'Usas casco', code: 'a' }])
  })

  it('rechaza condiciones hacia adelante o sobre preguntas sin opciones', () => {
    const form = emptyPollForm()
    form.title = 'Prueba'
    form.questions = [
      { ...emptyQuestion('text'), prompt: 'Cuéntame' },
      { ...emptyQuestion('text'), prompt: 'Otra', showIfQuestion: '0', showIfOptions: [0] },
    ]
    expect(buildPollDraft(form).ok).toBe(false)
    form.questions = [{ ...emptyQuestion('text'), prompt: 'Sola', showIfQuestion: '0', showIfOptions: [0] }]
    expect(buildPollDraft(form).ok).toBe(false)
  })
})
