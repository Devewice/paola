import type { Knex } from 'knex'
import { insertPoll } from '../../modules/polls/providers/polls.provider.js'
import { parsePollDraft } from '../../modules/polls/schemas/polls.schema.js'

const OLD_ID = 'motociclistas-educacion-vial'
const NEXT_ID = 'motociclistas-educacion-vial-v2'

const ONLY_BOGOTA = { question: 0, options: [0], mode: 'any' }

const YEARS = ['Menos de 1 año', '1–2 años', '3–5 años', '6–10 años', 'Más de 10 años']
const FREQUENCY = ['Nunca', 'Casi nunca', 'Algunas veces', 'Casi siempre', 'Siempre']
const AGREEMENT = [
  'Totalmente en desacuerdo',
  'En desacuerdo',
  'Ni de acuerdo ni en desacuerdo',
  'De acuerdo',
  'Totalmente de acuerdo',
]
const RELATION = ['Muy conflictiva', 'Conflictiva', 'Neutral', 'Buena', 'Muy buena']

const labels = (list: readonly string[]) => list.map((label) => ({ label }))
const coded = (list: readonly (readonly [string, string])[]) => list.map(([code, label]) => ({ code, label }))
const other = { label: 'Otro', isOther: true }

/**
 * Encuesta «Motociclistas» tal como está en el documento: el filtro va de portada sin número,
 * se respetan los números 1–21 (11 con incisos a–e, 13–17 como bloque de afirmaciones),
 * los encabezados de sección y la nota de la pregunta 8 tal cual.
 */
