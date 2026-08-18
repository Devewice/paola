# AGENTS.md — reglas fundamentales de construcción

Este archivo es **vinculante**. Si una instrucción de chat choca con esto, gana esto, salvo que Paola lo cambie por escrito en `docs/`.

| Documento | Para qué | No es |
|-----------|----------|--------|
| Este archivo | Cómo construir y qué no romper | Lluvia de ideas |
| [`docs/brainstorming.md`](docs/brainstorming.md) | Visión, marca, mapa del producto | Tareas sueltas |
| [`docs/roadmap.md`](docs/roadmap.md) | Orden de fases y cobertura | Licencia para saltarse fases |
| [`docs/visual.md`](docs/visual.md) | Identidad, color, tipo, botones, espacio | Moodboard suelto |
| [`docs/paola.md`](docs/paola.md) | Razón, quién, por qué, para qué (primera persona) | Bio inventada |

Antes de implementar: lee la **fase actual** de la hoja de ruta. No abras la siguiente si la actual no cumple su “queda lista cuando”.

---

## 1. Identidad

- **Paola** es la persona, la marca y el producto. El oficio público es **Paola Biker**.
- No uses otro nombre de pila para referirte a ella.
- Una sola operadora: no diseñes flujos que exijan un equipo 24/7.
- Responde al usuario en **español**.

---

## 2. Orden de trabajo

- Una fase a la vez (`docs/roadmap.md`).
- No construyas lo que la fase marca **No incluye**.
- Candados: fase **15** (legal) antes de denuncias (18) y pasarela (20). Membresías (21) solo con precio y beneficios definidos. Comunidad web: **28–31** → **32–35** → red social **36–44** (decisión Paola: web otro canal; WhatsApp paralelo). Fase **25** fija reglas dos canales.
- El módulo `counter` no es producto: quítalo al entrar el primer módulo real (fase 0).

### Fuera de alcance hasta que una fase nueva lo diga

- GPS en vivo.
- Marketplace de terceros.
- Trámite o representación de comparendos.
- Envío nacional.
- Red social completa en el **MVP inicial** (horizonte **36–44** en `docs/roadmap.md`).
- Eventbrite u otro proveedor de tickets al inicio.
- Popups de publicidad o venta de datos.

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

Visual: obedecer [`docs/visual.md`](docs/visual.md). Logo oficial = `docs/resoruces/logo.png` (PNG del escudo, no una cursiva). Paleta negro + blanco + azul eléctrico (`#0088F8`). Fuentes Oswald + Montserrat. Botones radio 10px, CTA mayúsculas. Paper Mario / Insta360 no sustituyen esta marca.

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
back/                   HTTP TypeScript: health, salidas, cupos, alianzas, integrantes; estáticos en prod
docs/                   visión, fases, visual, relato
```

No mezclar front y back en la raíz. `package.json` en la raíz orquesta los dos.

### Cómo nace un módulo

```
front/src/modules/<nombre>/
  domain/           entidades + ports
  application/      casos de uso
  infrastructure/   adapters
  presentation/     .vue
  composition.ts    fábrica
  index.ts          API pública
```

Módulos de producto (dejan el placeholder cuando tienen tabla + API): `home`, `club`, `rides`, `voice`, `shop`, `paola`, `users`, `alliances-strip`, `community`, `communities`, `social`.
Inicio no importa `rides` por dentro: se cablea en bootstrap. Inventario nuevo: MySQL vía Knex, no JSON en el front.

Componentes visuales reutilizables: `front/src/shared/ui/` (importar `@ui`). Catálogo en `/kit` (no es pestaña de producto). El kit HTML `docs/index.html` es referencia, no el portal.

### Más

- Pinia solo si la UI se vuelve ruidosa. **Reglas de negocio nunca en Pinia.**
- Vue Router al haber las 5 pestañas.
- **Hostinger:** el front y el back viven **en el mismo hosting**, un solo despliegue. No hay API en otro proveedor. En local, `iniciar.bat` / `npm run dev` levantan los dos procesos; en producción `npm start` sirve el build y el `/api` juntos.
- API en `back/` (health, salidas, cupos, alianzas, integrantes, memorias; cada fase de inventario suma tabla + endpoint). No Express dentro de un `.vue`.
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

Si una decisión de producto no está en `docs/brainstorming.md` ni en la hoja de ruta, **no la des por hecha**: o cabe en la fase, o se pregunta.
