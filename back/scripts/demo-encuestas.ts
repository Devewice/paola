/**
 * Encuestas de ejemplo para probar votación y resultados.
 * No es migración: corre a mano y luego quítalas.
 *
 *   npm run demo:encuestas
 *   npm run demo:encuestas:quitar
 */
import { destroyDb, getDb } from '../db/knex.js'
import { POLL_TABLES } from '../modules/polls/constants/polls.constants.js'
import { insertPoll } from '../modules/polls/providers/polls.provider.js'
import { RIDES_TABLES } from '../modules/rides/constants/rides.constants.js'
import { parsePollDraft } from '../modules/polls/schemas/polls.schema.js'

const DEMO_MARK = '[demo]'

function demoDrafts(outingId: string | undefined): Record<string, unknown>[] {
  const drafts: Record<string, unknown>[] = [
    {
      title: '¿Para dónde rodamos en noviembre?',
      description: `Vota y armamos la ruta con lo que diga el parche. ${DEMO_MARK}`,
      audience: 'public',
      status: 'open',
      featured: true,
      questions: [
        {
          kind: 'single',
          prompt: 'Elige el destino',
          required: true,
          options: [
            { label: 'Anapoima', imageSrc: '/kit-assets/Rodada anapoimap.png' },
            { label: 'La Calera', imageSrc: '/kit-assets/Primera rodada.webp' },
            { label: 'Sopó', imageSrc: '/kit-assets/paola-moto.png' },
          ],
        },
        {
          kind: 'ranking',
          prompt: 'Ordena lo que más te importa en una rodada',
          required: true,
          options: [{ label: 'Paisaje' }, { label: 'Comida en ruta' }, { label: 'Vía en buen estado' }, { label: 'Ritmo tranquilo' }],
        },
        {
          kind: 'multiple',
          prompt: '¿Qué días te sirven?',
          required: false,
          maxChoices: 2,
          options: [{ label: 'Sábado' }, { label: 'Domingo' }, { label: 'Festivo' }],
        },
        {
          kind: 'scale',
          prompt: '¿Qué tan lejos te le mides?',
          required: true,
          scaleMin: 1,
          scaleMax: 5,
          scaleMinLabel: 'Cerquita',
          scaleMaxLabel: 'Todo el día',
        },
        {
          kind: 'text',
          prompt: '¿Alguna parada que no nos podamos perder?',
          required: false,
        },
      ],
    },
    {
      title: 'Nueva camiseta del parche',
      description: `Solo con cuenta, para que el voto quede a tu nombre. ${DEMO_MARK}`,
      audience: 'account',
      status: 'open',
      featured: false,
      questions: [
        {
          kind: 'single',
          prompt: '¿Qué color prefieres?',
          required: true,
          options: [{ label: 'Negra' }, { label: 'Azul navy' }, { label: 'Blanca' }],
        },
      ],
    },
  ]
  if (outingId) {
    drafts.push({
      title: '¿A qué hora salimos?',
      description: `Para la próxima rodada. ${DEMO_MARK}`,
      audience: 'public',
      status: 'open',
      featured: false,
      outingId,
      questions: [
        {
          kind: 'single',
          prompt: 'Hora de salida',
          required: true,
          options: [{ label: '6:00 a. m.' }, { label: '7:00 a. m.' }, { label: '8:00 a. m.' }],
        },
      ],
    })
  }
  return drafts
}

async function removeDemoPolls(): Promise<number> {
  return getDb()(POLL_TABLES.POLLS).where('description', 'like', `%${DEMO_MARK}%`).del()
}

async function nextOutingId(): Promise<string | undefined> {
  const today = new Date().toISOString().slice(0, 10)
  const row = (await getDb()(RIDES_TABLES.OUTINGS).where('date', '>=', today).orderBy('date', 'asc').first('id')) as
    | { id: string }
    | undefined
  return row?.id
}

async function seedDemoPolls(): Promise<void> {
  await removeDemoPolls()
  const drafts = demoDrafts(await nextOutingId())
  console.log('Encuestas de ejemplo insertadas:')
  for (const raw of drafts) {
    const parsed = parsePollDraft(raw)
    if (!parsed.ok) throw new Error(parsed.detail)
    const id = await insertPoll(parsed.value)
    console.log(`  · ${parsed.value.title} (${id})`)
  }
}

async function main(): Promise<void> {
  const mode = process.argv[2]?.toLowerCase()

  if (mode === 'quitar' || mode === 'down' || mode === 'remove') {
    const deleted = await removeDemoPolls()
    console.log(deleted ? `Listo: ${deleted} encuesta(s) de ejemplo eliminada(s).` : 'No había encuestas de ejemplo.')
    return
  }

  await seedDemoPolls()
  console.log('\nPara quitarlas: npm run demo:encuestas:quitar')
}

main()
  .catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Error:', message)
    process.exitCode = 1
  })
  .finally(async () => {
    await destroyDb()
  })
