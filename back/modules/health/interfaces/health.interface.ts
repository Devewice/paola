export interface DbPing {
  ok: boolean
  detail: string
}

export interface HealthStatus {
  ok: true
  site: string
  db: DbPing
}
