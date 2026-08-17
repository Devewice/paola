# Paola

Proyecto base en **Vue 3 + Vuetify + Vite + TypeScript** con arquitectura modular desacoplada (puertos y adapters).

## Arranque

```bash
npm install
npm run dev
```

Build de producción: `npm run build`.

## Cómo está organizado

```
src/
  main.ts                 # Punto de entrada Vue
  app/                    # Composición: cablea módulos y monta Vuetify
    App.vue
    bootstrap.ts
    plugins/vuetify.ts
  core/                   # Núcleo compartido (Result, errores). Sin I/O.
  shared/                 # Infra transversal (storage)
  modules/
    counter/              # Módulo de ejemplo (cópialo para crear otros)
      domain/             # Entidades + puertos (contratos)
      application/        # Casos de uso
      infrastructure/     # Adapters concretos
      presentation/       # Vista Vuetify
      composition.ts      # Fábrica del módulo
      index.ts            # API pública
```

## Reglas de desacoplamiento

1. Un módulo **no importa** de otro módulo.
2. `domain` no conoce Vue, Vuetify, HTTP ni almacenamiento.
3. Los casos de uso dependen de **puertos**, no de implementaciones.
4. Solo `src/app/bootstrap.ts` elige adapters concretos.
5. Las vistas Vuetify solo reciben el módulo ya cableado por props.
6. El resto del código entra a un módulo por su `index.ts`.

Para cambiar persistencia del contador, en `bootstrap.ts` usa `createInMemoryCounterRepository()` en lugar de `createStorageCounterRepository(...)`.

## Cómo añadir un módulo

1. Crea `src/modules/nombre/` con las mismas carpetas.
2. Define el puerto en `domain/ports`.
3. Implementa el caso de uso y un adapter.
4. Expón una fábrica en `composition.ts` y una vista `.vue`.
5. Registra el módulo en `src/app/bootstrap.ts` y en `App.vue`.
