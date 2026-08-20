# AGENTS.md — guía del proyecto

Referencia principal para humanos e IA. Prioriza **arquitectura**, **identidad visual** y **tono de marca**. Si algo no está claro, pregunta antes de inventar decisiones de producto grandes.

---

## 1. Identidad

- **Paola Biker** es la marca y el portal. Paola es la operadora; el sitio habla como parche, no como corporativo.
- Responde en **español**.
- Una sola operadora: evita flujos que exijan equipo 24/7.

---

## 2. Tono de copy

- Cercano, directo, de moto y parche. Si suena a plantilla de motoclub genérico, afínalo.
- **Segunda persona** cuando encaje: *escríbeme*, *te aviso*, *únete al parche*, *contáctanos*.
- No repitas *Paola* en cada frase ni en CTAs egocéntricos (*escríbele a Paola* → *escríbeme* / *escríbenos*).
- El nombre de marca va donde corresponde (título, pestaña Paola, legal, SEO). En botones y mensajes cotidianos, habla al usuario.
- Textos en `constants/` del módulo o de `app/`; no hardcodeados en `.vue`, controllers ni providers.

Más ejemplos: [`docs/copy.md`](docs/copy.md).

### Voces (guía, no tres sitios)

| Voz | Cuándo |
|-----|--------|
| **Moto Loigca** | Rodadas, cupo, ley, tips, garantía |
| **Cámara Incauta** | Fotos, memorias, evidencia |
| **Paola Armargura** | Relato personal, denuncias, cierre emocional |

---

## 3. Producto

- Cinco entradas: **Inicio, Parchese, Tu voz, Tienda, Paola**. Alianzas en el footer (mismo set que Parchese).
- Marca propia aparte de alianzas. En tienda, colaboraciones en estantería separada.
- Tickets de rodada: sistema propio (cupo). Pago humano primero (WhatsApp/correo); pasarela después sin apagar ese camino.
- Entrega gratis **Bogotá y Soacha**. Garantía producto: defectos de fabricación. Lavado de casco: si quedó mal, se corrige.
- Comparendos: educación + disclaimer + enlace oficial. Sin trámites ni formularios que parezcan autoridad.
- Denuncias: constancia comunitaria, moderación. Sin linchamiento, menores ni doxxing.
- WhatsApp y web en paralelo; no se sustituyen.

### Fuera de alcance (salvo regla nueva)

GPS en vivo · marketplace de terceros · trámites de comparendos · envío nacional · Eventbrite · popups de ads · moderación 24/7 · sync total de WhatsApp a la web.

---

## 4. Arquitectura de código

Stack: **Vue 3 + Vuetify + Vite + TypeScript** (`front/`) y **TypeScript + Knex/MySQL** (`back/`).  
`front/src/app/bootstrap.ts` es **composición** (cablear adapters), no Bootstrap CSS.

### Desacoplamiento

1. Un módulo **no importa** otro módulo.
2. `domain` no conoce Vue, Vuetify, HTTP ni storage.
3. Casos de uso → **puertos**; adapters en `infrastructure`.
4. Solo `bootstrap.ts` elige implementaciones.
5. Vistas reciben el módulo cableado por **props**.
6. API pública del módulo en su `index.ts`.

### Carpetas

```
front/
  src/app/          cascarón, router, bootstrap
  src/core/
  src/shared/       theme, motion, ui (@ui)
  src/modules/
back/
  db/               migraciones Knex
  http/             router, middleware
  modules/          un recurso por carpeta (inglés)
```

`package.json` en la raíz orquesta front y back.

### Módulo front

```
front/src/modules/<nombre>/
  domain/           entidades + ports
  application/      casos de uso
  infrastructure/   adapters
  presentation/     .vue
  constants/        copy, rutas, límites
  composition.ts
  index.ts
```

### Módulo back

```
back/modules/<nombre-en-inglés>/
  controllers/ services/ providers/ schemas/
  middlewares/ interfaces/ dtos/ constants/
  index.ts
```

Inventario y datos de producto: **MySQL vía Knex** en `back/`, adapter HTTP en el módulo front. No catálogos JSON en `front/` ni listados inventados en `.vue`.

Componentes UI: `front/src/shared/ui/` (`@ui`). Índice en `COMPONENTES.md`. Catálogo vivo: `/admin/ui`.

### Más

- Pinia solo si la UI lo pide. Reglas de negocio **no** en Pinia.
- Hostinger: front + back, un despliegue. Local: `iniciar.bat` / `npm run dev`. Prod: `npm start` sirve build + `/api`.
- Credenciales MySQL solo en `.env`.
- Pagos: puerto `PaymentPort` — WhatsApp primero.
- Tests útiles en **casos de uso**.
- TypeScript estricto; `import type` para tipos.

---

## 5. Identidad visual

- Logo = escudo PNG (`logo.png`). No simular el nombre con script.
- Fondo `#05070C`, CTA `#0088F8`, cian `#48B4FC`, navy `#001028`.
- Fuentes: **Oswald** (títulos/CTAs), **Montserrat** (UI).
- Botón primario: azul, mayúsculas, 48px alto, radio 10px. Un CTA `hero` por vista.
- Brocha (`type-brush-dry`, afiches): capa visual; formularios sin brocha.
- Motion: GSAP + AutoAnimate (`front/src/shared/motion/`). Insta360 / Paper Mario no reemplazan la marca.

Detalle en `.cursor/rules/visual.mdc`.

---

## 6. Git

- Commits y PRs en **español**. Título corto.
- Sin `Co-authored-by: Cursor` ni trailers de IA.
- No commit ni push salvo que lo pidan. Rama: `main`.

---

## 7. Datos fijos del proyecto

- Dominio: `paolabiker.com`
- Correo: `contacto@paolabiker.com`
