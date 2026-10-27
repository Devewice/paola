import type { ServerResponse } from 'node:http'
import { CONTENT_TYPE_JSON, HTTP_HEADER, HTTP_STATUS } from './constants.js'

export function sendJson(response: ServerResponse, status: number, body: unknown): void {
  response.writeHead(status, { [HTTP_HEADER.CONTENT_TYPE]: CONTENT_TYPE_JSON })
  response.end(JSON.stringify(body))
}

/** `fileName` debe venir en ASCII (sin tildes ni comillas). */
export function sendDownload(response: ServerResponse, contentType: string, fileName: string, data: Buffer): void {
  response.writeHead(HTTP_STATUS.OK, {
    [HTTP_HEADER.CONTENT_TYPE]: contentType,
    'content-disposition': `attachment; filename="${fileName}"`,
    'content-length': data.length,
    'cache-control': 'no-store',
  })
  response.end(data)
}
