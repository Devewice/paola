import { computed, ref } from 'vue'
import { ADMIN_EDIT_STORAGE_KEY, type OperarPermission } from '@app/constants/operar.ts'
import { useOperarAccess } from '@app/shell/useOperarAccess.ts'

function readEditing(): boolean {
  try {
    return localStorage.getItem(ADMIN_EDIT_STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

const editing = ref(readEditing())

function setEditing(value: boolean): void {
  editing.value = value
  try {
    localStorage.setItem(ADMIN_EDIT_STORAGE_KEY, value ? '1' : '0')
  } catch {
    /* sin storage el modo dura lo que dure la pestaña */
  }
}

/**
 * Modo «editar en la página». `claveFor` devuelve la sesión solo si el modo
 * está encendido y la cuenta tiene ese permiso; las vistas públicas muestran
 * herramientas cuando reciben una clave no vacía.
 */
export function useAdminEdit() {
  const { gate, session, can } = useOperarAccess()
  const active = computed(() => gate.value === 'ready' && editing.value)

  function claveFor(permission: OperarPermission): string {
    return active.value && can(permission) ? session.value : ''
  }

  return { active, editing, setEditing, claveFor }
}
