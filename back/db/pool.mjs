import { createPool } from 'mysql2/promise'

let pool

export function getPool() {
  if (pool) return pool

  const host = process.env.MYSQL_HOST
  const user = process.env.MYSQL_USER
  const password = process.env.MYSQL_PASSWORD
  const database = process.env.MYSQL_DATABASE
  if (!host || !user || !password || !database) {
    throw new Error('faltan variables MYSQL_* en .env')
  }

  pool = createPool({
    host,
    port: Number(process.env.MYSQL_PORT) || 3306,
    user,
    password,
    database,
    dateStrings: true,
    waitForConnections: true,
    connectionLimit: 4,
    connectTimeout: 8000,
  })
  return pool
}

export async function pingPool() {
  try {
    const db = getPool()
    await db.query('SELECT 1')
    return { ok: true, detail: 'mysql ok' }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'error mysql'
    return { ok: false, detail: message }
  }
}
