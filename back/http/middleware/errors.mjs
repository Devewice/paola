export function withErrors(handler) {
  return async (request, response) => {
    try {
      await handler(request, response)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'error interno'
      response.writeHead(500, { 'content-type': 'application/json; charset=utf-8' })
      response.end(JSON.stringify({ ok: false, detail: message }))
    }
  }
}
