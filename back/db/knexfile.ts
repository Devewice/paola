import dotenv from 'dotenv'
import { type Knex } from 'knex'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))

function repoRoot(): string {
  let dir = here
  for (let i = 0; i < 6; i++) {
    if (existsSync(join(dir, 'package.json'))) return dir
    dir = dirname(dir)
  }
  return process.cwd()
}

dotenv.config({ path: join(repoRoot(), '.env') })

function mysqlConnection(): Knex.MySql2ConnectionConfig {
  const host = process.env.MYSQL_HOST
  const user = process.env.MYSQL_USER
  const password = process.env.MYSQL_PASSWORD
  const database = process.env.MYSQL_DATABASE
  if (!host || !user || !password || !database) {
    throw new Error('faltan variables MYSQL_* en .env')
  }
  return {
    host,
    port: Number(process.env.MYSQL_PORT) || 3306,
    user,
    password,
    database,
    dateStrings: true,
    charset: 'utf8mb4',
  }
}

const config: Knex.Config = {
  client: 'mysql2',
  connection: mysqlConnection(),
  pool: { min: 0, max: 4 },
  migrations: {
    tableName: 'knex_migrations',
    directory: join(here, 'migrations'),
    extension: 'ts',
    loadExtensions: ['.js', '.ts'],
  },
}

export default config
