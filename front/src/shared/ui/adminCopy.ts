/** Textos por defecto de las piezas admin del kit; cada vista puede pasar los suyos. */
export const ADMIN_TOOLS_COPY = {
  edit: 'Editar',
  remove: 'Borrar',
  removeConfirm: '¿Seguro? Toca otra vez',
  close: 'Cerrar',
  create: 'Nuevo',
  editing: 'Editando',
} as const

export type AdminMenuItem = {
  readonly id: string
  readonly label: string
  readonly tone?: 'danger'
  readonly disabled?: boolean
}

/** Ventana para el segundo toque de "Borrar". */
export const ADMIN_CONFIRM_MS = 4000