const SURVEY = {
  title: 'Encuesta – Motociclistas',
  description:
    'Objetivo: Identificar las experiencias y percepciones de los motociclistas frente a la educación vial y su relación con las prácticas sociales de movilidad.',
  audience: 'public',
  status: 'open',
  featured: false,
  questions: [
    {
      kind: 'single',
      display: 'gate',
      prompt: '¿Se moviliza en motocicleta en Bogotá?',
      help: 'Filtro de entrada (no cuenta como pregunta): aplicar solo a motociclistas que se movilizan en Bogotá.',
      required: true,
      options: labels(['Sí', 'No']),
    },
    {
      kind: 'single',
      code: '1',
      section: 'Caracterización del motociclista',
      prompt: '¿Cuál es su edad?',
      required: true,
      showIf: ONLY_BOGOTA,
      options: labels(['18–20', '21–25', '26–30', '31–35', '36–40', '41–50', '51 o más']),
    },
    {
      kind: 'single',
      code: '2',
      prompt: '¿Con cuál género se identifica?',
      required: true,
      showIf: ONLY_BOGOTA,
      options: labels(['Femenino', 'Masculino', 'No binario', 'Otro']),
    },
    {
      kind: 'single',
      code: '3',
      prompt: '¿Cuál es su ocupación principal?',
      required: true,
      showIf: ONLY_BOGOTA,
      options: [
        ...labels([
          'Estudiante',
          'Empleado/a',
          'Independiente',
          'Trabajo relacionado con plataformas de transporte o domicilios',
          'Desempleado/a',
        ]),
        other,
      ],
    },
    {
      kind: 'single',
      code: '4',
      prompt: '¿Hace cuánto tiempo conduce motocicleta?',
      required: true,
      showIf: ONLY_BOGOTA,
      options: labels(YEARS),
    },
    {
      kind: 'single',
      code: '5',
      prompt: '¿Hace cuánto tiempo obtuvo su licencia de motocicleta?',
      required: true,
      showIf: ONLY_BOGOTA,
      options: labels(YEARS),
    },
    {
      kind: 'single',
      code: '6',
      prompt: '¿Con qué frecuencia utiliza la motocicleta?',
      required: true,
      showIf: ONLY_BOGOTA,
      options: labels([
        'Todos los días',
        '4–6 días a la semana',
        '2–3 días a la semana',
        'Una vez a la semana',
        'Ocasionalmente',
      ]),
    },
    {
      kind: 'single',
      code: '7',
      prompt: '¿Cuál es el principal uso que le da a la motocicleta?',
      required: true,
      showIf: ONLY_BOGOTA,
      options: [
        ...labels([
          'Transporte personal',
          'Trabajo',
          'Domicilios o plataformas',
          'Transporte hacia/desde el lugar de estudio',
          'Recreación/rodadas',
          'Transporte familiar',
        ]),
        other,
      ],
    },
    {
      kind: 'multiple',
      code: '8',
      section: 'Trayectoria en educación vial',
      prompt: '¿Dónde recibió principalmente formación en educación vial?',
      help: 'Puede seleccionar varias. (Si marca "ninguna", pasar a la pregunta 9.)',
      required: true,
      showIf: ONLY_BOGOTA,
      options: [
        ...labels([
          'Colegio',
          'Universidad/institución educativa',
          'Centro de Enseñanza Automovilística (CEA)',
          'Cursos o capacitaciones',
          'Campañas de entidades públicas',
          'Familia',
          'Amigos/compañeros',
          'Experiencia propia como motociclista',
          'Redes sociales/internet',
        ]),
        other,
        { label: 'No recibí ninguna formación', exclusive: true },
      ],
    },
    {
      kind: 'multiple',
      code: '9',
      prompt: '¿Qué contenidos recuerda haber recibido durante su formación como motociclista?',
      help: 'Puede seleccionar varias.',
      required: true,
      showIf: ONLY_BOGOTA,
      options: [
        ...labels([
          'Normas de tránsito',
          'Señales de tránsito',
          'Manejo y control de la motocicleta',
          'Prevención de siniestros',
          'Percepción y manejo del riesgo',
          'Uso de elementos de protección',
          'Convivencia con otros actores viales',
          'Responsabilidad frente a otros',
          'Comportamiento de peatones y otros conductores',
          'Primeros auxilios/actuación ante un siniestro',
        ]),
        other,
        { label: 'No recuerda', exclusive: true },
      ],
    },
    {
      kind: 'multiple',
      code: '10',
      prompt: '¿Qué aspectos considera que deberían tener mayor importancia en la formación de los motociclistas?',
      help: 'Máximo tres.',
      required: true,
      maxChoices: 3,
      showIf: ONLY_BOGOTA,
      options: [
        ...labels([
          'Normas de tránsito',
          'Manejo defensivo/preventivo',
          'Percepción del riesgo',
          'Convivencia vial',
          'Respeto hacia otros actores',
          'Toma de decisiones',
          'Manejo de situaciones reales',
          'Control emocional',
          'Consecuencias de los siniestros viales',
          'Primeros auxilios',
          'Responsabilidad social',
        ]),
        other,
      ],
    },
    {
      kind: 'grid',
      code: '11',
      tone: 'track',
      prompt: '¿Con qué frecuencia usted…?',
      required: true,
      showIf: ONLY_BOGOTA,
      rows: coded([
        ['a', 'Respeta los límites de velocidad establecidos'],
        ['b', 'Utiliza los elementos de protección requeridos'],
        ['c', 'Mantiene una distancia adecuada con otros vehículos'],
        ['d', 'Reduce la velocidad ante situaciones que percibe como riesgosas'],
        ['e', 'Realiza maniobras que considera riesgosas para avanzar más rápido'],
      ]),
      options: labels(FREQUENCY),
    },
    {
      kind: 'multiple',
      code: '12',
      section: 'Percepción de riesgo',
      prompt: 'Cuando conduce motocicleta, ¿qué situaciones considera que representan mayor riesgo para usted?',
      help: 'Máximo cinco.',
      required: true,
      maxChoices: 5,
      showIf: ONLY_BOGOTA,
      options: [
        ...labels([
          'Exceso de velocidad',
          'Mal estado de las vías',
          'Comportamiento de otros conductores',
          'Comportamiento de otros motociclistas',
          'Peatones',
          'Ciclistas',
          'Falta de señalización',
          'Condiciones climáticas',
          'Tráfico/congestión',
          'Distracciones',
          'Conducir bajo presión de tiempo',
          'Fatiga',
          'Falta de experiencia',
          'Falta de formación',
        ]),
        other,
      ],
    },
    {
      kind: 'grid',
      tone: 'faces',
      section: '3. Educación vial y prácticas de movilidad',
      prompt: 'Indique qué tan de acuerdo está con cada afirmación:',
      required: true,
      showIf: ONLY_BOGOTA,
      rows: coded([
        ['13', 'La educación vial me ha ayudado a identificar situaciones de riesgo'],
        ['14', 'La educación vial ha influido en la manera en que me relaciono con otros actores viales'],
        ['15', 'Lo aprendido durante mi formación sigue presente en mi manera cotidiana de movilizarme'],
        [
          '16',
          'Muchas de mis prácticas actuales las aprendí con la experiencia cotidiana, fuera de los espacios formales de educación vial',
        ],
        [
          '17',
          'Lo que se enseña en la formación de los motociclistas no siempre corresponde con las situaciones que se presentan en la vía',
        ],
      ]),
      options: labels(AGREEMENT),
    },
    {
      kind: 'grid',
      code: '18',
      tone: 'faces',
      prompt: '¿Cómo describiría su relación cotidiana con los siguientes actores viales?',
      required: true,
      showIf: ONLY_BOGOTA,
      rows: ['Peatones', 'Otros motociclistas', 'Conductores de automóvil', 'Ciclistas', 'Transporte público'],
      options: labels(RELATION),
    },
    {
      kind: 'single',
      code: '19',
      prompt: '¿Qué considera que genera principalmente conflictos entre motociclistas y otros actores viales?',
      required: true,
      showIf: ONLY_BOGOTA,
      options: [
        ...labels([
          'Falta de respeto por las normas',
          'Falta de comunicación/señalización',
          'Percepción de que algunos actores tienen prioridad',
          'Maniobras peligrosas',
          'Intolerancia',
          'Falta de conocimiento sobre las normas',
          'Falta de consideración hacia otros actores',
          'Condiciones de la vía',
          'Congestión',
        ]),
        other,
      ],
    },
    {
      kind: 'text',
      code: '20',
      section: '4. Preguntas abiertas',
      prompt:
        'Desde su experiencia como motociclista, ¿qué considera que debería enseñarse en educación vial y actualmente no se enseña o no se aborda lo suficiente?',
      required: false,
      showIf: ONLY_BOGOTA,
    },
    {
      kind: 'text',
      code: '21',
      prompt: 'Si pudiera cambiar algo de la manera en que se forma actualmente a los motociclistas, ¿qué cambiaría y por qué?',
      required: false,
      showIf: ONLY_BOGOTA,
    },
  ],
}

/** Si la versión anterior ya tiene respuestas se cierra y se publica aparte; si no, se reemplaza. */
export async function up(knex: Knex): Promise<void> {
  if (await knex('polls').where({ id: NEXT_ID }).first('id')) return
  const draft = parsePollDraft(SURVEY)
  if (!draft.ok) throw new Error(`Encuesta motociclistas: ${draft.detail}`)

  const old = await knex('polls').where({ id: OLD_ID }).first('id')
  const answered = old ? await knex('poll_responses').where({ poll_id: OLD_ID }).first('id') : undefined

  if (answered) {
    await knex('polls').where({ id: OLD_ID }).update({ status: 'closed' })
    await insertPoll(draft.value, { db: knex, id: NEXT_ID })
    return
  }
  if (old) await knex('polls').where({ id: OLD_ID }).delete()
  await insertPoll(draft.value, { db: knex, id: OLD_ID })
}

export async function down(knex: Knex): Promise<void> {
  if (await knex('polls').where({ id: NEXT_ID }).first('id')) {
    await knex('polls').where({ id: NEXT_ID }).delete()
    await knex('polls').where({ id: OLD_ID }).update({ status: 'open' })
    return
  }
  await knex('polls').where({ id: OLD_ID }).delete()
}
