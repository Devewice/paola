/**
 * Router mínimo (sin Express). `path` admite `:param`.
 * Orden: primer match gana.
 */
export function createRouter(routes) {
  return async (request, response) => {
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

function matchPath(pattern, pathname) {
  const keys = []
  const source = pattern.replace(/:([A-Za-z]+)/g, (_, key) => {
    keys.push(key)
    return '([^/]+)'
  })
  const match = pathname.match(new RegExp(`^${source}$`))
  if (!match) return null
  const params = {}
  keys.forEach((key, index) => {
    params[key] = decodeURIComponent(match[index + 1] ?? '')
  })
  return params
}
