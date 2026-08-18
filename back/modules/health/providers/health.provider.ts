import { pingDb } from '../../../db/knex.js'
import type { DbPing } from '../interfaces/health.interface.js'

export async function pingDatabase(): Promise<DbPing> {
  return pingDb()
}
