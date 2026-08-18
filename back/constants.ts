export const ENV = {
  PORT: 'PORT',
  SITE_DOMAIN: 'VITE_SITE_DOMAIN',
  OPERADOR_CLAVE: 'OPERADOR_CLAVE',
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
  API_NOT_FOUND: 'ruta de API no existe aún',
  BACK_ALIVE: 'back vivo; el front en local lo sirve Vite',
  MIGRATE_UP_TO_DATE: 'Paola MySQL: migraciones al día',
  MYSQL_ERROR: 'error mysql',
  MYSQL_OK: 'mysql ok',
  MYSQL_FALLBACK: 'mysql',
  MIGRATE_FALLBACK: 'migración',
} as const

export function migrateFailMessage(detail: string): string {
  return `Paola MySQL: no se pudo migrar (${detail})`
}

export function mysqlWarnMessage(detail: string): string {
  return `Paola MySQL: ${detail}`
}

export function migrateAppliedMessage(names: string): string {
  return `Paola MySQL: aplicadas ${names}`
}

export function listenMessage(port: number): string {
  return `Paola back en http://127.0.0.1:${port}`
}
