/**
 * Rodadas de ejemplo para probar el carrusel del hero.
 * No es migración: corre a mano y luego quítalas.
 *
 *   npm run demo:rodadas
 *   npm run demo:rodadas:quitar
 */
import { randomUUID } from 'node:crypto'
import { destroyDb, getDb } from '../db/knex.js'
import { RIDES_DEFAULT_STATUS, RIDES_TABLES } from '../modules/rides/constants/rides.constants.js'

const DEMO_PREFIX = 'demo-rodada-'

const DEMO_IDS = [`${DEMO_PREFIX}1`, `${DEMO_PREFIX}2`, `${DEMO_PREFIX}3`] as const

function addDays(base: Date, days: number): string {
  const next = new Date(base)
  next.setDate(next.getDate() + days)
  return next.toISOString().slice(0, 10)
}

function buildDemoRodadas(today: Date) {
  return [
    {
      id: DEMO_IDS[0],
      title: 'Rodada Anapoima :)',
      date: addDays(today, 12),
      meeting_point: 'Portal Sur · punto de encuentro',
      route_text: 'Bogotá — Anapoima por la vía principal. Parada en Sopó.',
      capacity: 20,
      what_to_bring: 'Casco, documentos al día y chaqueta.',
      paid: false,
    },
    {
      id: DEMO_IDS[1],
      title: 'Rodada Sopó',
      date: addDays(today, 26),
      meeting_point: 'Américas · salida norte',
      route_text: 'Ruta corta hasta Sopó y regreso por la misma vía.',
      capacity: 15,
      what_to_bring: 'Casco, guantes y linterna.',
      paid: false,
    },
    {
      id: DEMO_IDS[2],
      title: 'Rodada La Calera',
      date: addDays(today, 40),
      meeting_point: 'Autopista Norte · peaje La Caro',
      route_text: 'Subida a La Calera. Ritmo de grupo, sin rebasar de más.',
      capacity: 18,
      what_to_bring: 'Casco, chaleco y documentos.',
      paid: false,
    },
  ] as const
}

async function removeDemoRodadas(): Promise<number> {
  const db = getDb()
  await db(RIDES_TABLES.TICKETS).whereIn('outing_id', [...DEMO_IDS]).del()
  const deleted = await db(RIDES_TABLES.OUTINGS).whereIn('id', [...DEMO_IDS]).del()
  return deleted
}

async function seedDemoRodadas(): Promise<void> {
  const db = getDb()
  const today = new Date()
  const demos = buildDemoRodadas(today)

  await removeDemoRodadas()

  for (const demo of demos) {
    await db(RIDES_TABLES.OUTINGS).insert({
      id: demo.id,
      title: demo.title,
      date: demo.date,
      kind: 'rodada',
      meeting_point: demo.meeting_point,
      route_text: demo.route_text,
      capacity: demo.capacity,
      what_to_bring: demo.what_to_bring,
      paid: demo.paid,
      status: RIDES_DEFAULT_STATUS,
    })

    if (await db.schema.hasTable(RIDES_TABLES.OUTING_ROUTES)) {
      await db(RIDES_TABLES.OUTING_ROUTES).insert({
        id: randomUUID(),
        outing_id: demo.id,
        preview_text: demo.route_text,
        map_href: null,
      })
    }
  }

  console.log('Rodadas de ejemplo insertadas:')
  for (const demo of demos) {
    console.log(`  · ${demo.date} — ${demo.title} (${demo.id})`)
  }
}

async function main(): Promise<void> {
  const mode = process.argv[2]?.toLowerCase()

  if (mode === 'quitar' || mode === 'down' || mode === 'remove') {
    const deleted = await removeDemoRodadas()
    console.log(deleted ? `Listo: ${deleted} rodada(s) de ejemplo eliminada(s).` : 'No había rodadas de ejemplo.')
    return
  }

  await seedDemoRodadas()
  console.log('\nPara quitarlas: npm run demo:rodadas:quitar')
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
