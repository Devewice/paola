# Paola Biker

Portal de moto, parche y tienda. Vue 3 + Vuetify + TypeScript (front) y API TypeScript + MySQL (back), con módulos desacoplados (puertos y adapters).

Guía completa: [`AGENTS.md`](AGENTS.md). Copy: [`docs/copy.md`](docs/copy.md).

## Arranque

Windows:

```bat
iniciar.bat
```

O desde la raíz:

```bash
npm install
npm run dev
```

Levanta **front y back** juntos (mismo hosting en producción).

Build: `npm run build` → `dist/` + `back/dist/`. Producción: `npm start` sirve estáticos y `/api`.

### Hostinger (Node)

| Campo | Valor |
|-------|--------|
| Build | `npm run build` |
| Salida | `dist` |
| Arranque | `npm start` |

Variables MySQL en `.env` del hosting (no en git). Copia `.env.example` → `.env` en local.

## Estructura

```
front/
  src/app/          router, bootstrap, shell
  src/core/
  src/shared/       theme, motion, ui (@ui)
  src/modules/
back/
  db/               Knex + migraciones
  http/
  modules/
AGENTS.md           arquitectura, marca, copy
```

**Kit UI:** `/admin/ui` — catálogo de componentes `@ui`.

## Desacoplamiento (resumen)

1. Un módulo no importa otro.
2. `domain` sin Vue/HTTP.
3. Casos de uso → puertos.
4. `bootstrap.ts` cablea adapters.
5. Vistas reciben módulo por props.
6. Entrada pública: `index.ts` del módulo.

## Nuevo módulo

1. `front/src/modules/<nombre>/` (domain, application, infrastructure, presentation, constants).
2. Puertos, casos de uso, adapter, `composition.ts`, vista.
3. Cablear en `bootstrap.ts` y `router.ts`.
4. Si hay API: `back/modules/<nombre-en-inglés>/` con capas habituales; textos en `constants/`.
