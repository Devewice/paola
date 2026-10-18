import { HTTP_MESSAGES } from './http/constants.js'

export const ENV = {
  PORT: 'PORT',
  SITE_DOMAIN: 'VITE_SITE_DOMAIN',
  MYSQL_HOST: 'MYSQL_HOST',
  MYSQL_USER: 'MYSQL_USER',
  MYSQL_PASSWORD: 'MYSQL_PASSWORD',
  MYSQL_DATABASE: 'MYSQL_DATABASE',
  MYSQL_PORT: 'MYSQL_PORT',
} as const

export const APP = {
  DEFAULT_PORT: 8787,
  DEFAULT_SITE: 'paolabiker.com',
  DIST_DIR: 'dist',
  INDEX_HTML: 'index.html',
  URL_BASE: 'http://localhost',
  API_PREFIX: '/api/',
} as const

export const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
}

export const MIME_FALLBACK = 'application/octet-stream'
export const MIME_HTML = 'text/html; charset=utf-8'

export const APP_MESSAGES = {
  NO_BUILD: 'sin build; corre npm run build',
  API_NOT_FOUND: HTTP_MESSAGES.HIDDEN,
  BACK_ALIVE: 'back vivo; el front en local lo sirve Vite',
  MIGRATE_UP_TO_DATE: '[Paola] Migraciones: al día, no había nada nuevo',
  MYSQL_ERROR: 'error mysql',
  MYSQL_OK: 'mysql ok',
  MYSQL_FALLBACK: 'mysql',
  MIGRATE_FALLBACK: 'migración',
} as const

export const MIGRATION_DETAIL_MAX = 300

/** Líneas del arranque: en Hostinger salen en los logs de la aplicación (no en los del build). */
export const BOOT_LOG = {
  start: (at: string) => `[Paola] ===== Arranque ${at} =====`,
  mysqlUp: '[Paola] MySQL: conectado',
  mysqlDown: (detail: string) => `[Paola] MySQL: SIN CONEXIÓN (${detail})`,
  skipped: '[Paola] Migraciones: NO se corrieron (no hay MySQL)',
  applied: (count: number) => `[Paola] Migraciones: ${count} aplicada${count === 1 ? '' : 's'} ahora`,
  item: (name: string) => `[Paola]   + ${name}`,
  last: (name: string, total: number) => `[Paola] Última migración en la base: ${name} (${total} en total)`,
  failed: (detail: string) => `[Paola] Migraciones: FALLARON (${detail})`,
  listen: (port: number) => `[Paola] Servidor escuchando en el puerto ${port}`,
  status: '[Paola] Estado en /api/health',
} as const
