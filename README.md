# Paola

Portal de **Paola Biker**. Vue 3 + Vuetify + Vite + TypeScript, con arquitectura modular (puertos y adapters).

Copy en primera persona: [`docs/paola.md`](docs/paola.md). Fases: [`docs/roadmap.md`](docs/roadmap.md).

## Arranque

En Windows, doble clic o desde la carpeta del repo:

```bat
iniciar.bat
```

Eso instala dependencias si hace falta y levanta **front y back juntos** (como en Hostinger: no son dos hostings).

```bash
npm install
npm run dev
```

Build de producción: `npm run build`. En Hostinger el proceso único es `npm start` (sirve `dist/` + `/api`).

Copia `.env.example` a `.env` y completa MySQL. **No subas `.env`.** Para conectar desde el PC, en Hostinger agrega tu IP en acceso remoto MySQL.

## Cómo está organizado

```
src/
  main.ts                 # Punto de entrada Vue
  app/                    # Cascarón, router y composición
    App.vue               # Barra, área, pie
    bootstrap.ts          # Cablea adapters (aún sin módulos de producto)
    router.ts             # 5 pestañas
    navigation.ts
    plugins/
    shell/ComingSoonView.vue
  core/                   # Núcleo compartido (Result, errores). Sin I/O.
  shared/                 # Infra transversal (storage, motion, theme)
  modules/                # Módulos de producto (vacío en fase 0)
  server/                 # Cascarón del back (health + estáticos). REST de producto después.
```

## Reglas de desacoplamiento

1. Un módulo **no importa** de otro módulo.
2. `domain` no conoce Vue, Vuetify, HTTP ni almacenamiento.
3. Los casos de uso dependen de **puertos**, no de implementaciones.
4. Solo `src/app/bootstrap.ts` elige adapters concretos.
5. Las vistas reciben el módulo ya cableado por props.
6. El resto del código entra a un módulo por su `index.ts`.

## Cómo añadir un módulo

1. Crea `src/modules/nombre/` (`domain`, `application`, `infrastructure`, `presentation`).
2. Define el puerto en `domain/ports`.
3. Implementa el caso de uso y un adapter.
4. Expón una fábrica en `composition.ts` y una vista `.vue`.
5. Cablea en `src/app/bootstrap.ts` y enruta en `router.ts`.
