import dotenv from 'dotenv'
import { type Knex } from 'knex'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { KNEX_LOAD_EXTENSIONS, MYSQL, MYSQL_ENV, MYSQL_MESSAGES, PACKAGE_WALK_MAX } from './constants.js'

const here = dirname(fileURLToPath(import.meta.url))

function repoRoot(): string {
  let dir = here
  for (let i = 0; i < PACKAGE_WALK_MAX; i++) {
    if (existsSync(join(dir, 'package.json'))) return dir
    dir = dirname(dir)
  }
  return process.cwd()
}

dotenv.config({ path: join(repoRoot(), '.env') })

function mysqlConnection(): Knex.MySql2ConnectionConfig {
  const host = process.env[MYSQL_ENV.HOST]
  const user = process.env[MYSQL_ENV.USER]
  const password = process.env[MYSQL_ENV.PASSWORD]
  const database = process.env[MYSQL_ENV.DATABASE]
  if (!host || !user || !password || !database) {
    throw new Error(MYSQL_MESSAGES.MISSING_ENV)
  }
  return {
    host,
    port: Number(process.env[MYSQL_ENV.PORT]) || MYSQL.DEFAULT_PORT,
    user,
    password,
    database,
    dateStrings: true,
    charset: MYSQL.CHARSET,
  }
}

const config: Knex.Config = {
  client: MYSQL.CLIENT,
  connection: mysqlConnection(),
  pool: { min: MYSQL.POOL_MIN, max: MYSQL.POOL_MAX },
  migrations: {
    tableName: MYSQL.MIGRATIONS_TABLE,
    directory: join(here, 'migrations'),
    extension: MYSQL.EXTENSION,
    loadExtensions: [...KNEX_LOAD_EXTENSIONS],
  },
}

export default config
