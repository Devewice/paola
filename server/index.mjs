import dotenv from 'dotenv'
import { createConnection } from 'mysql2/promise'
import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

dotenv.config()

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..')
const dist = join(root, 'dist')
const port = Number(process.env.PORT) || 8787

const mime = {
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

function sendJson(response, status, body) {
  response.writeHead(status, { 'content-type': 'application/json; charset=utf-8' })
  response.end(JSON.stringify(body))
}

async function pingDatabase() {
  const host = process.env.MYSQL_HOST
  const user = process.env.MYSQL_USER
  const password = process.env.MYSQL_PASSWORD
  const database = process.env.MYSQL_DATABASE
  if (!host || !user || !password || !database) {
    return { ok: false, detail: 'faltan variables MYSQL_* en .env' }
  }

  try {
    const connection = await createConnection({
      host,
      port: Number(process.env.MYSQL_PORT) || 3306,
      user,
      password,
      database,
      connectTimeout: 8000,
    })
    await connection.ping()
    await connection.end()
    return { ok: true, detail: 'mysql ok' }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'error mysql'
    return { ok: false, detail: message }
  }
}

function serveStatic(request, response) {
  const url = new URL(request.url ?? '/', 'http://localhost')
  let relative = decodeURIComponent(url.pathname)
  if (relative === '/') relative = '/index.html'
  const file = join(dist, relative)

  if (!file.startsWith(dist) || !existsSync(file) || statSync(file).isDirectory()) {
    const fallback = join(dist, 'index.html')
    if (!existsSync(fallback)) {
      sendJson(response, 404, { ok: false, detail: 'sin build; corre npm run build' })
      return
    }
    response.writeHead(200, { 'content-type': mime['.html'] })
    createReadStream(fallback).pipe(response)
    return
  }

  const type = mime[extname(file)] ?? 'application/octet-stream'
  response.writeHead(200, { 'content-type': type })
  createReadStream(file).pipe(response)
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? '/', 'http://localhost')

  if (url.pathname === '/api/health') {
    const db = await pingDatabase()
    sendJson(response, 200, {
      ok: true,
      site: process.env.VITE_SITE_DOMAIN ?? 'paolabiker.com',
      db,
    })
    return
  }

  if (url.pathname.startsWith('/api/')) {
    sendJson(response, 404, { ok: false, detail: 'aún no hay API de producto' })
    return
  }

  if (existsSync(dist)) {
    serveStatic(request, response)
    return
  }

  sendJson(response, 200, {
    ok: true,
    detail: 'back vivo; el front en local lo sirve Vite',
  })
})

server.listen(port, () => {
  console.log(`Paola back en http://127.0.0.1:${port}`)
})
