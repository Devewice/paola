/**
 * Composición: aquí se cablean adapters cuando nazca el primer módulo de producto.
 * Fase 0: el cascarón vive en el router; aún no hay dominio que inyectar.
 */
export type AppDependencies = Record<string, never>

export function createAppDependencies(): AppDependencies {
  return {}
}
