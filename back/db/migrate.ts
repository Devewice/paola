import { APP_MESSAGES, migrateAppliedMessage } from '../constants.js'
import { getDb } from './knex.js'

export async function migrate(): Promise<void> {
  const [, applied] = await getDb().migrate.latest()
  if (applied.length === 0) {
    console.log(APP_MESSAGES.MIGRATE_UP_TO_DATE)
    return
  }
  console.log(migrateAppliedMessage(applied.join(', ')))
}
