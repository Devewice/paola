import type { ServerResponse } from 'node:http'
import { CONTENT_TYPE_JSON, HTTP_HEADER } from './constants.js'

export function sendJson(response: ServerResponse, status: number, body: unknown): void {
  response.writeHead(status, { [HTTP_HEADER.CONTENT_TYPE]: CONTENT_TYPE_JSON })
  response.end(JSON.stringify(body))
}
