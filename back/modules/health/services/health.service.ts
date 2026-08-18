import type { HealthStatusDto } from '../dtos/health.dto.js'
import { pingDatabase } from '../providers/health.provider.js'
import { toHealthStatus } from '../schemas/health.schema.js'

export async function getHealth(): Promise<HealthStatusDto> {
  const db = await pingDatabase()
  return toHealthStatus(db)
}
