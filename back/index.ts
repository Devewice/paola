import dotenv from 'dotenv'
import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http'
import { extname, join } from 'node:path'
import {
  APP,
  APP_MESSAGES,
  ENV,
  listenMessage,
  MIME,
  MIME_FALLBACK,
  MIME_HTML,
  migrateFailMessage,
  mysqlWarnMessage,
} from './constants.js'
import { migrate } from './db/migrate.js'
import { pingDb } from './db/knex.js'
import { HTTP_HEADER, HTTP_STATUS } from './http/constants.js'
import { createRouter } from './http/router.js'
import { sendJson } from './http/send.js'
import { apiRoutes } from './modules/index.js'

const root = process.cwd()
dotenv.config({ path: join(root, '.env') })

const dist = join(root, APP.DIST_DIR)
const port = Number(process.env[ENV.PORT]) || APP.DEFAULT_PORT
const htmlType = MIME['.html'] ?? MIME_HTML

function serveStatic(request: IncomingMessage, response: ServerResponse): void {
  const url = new URL(request.url ?? '/', APP.URL_BASE)
  let relative = decodeURIComponent(url.pathname)
  if (relative === '/') relative = `/${APP.INDEX_HTML}`
  const file = join(dist, relative)

  if (!file.startsWith(dist) || !existsSync(file) || statSync(file).isDirectory()) {
    const fallback = join(dist, APP.INDEX_HTML)
    if (!existsSync(fallback)) {
      sendJson(response, HTTP_STATUS.NOT_FOUND, { ok: false, detail: APP_MESSAGES.NO_BUILD })
      return
    }
    response.writeHead(HTTP_STATUS.OK, { [HTTP_HEADER.CONTENT_TYPE]: htmlType })
    createReadStream(fallback).pipe(response)
    return
  }

  const type = MIME[extname(file)] ?? MIME_FALLBACK
  response.writeHead(HTTP_STATUS.OK, { [HTTP_HEADER.CONTENT_TYPE]: type })
  createReadStream(file).pipe(response)
}

const api = createRouter(apiRoutes)

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? '/', APP.URL_BASE)

  const handled = await api(request, response)
  if (handled) return

  if (url.pathname.startsWith(APP.API_PREFIX)) {
    sendJson(response, HTTP_STATUS.NOT_FOUND, { ok: false, detail: APP_MESSAGES.API_NOT_FOUND })
    return
  }

  if (existsSync(dist)) {
    serveStatic(request, response)
    return
  }

  sendJson(response, HTTP_STATUS.OK, {
    ok: true,
    detail: APP_MESSAGES.BACK_ALIVE,
  })
})

async function start(): Promise<void> {
  const ping = await pingDb().catch((error: unknown) => ({
    ok: false,
    detail: error instanceof Error ? error.message : APP_MESSAGES.MYSQL_FALLBACK,
  }))
  if (ping.ok) {
    try {
      await migrate()
    } catch (error) {
      const message = error instanceof Error ? error.message : APP_MESSAGES.MIGRATE_FALLBACK
      console.warn(migrateFailMessage(message))
    }
  } else {
    console.warn(mysqlWarnMessage(ping.detail))
  }

  server.listen(port, () => {
    console.log(listenMessage(port))
  })
}

void start()
