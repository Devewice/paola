export const ISO_DATE_LENGTH = 10
export const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

export function formatDate(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, ISO_DATE_LENGTH)
  if (typeof value === 'string') return value.slice(0, ISO_DATE_LENGTH)
  return String(value)
}

export function isIsoDate(value: string): boolean {
  return ISO_DATE_PATTERN.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00`))
}
