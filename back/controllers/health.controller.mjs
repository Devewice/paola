import { pingPool } from '../db/pool.mjs'
import { sendJson } from '../http/send.mjs'

export async function healthController(_request, response) {
  const db = await pingPool()
  sendJson(response, 200, {
    ok: true,
    site: process.env.VITE_SITE_DOMAIN ?? 'paolabiker.com',
    db,
  })
}
