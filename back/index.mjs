import dotenv from 'dotenv'
import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { migrate } from './db/migrate.mjs'
import { pingPool } from './db/pool.mjs'
import { healthController } from './controllers/health.controller.mjs'
import { listSalidasController, claimCupoController, listOperatorBoardController, setSalidaStatusController } from './controllers/salidas.controller.mjs'
import { withErrors } from './http/middleware/errors.mjs'
import { createRouter } from './http/router.mjs'
import { sendJson } from './http/send.mjs'

dotenv.config({ path: join(fileURLToPath(new URL('.', import.meta.url)), '..', '.env') })

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

const api = createRouter([
  { method: 'GET', path: '/api/health', handler: withErrors(healthController) },
  { method: 'GET', path: '/api/salidas', handler: withErrors(listSalidasController) },
  { method: 'POST', path: '/api/salidas/:id/cupos', handler: withErrors(claimCupoController) },
  { method: 'GET', path: '/api/operar/salidas', handler: withErrors(listOperatorBoardController) },
  {
    method: 'POST',
    path: '/api/operar/salidas/:id/estado',
    handler: withErrors(setSalidaStatusController),
  },
])

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? '/', 'http://localhost')

  const handled = await api(request, response)
  if (handled) return

  if (url.pathname.startsWith('/api/')) {
    sendJson(response, 404, { ok: false, detail: 'ruta de API no existe aún' })
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

async function start() {
  const ping = await pingPool().catch((error) => ({
    ok: false,
    detail: error instanceof Error ? error.message : 'mysql',
  }))
  if (ping.ok) {
    try {
      await migrate()
      console.log('Paola MySQL: migrado (tablas salidas, cupos)')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'migración'
      console.warn(`Paola MySQL: no se pudo migrar (${message})`)
    }
  } else {
    console.warn(`Paola MySQL: ${ping.detail}`)
  }

  server.listen(port, () => {
    console.log(`Paola back en http://127.0.0.1:${port}`)
  })
}

start()
