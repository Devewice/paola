import { getDb } from './knex.js'

export async function migrate(): Promise<void> {
  const [, applied] = await getDb().migrate.latest()
  if (applied.length === 0) {
    console.log('Paola MySQL: migraciones al día')
    return
  }
  console.log(`Paola MySQL: aplicadas ${applied.join(', ')}`)
}
