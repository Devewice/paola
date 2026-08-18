import { ENV } from '../constants.js'

export const MYSQL = {
  DEFAULT_PORT: 3306,
  POOL_MIN: 0,
  POOL_MAX: 4,
  CHARSET: 'utf8mb4',
  CLIENT: 'mysql2',
  MIGRATIONS_TABLE: 'knex_migrations',
  EXTENSION: 'ts',
} as const

export const MYSQL_ENV = {
  HOST: ENV.MYSQL_HOST,
  USER: ENV.MYSQL_USER,
  PASSWORD: ENV.MYSQL_PASSWORD,
  DATABASE: ENV.MYSQL_DATABASE,
  PORT: ENV.MYSQL_PORT,
} as const

export const MYSQL_MESSAGES = {
  MISSING_ENV: 'faltan variables MYSQL_* en .env',
} as const

export const MYSQL_PING = 'SELECT 1'
export const PACKAGE_WALK_MAX = 6
export const KNEX_LOAD_EXTENSIONS = ['.js', '.ts'] as const
