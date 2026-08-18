# Paola

Portal de **Paola Biker**. Vue 3 + Vuetify + Vite + TypeScript, con arquitectura modular (puertos y adapters).

Copy en primera persona: [`docs/paola.md`](docs/paola.md). Fases: [`docs/roadmap.md`](docs/roadmap.md).

## Arranque

En Windows, doble clic o desde la carpeta del repo:

```bat
iniciar.bat
```

Eso instala dependencias si hace falta y levanta **front y back juntos** (mismo Hostinger: no son dos hostings).

```bash
npm install
npm run dev
```

Build de producción: `npm run build` → carpeta `dist/` en la raíz.

En Hostinger (Node, un solo hosting):

| Campo | Valor |
|-------|--------|
| Tipo | **Aplicación Node.js** (no sitio estático) |
| Build | `npm run build` |
| Directorio de salida | `dist` |
| Arranque | `npm start` |

`npm start` sirve `dist/` y `/api` juntos. Las variables MySQL van en `.env` del hosting, no en git.

Copia `.env.example` a `.env` y completa MySQL. **No subas `.env`.** Para conectar desde el PC, en Hostinger agrega tu IP en acceso remoto MySQL.

## Cómo está organizado

```
front/                    Vue + Vite + Vuetify
  src/app/                Cascarón, router, bootstrap
  src/core/               Result, errores (sin I/O)
  src/shared/             theme, motion, ui (`@ui`)
  src/modules/            Módulos de producto (fases)
  public/                 logo, mascota, fuentes
back/                     Cascarón HTTP (health + estáticos en prod)
docs/                     visión, fases, visual, relato
package.json              Scripts dev/build/start en la raíz
```

**Kit visual:** en local, abre `/kit` para ver todos los componentes Vue importables desde `@ui`.

## Reglas de desacoplamiento

1. Un módulo **no importa** de otro módulo.
2. `domain` no conoce Vue, Vuetify, HTTP ni almacenamiento.
3. Los casos de uso dependen de **puertos**, no de implementaciones.
4. Solo `front/src/app/bootstrap.ts` elige adapters concretos.
5. Las vistas reciben el módulo ya cableado por props.
6. El resto del código entra a un módulo por su `index.ts`.

## Cómo añadir un módulo

1. Crea `front/src/modules/nombre/` (`domain`, `application`, `infrastructure`, `presentation`).
2. Define el puerto en `domain/ports`.
3. Implementa el caso de uso y un adapter.
4. Expón una fábrica en `composition.ts` y una vista `.vue`.
5. Cablea en `front/src/app/bootstrap.ts` y enruta en `router.ts`.
