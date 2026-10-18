import { APP, ENV } from '../../../constants.js'
import type { MigrationReport } from '../../../db/migrate.js'
import type { DbPing, HealthStatus } from '../interfaces/health.interface.js'

export function toHealthStatus(db: DbPing, migrations: MigrationReport): HealthStatus {
  return {
    ok: true,
    site: process.env[ENV.SITE_DOMAIN] ?? APP.DEFAULT_SITE,
    db,
    migrations,
  }
}
