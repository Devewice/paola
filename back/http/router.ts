import type { IncomingMessage, ServerResponse } from 'node:http'
import type { RouteHandler, RouteParams } from './types.js'

type Route = {
  method: string
  path: string
  handler: RouteHandler
}

/**
 * Router mínimo (sin Express). `path` admite `:param`.
 * Orden: primer match gana.
 */
export function createRouter(routes: readonly Route[]) {
  return async (request: IncomingMessage, response: ServerResponse) => {
    const url = new URL(request.url ?? '/', 'http://localhost')
    const method = request.method ?? 'GET'
    for (const item of routes) {
      if (item.method !== method) continue
      const params = matchPath(item.path, url.pathname)
      if (!params) continue
      await item.handler(request, response, url, params)
      return true
    }
    return false
  }
}

function matchPath(pattern: string, pathname: string): RouteParams | null {
  const keys: string[] = []
  const source = pattern.replace(/:([A-Za-z]+)/g, (_, key: string) => {
    keys.push(key)
    return '([^/]+)'
  })
  const match = pathname.match(new RegExp(`^${source}$`))
  if (!match) return null
  const params: RouteParams = {}
  keys.forEach((key, index) => {
    params[key] = decodeURIComponent(match[index + 1] ?? '')
  })
  return params
}
