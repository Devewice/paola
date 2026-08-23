import { reactive } from 'vue'

export type ToastTone = 'info' | 'ok' | 'bad' | 'warn'

export type ToastItem = {
  id: number
  tone: ToastTone
  title: string
  message: string
}

export const TOAST_COPY = {
  titles: {
    info: 'Aviso',
    ok: 'Listo',
    bad: 'Error',
    warn: 'Ojo',
  },
  close: 'Cerrar',
} as const

const TTL_MS = 5000

let nextId = 1

export const toastState = reactive<{ items: ToastItem[] }>({ items: [] })

export function showToast(message: string, tone: ToastTone = 'info'): void {
  const id = nextId++
  toastState.items.push({
    id,
    tone,
    title: TOAST_COPY.titles[tone],
    message,
  })
  window.setTimeout(() => dismissToast(id), TTL_MS)
}

export function dismissToast(id: number): void {
  const index = toastState.items.findIndex((item) => item.id === id)
  if (index >= 0) toastState.items.splice(index, 1)
}
