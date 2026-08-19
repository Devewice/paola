# AGENTS.md — reglas fundamentales de construcción

Este archivo es **vinculante**. Si una instrucción de chat choca con esto, gana esto, salvo que Paola lo cambie por escrito.

El destino es el **portal completo** (horizonte 44). No construyas un paso intermedio que una pieza posterior va a tirar. Comprime: deja el estado final.

---

## 1. Identidad

- **Paola** es la persona, la marca y el producto. El oficio público es **Paola Biker**.
- No uses otro nombre de pila para referirte a ella.
- Una sola operadora: no diseñes flujos que exijan un equipo 24/7.
- Responde al usuario en **español**.

---

## 2. Cómo se construye

- El mapa de fases es **cobertura** (qué tiene que existir), no una cola de sprints. Se puede sacar **todo de una vez**.
- Si un paso intermedio se pisa o se borra en una pieza posterior, **no lo implementes**: deja ya el estado final.
- Los “No incluye” de fases tempranas no bloquean lo que el horizonte **sí** pide (cuenta, feed, chat, comunidades). El “No incluye” que **sí** vale es el de la hoja al final (GPS, marketplace, trámites, envío nacional).
- Membresías (21): sin precio y beneficios definidos por Paola, **no se inventan**. Hueco honesto.
- Pasarela (20): el camino WhatsApp/Paola **no se apaga**. Sin credenciales reales, no se finge cobro en línea.
- WhatsApp **no se apaga** cuando exista la web social. Dos canales, no reemplazo.
- El módulo `counter` no es producto: quítalo al entrar el primer módulo real.

### Fuera de alcance (hasta regla nueva por escrito)

- GPS en vivo.
- Marketplace de terceros.
- Trámite o representación de comparendos.
- Envío nacional.
- Eventbrite u otro proveedor de tickets.
- Popups de publicidad o venta de datos.
- Equipo de moderación 24/7.
- Sincronizar automáticamente todos los mensajes de WhatsApp a la web.

---

## 3. Producto y marca (no negociable)

- Cinco entradas: **Inicio, Parchese, Tu voz, Tienda, Paola**. Más franja global de **alianzas** (el mismo set que en Parchese).
- Tono de parche, no corporativo. Si una pantalla podría ser cualquier motoclub, está mal.
- **Marca propia sin mezclar:** lo de Paola se ve como Paola; lo de alianza, como alianza. En Tienda, colaboraciones en estantería **aparte**.
- Tickets de rodada: **sistema propio y simple** (cupo), no plataforma externa.
- Pago: primero **escribirle a Paola** (WhatsApp/correo). Pasarela después, y el camino Paola no se apaga.
- Entrega gratis **solo Bogotá y Soacha**. Fuera: “aún no”, no improvisar flete.
- Garantía de producto: **solo defectos de fabricación**. Servicio de cascos: si quedó mal, se corrige.
- El sitio se mira **sin login**. Cuenta cuando haya ticket a tu nombre, pedido o denuncia.
- Comparendos: educación + disclaimer + enlace oficial. **No** trámites ni formularios que parezcan autoridad.
- Denuncias: constancia comunitaria, no denuncia penal. Moderación. No linchamiento, no menores, no doxxing.
- Únete = **WhatsApp** (parche caliente). **Comunidades persistentes** viven en la web (**36+**) como otro canal; WA no se apaga.

### Voces (tríada)

Úsalas en copy y estructura, no como tres sitios:

| Voz | Cuándo |
|-----|--------|
| **Moto Loigca** | Rodada anunciada, precios, cupo, ley, tips, garantía |
| **Cámara Incauta** | Fotos, memorias, evidencia, Insta360 |
| **Paola Armargura** | Relato personal, denuncias, cierre emocional |

Visual: logo oficial = escudo PNG (no una cursiva). Paleta negro + blanco + azul eléctrico (`#0088F8`). Fuentes Oswald + Montserrat. Botones radio 10px, CTA mayúsculas. Paper Mario / Insta360 no sustituyen esta marca.

---

## 4. Arquitectura de código

