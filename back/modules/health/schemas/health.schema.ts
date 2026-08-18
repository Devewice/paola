import { APP, ENV } from '../../../constants.js'
import type { DbPing, HealthStatus } from '../interfaces/health.interface.js'

export function toHealthStatus(db: DbPing): HealthStatus {
  return {
    ok: true,
    site: process.env[ENV.SITE_DOMAIN] ?? APP.DEFAULT_SITE,
    db,
  }
}
