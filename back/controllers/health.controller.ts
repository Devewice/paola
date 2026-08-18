import { pingDb } from '../db/knex.js'
import { sendJson } from '../http/send.js'
import type { RouteHandler } from '../http/types.js'

export const healthController: RouteHandler = async (_request, response) => {
  const db = await pingDb()
  sendJson(response, 200, {
    ok: true,
    site: process.env.VITE_SITE_DOMAIN ?? 'paolabiker.com',
    db,
  })
}
