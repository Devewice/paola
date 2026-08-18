export function formatProductPrice(priceCop: number | null): string {
  if (priceCop === null) return 'Preguntar'
  return `$${priceCop.toLocaleString('es-CO')}`
}
