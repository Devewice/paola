import { sendJson } from '../http/send.mjs'
import { listSalidas } from '../providers/salidas.provider.mjs'

export async function listSalidasController(_request, response) {
  const outings = await listSalidas()
  sendJson(response, 200, { ok: true, outings })
}
