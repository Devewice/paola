import dotenv from 'dotenv'
import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http'
import { extname, join } from 'node:path'
import { migrate } from './db/migrate.js'
import { pingDb } from './db/knex.js'
import { healthController } from './controllers/health.controller.js'
import {
  claimCupoController,
  createSalidaController,
  listOperatorBoardController,
  listSalidasController,
  setSalidaStatusController,
} from './controllers/salidas.controller.js'
import {
  createAlianzaController,
  createIntegranteController,
  listAlianzasController,
  listIntegrantesController,
} from './controllers/club.controller.js'
import {
  createMemoriaController,
  listMemoriasController,
} from './controllers/memorias.controller.js'
import { listTipsController } from './controllers/tips.controller.js'
import {
  createProductoController,
  listProductosController,
} from './controllers/productos.controller.js'
import { withErrors } from './http/middleware/errors.js'
import { createRouter } from './http/router.js'
import { sendJson } from './http/send.js'

const root = process.cwd()
dotenv.config({ path: join(root, '.env') })

const dist = join(root, 'dist')
const port = Number(process.env.PORT) || 8787

const mime: Record<string, string> = {
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

function serveStatic(request: IncomingMessage, response: ServerResponse): void {
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
    response.writeHead(200, { 'content-type': mime['.html'] ?? 'text/html; charset=utf-8' })
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
  { method: 'GET', path: '/api/memorias', handler: withErrors(listMemoriasController) },
  { method: 'GET', path: '/api/tips', handler: withErrors(listTipsController) },
  { method: 'GET', path: '/api/productos', handler: withErrors(listProductosController) },
  { method: 'GET', path: '/api/alianzas', handler: withErrors(listAlianzasController) },
  { method: 'GET', path: '/api/integrantes', handler: withErrors(listIntegrantesController) },
  { method: 'GET', path: '/api/operar/salidas', handler: withErrors(listOperatorBoardController) },
  { method: 'POST', path: '/api/operar/salidas', handler: withErrors(createSalidaController) },
  {
    method: 'POST',
    path: '/api/operar/salidas/:id/estado',
    handler: withErrors(setSalidaStatusController),
  },
  { method: 'POST', path: '/api/operar/alianzas', handler: withErrors(createAlianzaController) },
  {
    method: 'POST',
    path: '/api/operar/integrantes',
    handler: withErrors(createIntegranteController),
  },
  { method: 'POST', path: '/api/operar/memorias', handler: withErrors(createMemoriaController) },
  { method: 'POST', path: '/api/operar/productos', handler: withErrors(createProductoController) },
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

async function start(): Promise<void> {
  const ping = await pingDb().catch((error: unknown) => ({
    ok: false,
    detail: error instanceof Error ? error.message : 'mysql',
  }))
  if (ping.ok) {
    try {
      await migrate()
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

void start()