Stack: **Vue 3 + Vuetify + Vite + TypeScript** en `front/`. API en `back/` también TypeScript.  
`front/src/app/bootstrap.ts` es **composición** (cablear adapters). No es Bootstrap CSS.

### Desacoplamiento

1. Un módulo **no importa** de otro módulo.
2. `domain` no conoce Vue, Vuetify, HTTP ni storage.
3. Casos de uso dependen de **puertos**, no de adapters.
4. Solo `front/src/app/bootstrap.ts` elige implementaciones concretas.
5. Las vistas reciben el módulo ya cableado por **props** (o el puerto que bootstrap inyectó).
6. El resto entra al módulo por su `index.ts`.

### Carpetas del repo

```
front/                  Vue + Vuetify + Vite
  src/app/              cascarón, router, bootstrap
  src/core/
  src/shared/           theme, motion, ui (`@ui`)
  src/modules/
back/                   HTTP TypeScript; estáticos en prod
  db/                   Knex (MySQL): migraciones + consultas
  http/                 Router, middleware, guards
  modules/              Un módulo por recurso, nombre en inglés
```

No mezclar front y back en la raíz. `package.json` en la raíz orquesta los dos.

### Cómo nace un módulo

```
front/src/modules/<nombre>/
  domain/           entidades + ports
  application/      casos de uso
  infrastructure/   adapters
  presentation/     .vue
  constants/        textos, límites, mensajes (no pegados en código)
  composition.ts    fábrica
  index.ts          API pública
```

### Cómo nace un módulo de API (`back/`)

```
back/modules/<nombre-en-inglés>/
  controllers/
  services/
  providers/
  schemas/
  middlewares/
  interfaces/
  dtos/
  constants/        textos, rutas, límites, tablas (no pegados en código)
  index.ts          rutas del módulo
```



Módulos de producto (dejan el placeholder cuando tienen tabla + API): `home`, `club`, `rides`, `voice`, `shop`, `paola`, `users`, `alliances-strip`, `community`, `communities`, `social`.
Inicio no importa `rides` por dentro: se cablea en bootstrap. Inventario nuevo: MySQL vía Knex, no JSON en el front.

Componentes visuales reutilizables: `front/src/shared/ui/` (importar `@ui`). Catálogo vivo en `/admin/ui`.

### Más

- Pinia solo si la UI se vuelve ruidosa. **Reglas de negocio nunca en Pinia.**
- Vue Router al haber las 5 pestañas.
- **Hostinger:** el front y el back viven **en el mismo hosting**, un solo despliegue. No hay API en otro proveedor. En local, `iniciar.bat` / `npm run dev` levantan los dos procesos; en producción `npm start` sirve el build y el `/api` juntos.
- API en `back/modules/` (`health`, `rides`, `club`, `memories`, `voice`, `shop`; cada fase de inventario suma tabla + endpoint). No Express dentro de un `.vue`.
- Textos, rutas, límites y variables de mensaje van en `constants/`, no hardcodeados en controller, provider ni vista.
- Credenciales MySQL solo en `.env` (gitignored). Nunca en docs ni en el front.
- Pagos: puerto `PaymentPort` — adapter WhatsApp primero, pasarela después.
- Tests primero en **casos de uso** (cupo, km, pedido, estados de salida).
- TypeScript estricto; imports de tipos con `import type`.

---

## 5. Git y mensajes

- Commits y PRs en **español**.
- Título corto; cuerpo solo si hace falta.
- **Prohibido** `Co-authored-by: Cursor` y trailers `Made-with` / `Generated by Cursor`.
- No hagas commit ni push salvo que te lo pidan.
- Rama de trabajo del producto: `main`.

---

## 6. Contenido que no inventes

No rellenes biografía, precios de membresía, lista de integrantes, aliados, links de WhatsApp/redes/video, ni NIT. Correo y dominio sí: `contacto@paolabiker.com` / `paolabiker.com`. Usa placeholders honestos para lo demás.

Si una decisión de producto no está en la hoja de ruta, **no la des por hecha**: o cabe en la fase, o se pregunta.
