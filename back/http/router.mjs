/**
 * Router mínimo (sin Express). Orden: primer match gana.
 * Cada ruta es { method, path, handler }.
 */
export function createRouter(routes) {
  return async (request, response) => {
    const url = new URL(request.url ?? '/', 'http://localhost')
    const method = request.method ?? 'GET'
    const route = routes.find((item) => item.method === method && item.path === url.pathname)
    if (!route) return false
    await route.handler(request, response, url)
    return true
  }
}
