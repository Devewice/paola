export function abortAfter(ms: number): AbortSignal {
  const controller = new AbortController()
  window.setTimeout(() => controller.abort(), ms)
  return controller.signal
}
