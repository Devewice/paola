# Hoja de ruta — portal web Paola

Documento operativo. La visión vive en [`brainstorming.md`](./brainstorming.md).  
Aquí solo hay **orden de construcción**: una fase a la vez, con puntos para tachar.

**Cómo usarla**

1. No se abre la siguiente fase hasta que la actual cumple su “queda lista cuando”.
2. Cada fase lista **contenido de Paola** y **trabajo de código**, para no enredar las dos cosas.
3. Si un punto no aplica aún (no hay aliados, no hay stock), se marca **bloqueado** y se sigue; no se inventa.
4. El contador de ejemplo del repo no es producto: sale en la fase 0.

---

## Origen de datos (vinculante desde ahora)

Ya hay MySQL en Hostinger y `back/` con **Knex** (migraciones y consultas), controllers y providers. **No se vuelve a inventario en JSON ni a pegar listados en un `.vue`.**

| Qué | Dónde |
|-----|--------|
| Inventario del parche (salidas, cupos, memorias, km, integrantes, alianzas, productos, tips, denuncias, pedidos, cuentas) | **Tablas MySQL** + API en `back/` + adapter HTTP en el módulo. Tabla vacía = hueco honesto |
| Relato de `/paola` (razón, quién, por qué, para qué) | `docs/paola.md` / módulo `paola` — no es catálogo |
| Marca (logo, paleta, kit) | `docs/visual.md` y `front/src/shared/ui/` |

**Cómo se construye una pieza nueva**

1. Knex: archivo con timestamp en `back/db/migrations/` (`npm run migrate:make nombre`).
2. Provider + controller en `back/modules/<nombre-en-inglés>/` (`GET` público mínimo; `POST`/`PATCH` con clave de `/operar` o admin). Textos y límites en `constants/`. Schemas, services, middlewares e interfaces en el mismo módulo.
3. Puerto en el módulo; adapter HTTP; bootstrap cablea. El dominio no conoce `fetch` ni SQL.
4. Paola escribe filas desde `/operar` (y el panel de la fase 24). No se pide un deploy para publicar una rodada, un tip o un producto.
5. **Prohibido:** `*.json` de catálogo en `front/`, listas hardcodeadas de integrantes/aliados/productos/tips, segundo origen “por si acaso”.

**Ya está en base**

- `outings` — fase 8 (`GET /api/outings`, alta en `/operar`)
- `tickets` — fase 9 (`POST /api/outings/:id/tickets`, lista en `/operar`)
- `alliances` — fase 4 (`GET /api/alliances`, alta en `/operar`)
- `members` — fase 5 (`GET /api/members`, alta en `/operar`)
- `memories` + `memory_photos` — fase 10 (`GET /api/memories`, alta en `/operar`)
- `tips` — fase 11 (`GET /api/tips`; alta en `/operar` en fase 16)
- `products` — fase 12 (`GET /api/products`, alta en `/operar`)

Tabla vacía = hueco honesto. El primer aliado o integrante real se publica en `/operar`, no se pega en el front.

---

## Mapa de cobertura (100%)

Todo lo de la visión tiene fase. Si no está aquí, no está cubierto.

| Qué | Fase(s) |
|-----|---------|
| Cascarón, router, 5 pestañas | 0, 2 |
| Dirección visual (Paper Mario, orgánico, tríada, mascota) | 1, 27 |
| Inicio (resumen del día) | 7, 11 |
| Pestaña Paola (razón, quién, por qué, para qué, contacto, redes, video) | 3 |
| Agenda | 6, 8 |
| Apúntese pa rodar + tickets propios | 8, 9 |
| Así va el parche (integrantes) | 5 |
| Alianzas + franja lateral global | 4 |
| Únete (WhatsApp) | 4 |
| Memorias (fotos, participantes, vehículos, Instagram) | 10 |
| Conteo de km (salida + parche; luego por persona) | 10, 19 |
| Ruta de rodada (texto; mapa simple) | 8, 23 |
| Ciclo de rodada (crear → cupo → rodar → memoria) | 8–10 |
| Tu voz: educación vial | 16 |
| Tu voz: comparendos (básico + disclaimer) | 17 |
| Tu voz: denuncias (infra + abusos, moderación) | 15, 18 |
| Tienda: accesorios, ropa, marca propia | 12 |
| Tienda: colaboraciones **aparte** | 12 |
| Lavado / limpieza de cascos | 13 |
| Entrega gratis Bogotá y Soacha; fuera = aún no | 12, 14 |
| Garantía solo defectos de fabricación | 12, 14 |
| Pedido / soporte Paola (WhatsApp, correo) | 3, 14 |
| Pasarela (confidencialidad; no guarda tarjetas) | 15, 20 |
| Política de privacidad | 15 |
| Panel de usuario, compras, tickets en cuenta | 19 |
| Membresías | 21 |
| Publicidad / alianzas (sin popups, sin venta de datos) | 4, 22 |
| Eventos con ticket pago (si aplica) | 9, 22 |
| Comentarios en memorias (moderados) | 28 |
| Reacciones y compartir memoria | 29 |
| Notificaciones comunitarias (panel) | 30 |
| Perfil parcero público (opcional) | 31 |
| Amigos (vínculo simple) | 32 |
| Chat básico | 33 |
| Hilos por rodada / grupo | 34 |
| Actividad en Parchese | 35 |
| Dos canales web + WhatsApp (estrategia) | 25 |
| Comunidades persistentes en web | 36 |
| Enlace dual comunidad web ↔ WhatsApp | 37 |
| Seguir comunidades y voces | 38 |
| Feed personal (cronológico) | 39 |
| Seguir parceros (unidireccional) | 40 |
| Roles en comunidad (moderación delegada) | 41 |
| Pulso comunitario en Inicio | 42 |
| Chat y posts enriquecidos | 43 |
| Red social Paola integrada | 44 |
| Admin para una sola operadora | 24 |
| Datos en MySQL + API `back/` | 8, 9 y cada fase de inventario |
| SEO, 404, vacíos, accesibilidad, deploy, tests | 26 |
| Voces en copy de todo el sitio | 1, 27 |

---

## Decisión de producto — dos canales (Paola, 2026)

**Horizonte acordado:** el portal **sí** evoluciona a **red social del parche** en la web. No reemplaza WhatsApp: conviven.

| Canal | Rol | No es |
|-------|-----|--------|
| **WhatsApp** | Parche vivo, caliente, Únete, soporte, cobro humano | El único hogar de la comunidad para siempre |
| **Web** | Memoria, cupo, tienda, Tu voz — y **comunidades persistentes** enlazadas al parche | Clon de un motoclub genérico ni feed adictivo |

**Reglas de convivencia (vinculantes en fases 25 y 37):**

- WhatsApp **no se apaga** cuando crezca la web social.
- Cada comunidad web puede tener **enlace opcional** al grupo WA; la ficha vive en el sitio.
- El MVP sigue sin red social completa; las fases **28–44** van en orden, sin saltar candados técnicos.
- Una operadora (Paola) hasta que una fase futura diga lo contrario por escrito.

---

## Fase 0 — Cimientos

**Para qué:** dejar el repo listo para un portal, no para el demo.

**Contenido de Paola**

- [x] Dominio: `paolabiker.com` (hoy puede vivir en un dominio temporal).
- [x] Correo de contacto: `contacto@paolabiker.com`.

**Código**

- [x] Quitar el módulo `counter` de ejemplo.
- [x] Instalar Vue Router.
- [x] Layout vacío: barra, área principal, pie.
- [x] Rutas huecas de las 5 pestañas: `/` `/parchese` `/tu-voz` `/tienda` `/paola`.
- [x] Mantener arquitectura modular (puertos, `index.ts`, `bootstrap.ts`).
- [x] Confirmar `npm run dev` y `npm run build`.

**Queda lista cuando:** no hay contador; se navega entre 5 URLs aunque digan “próximamente”.

**No incluye:** diseño final, CMS, API de producto (tickets/pedidos). El cascarón `back/` + MySQL en `.env` sí: front y back salen juntos en Hostinger.

**Hosting (Paola):** un solo Hostinger. Local: `iniciar.bat`. Producción: `npm start` (estáticos + `/api`). Claves de MySQL nunca van al git.

---

## Fase 1 — Dirección visual (sin decorar todo)

**Para qué:** que el portal no se vea club genérico desde el primer pixel.

**Contenido de Paola**

- [x] Primer dibujo de la mascota cámara 360 (aunque sea boceto). Fotos en `public/mascota/` (origen: `docs/resoruces/mascota camara 360/`).
- [x] 3–5 palabras de tono: Loigca «Dato, cupo, porqué.» · Incauta «Yo estuve ahí.» · Armargura «Nombro lo injusto.»

**Código / diseño**

- [x] Paleta, tipo, textura (papel, asfalto, recorte) — no dashboard frío.
- [x] Componentes base: botón, tarjeta, título, estado vacío con hueco para la mascota.
- [x] Regla: marcos tipo recorte (Paper Mario); la mascota puede tener más volumen.
- [x] No usar ilustración stock de “motoclub corporativo”.

**Queda lista cuando:** una pantalla vacía ya se siente Paola, no Vuetify por defecto.

**No incluye:** ilustrar todas las páginas.

---

## Fase 2 — Cascarón de navegación

**Para qué:** las cinco entradas y la franja de alianzas existen como lugar, no como contenido rico.

**Código**

- [x] Menú: Inicio, Parchese, Tu voz, Tienda, Paola.
- [x] Menú móvil usable con una mano.
- [x] Franja lateral (o columna) **Alianzas** persistente: placeholder “aquí van quienes apoyan el parche”.
- [x] Pie con enlace a WhatsApp (placeholder) y a Paola.
- [x] La franja **no** se mete dentro de fichas de tienda.

**Queda lista cuando:** en cualquier pestaña se ve dónde estás y dónde están los aliados.

**Kit visual (antes de fase 3):** componentes Vue en `front/src/shared/ui/` (`@ui`), catálogo en `/kit`. Referencia HTML: `docs/index.html`.

---

## Fase 3 — Pestaña Paola

**Para qué:** la cara y el teléfono del portal. Sin esto el resto es anónimo.

**Contenido de Paola (obligatorio para publicar esta fase)**

Fuente: [`paola.md`](./paola.md).

- [x] Texto: la razón.
- [x] Texto: ¿quién es Paola?
- [x] Texto: ¿por qué lo hago?
- [x] Texto: ¿para qué lo hago?
- [x] Correo: `contacto@paolabiker.com`.
- [x] WhatsApp (número o wa.me).
- [x] Links de redes.
- [x] Video relevante (URL): canal YouTube `@5.paola.3` (aún no hay un video suelto para embeber).

**Código**

- [x] Módulo `paola`: página con esos bloques.
- [x] Botones de escribir (WhatsApp / correo) visibles.
- [x] Tono Armargura en el relato; Loigca en los datos de contacto.

**Queda lista cuando:** alguien extraño entiende quién es y puede escribirle en menos de un minuto.

---

## Fase 4 — Únete y alianzas

**Para qué:** entrar al parche y ver quién lo banca, sin tickets todavía.

**Contenido de Paola**

- [x] Link de WhatsApp para Únete: número de Paola (`wa.me/573123136679`). El **grupo** de comunidad aún no está publicado — el copy lo dice y el botón abre chat con ella.
- [x] Lista de alianzas: vacía a propósito. Texto honesto “aún estamos armando el apoyo”; cero logos inventados.

**Código**

- [x] En Parchese: bloque **Únete**.
- [x] En Parchese: bloque **Alianzas**.
- [x] La misma lista alimenta la **franja global**.
- [x] Aliado ≠ producto Paola (no hay CTA de “comprar” del aliado en Tienda).

**Queda lista cuando:** Únete abre WhatsApp y la franja muestra el mismo set que Parchese.

**Datos:** tabla `alliances` + `GET /api/alliances` (misma lista en Parchese y franja). Publica en `/operar`. Lista vacía = hueco honesto.

---

## Fase 5 — Así va el parche (integrantes)

**Para qué:** caras del club, con consentimiento.

**Contenido de Paola**

- [x] Quién sale en público: **nadie aún** (lista vacía). Alias, foto, moto e Instagram entran cuando Paola publique consentimiento.
- [x] Quién **no** sale: no hay nombres ocultos en el HTML.

**Código**

- [x] Módulo `club`: listado de integrantes.
- [x] Ficha simple, humana, no Excel.
- [x] Sin Instagram no se inventa ícono vacío agresivo.

**Queda lista cuando:** el parche se ve; nadie aparece sin haber dicho que sí.

**Datos:** tabla `members` + `GET /api/members`. Publica en `/operar` con consentimiento. Nadie se hardcodea en el front.

---

## Fase 6 — Agenda (sin cupos)

**Para qué:** “cuándo hay algo” antes de cobrar o reservar.

**Contenido de Paola**

- [x] Mensaje claro: ahora mismo no hay fecha; el parche vive en WhatsApp. (Sin rodadas inventadas.)

**Código**

- [x] Vista Agenda: fecha, título, tipo (rodada / actividad), punto.
- [x] Una actividad puede ser lavado grupal, no solo rodada (el tipo `actividad` está en dominio y en el kit).
- [x] Estados visuales: próxima / pasada (las pasadas aún sin memoria rica).

**Queda lista cuando:** se entiende el calendario aunque no se pueda reservar.

**No incluye:** tickets, km, fotos.

---

## Fase 7 — Inicio (tablero del parche)

**Para qué:** el corte del día, leyendo lo que ya existe (hoy: salidas en MySQL).

**Código / contenido**

- [x] Próxima rodada o actividad + CTA a Parchese / Apúntese (lee Agenda / `GET /api/outings`; vacío honesto + WhatsApp si no hay fecha).
- [x] Destello de memoria o km: “vamos contando” (sin número inventado; km real en fase 10).
- [x] Hueco de Tu voz (sin tip aún; no se fuerza denuncia).
- [x] Una frase de quién es Paola + enlace a `/paola`.
- [x] Tienda: no hay banner (nada real que empujar).

**Queda lista cuando:** Inicio no es un welcome genérico; es un tablero del parche.

---

## Fase 8 — Publicar una salida (ciclo empieza)

**Para qué:** Paola arma rodada/actividad con datos de verdad.

**Contenido / reglas**

- [x] Campos en entidad `Outing`: fecha, punto, ruta en texto, cupo máximo, qué llevar, rodada/actividad, gratis o de pago (cobro por WhatsApp). Origen: MySQL `outings` (vacía hoy).

**Código**

- [x] Módulo `rides`: entidad salida + estados `abierto` / `lleno` / `cerrado` / `realizado`.
- [x] Publicación: tabla MySQL `outings` (`GET /api/outings`, `POST /api/operar/outings` desde `/operar`). No hay JSON de respaldo. No hace falta CMS gordo.
- [x] Agenda y “próxima salida” leen esta entidad.
- [x] Tests de caso de uso: no se publica sin fecha ni cupo (`npm test`).

**Queda lista cuando:** Paola puede anunciar una salida y se ve en Agenda e Inicio.

**No incluye:** pago en línea, mapa embebido, GPS en vivo.

---

## Fase 9 — Apúntese pa rodar (tickets propios)

**Para qué:** cupo con registro, sin Eventbrite.

**Código**

- [x] Formulario: nombre, WhatsApp, moto (opcional). `POST /api/outings/:id/tickets` → tabla `tickets`.
- [x] Descontar cupo; al llenarse → `lleno`.
- [x] Aviso a Paola (WhatsApp, correo o lista en `/operar`).
- [x] Cerrar inscripción (`cerrado`) a mano (`POST /api/operar/salidas/:id/estado`).
- [x] Al marcar `realizado`, ya no se venden cupos.
- [x] Tests: no hay overbooking.

**Queda lista cuando:** una persona reserva, Paola se entera, y el cupo no se pasa.

**No incluye:** cuenta de usuario (puede ser solo el form). Eventos pagos en pasarela van en fase 22.

---

## Fase 10 — Memorias y kilómetros

**Para qué:** lo rodado no se evapora.

**Contenido de Paola (por salida realizada)**

- [ ] Km de esa salida.
- [ ] Fotos.
- [ ] Participantes y vehículos (con permiso).
- [ ] Instagram si lo dieron.

**Código**

- [x] Tabla `memories` ligada a `outings` (`realizado`): km, texto de cierre, crédito. Tabla `memory_photos` (ruta/archivo + alt). `GET /api/memories`. Alta desde `/operar`, no JSON.
- [x] Km de la salida + **km acumulado del parche** (suma SQL, no un número en el `.vue`).
- [x] Galería simple; crédito / link de redes, sin scrapear Instagram.
- [x] Cámara Incauta en el recuento visual; Armargura puede cerrar con un párrafo.

**Queda lista cuando:** hay al menos una memoria completa en MySQL y el km del parche no es un número inventado en el Inicio.

**Contenido de Paola:** los puntos de arriba se marcan cuando Paola publique la primera memoria real (km, fotos con enlace, permiso). El código ya está; la tabla puede estar vacía.

---

## Fase 11 — Inicio vivo

**Para qué:** el tablero lee MySQL (salidas ya; memorias/km/tips cuando existan), no copy pegado.

**Código**

- [x] Inicio lee APIs: próxima salida (`outings`), último destello de `memories`, km del parche, frase Paola, un tip de `tips` si hay fila.
- [x] Si no hay próxima salida: estado vacío con mascota + Únete (como ahora).
- [x] Tabla `tips` + `GET /api/tips`. Módulo `voice` mínimo. `refreshInventory()` al entrar a Inicio y tras publicar en `/operar`.

**Queda lista cuando:** publicar o editar una fila (rodada, memoria, km) actualiza Inicio sin tocar la vista.

**Contenido de Paola:** tips en MySQL entran en fase 16 (alta en `/operar`). Hoy la tabla puede estar vacía; Inicio muestra el hueco honesto.

---

## Fase 12 — Tienda vitrina (sin checkout)

**Para qué:** oficio visible, reglas honestas, marca sin mezclar.

**Contenido de Paola**

- [ ] Piezas propias (accesorios / ropa) con precio o “preguntar”.
- [ ] Si hay collab: **estantería aparte**, nunca en la misma ficha que lo propio.
- [x] Copy fijo: entrega gratis **solo Bogotá y Soacha**; fuera “aún no”.
- [x] Copy fijo: garantía **solo defectos de fabricación**.

**Código**

- [x] Tabla `products` (propia vs colaboración, precio o “preguntar”, stock opcional). `GET /api/products`. Alta en `/operar`.
- [x] Módulo `shop`: catálogo y ficha desde la API; dos estanterías (propia / colaboración) **sin mezclar filas**.
- [x] CTA: escribir a Paola (aún no pasarela).
- [x] Franja de alianzas sigue fuera de la ficha.

**Queda lista cuando:** se entiende qué se vende, dónde llega, qué cubre la garantía, y no se mezcla marca.

**Contenido de Paola:** las piezas reales se publican en `/operar`. Hoy la tabla puede estar vacía; Tienda muestra el hueco honesto y las reglas.

---

## Fase 13 — Lavado de cascos

**Para qué:** el servicio no se pierde dentro de “productos”.

**Código / contenido**

- [ ] Ficha de servicio en MySQL (tabla `services` o `products` con tipo `lavado`): qué incluye, cómo se entrega el casco, tiempo. No un bloque fijo eterno en el `.vue` salvo copy de reglas.
- [ ] Garantía de servicio: “si quedó mal, se corrige” (distinta a la de producto).
- [ ] CTA WhatsApp / correo.

**Queda lista cuando:** se puede pedir el lavado sin confundirlo con una gorra.

---

## Fase 14 — Pedido por Paola (`PaymentPort` WhatsApp)

**Para qué:** comprar sin pasarela, con rastro para ella.

**Código**

- [ ] Puerto de pago: adapter “escribir a Paola”.
- [ ] Pedido arma mensaje (ítem, talla, ciudad Bogotá/Soacha u “otra = no aplica”).
- [ ] Fuera de Bogotá/Soacha: no deja pagar envío inventado; dice aún no.
- [ ] Tabla `pedidos` + `POST /api/pedidos`. Lista para Paola en `/operar` (no JSON suelto ni solo el correo).

**Queda lista cuando:** un pedido llega a Paola con los datos y las reglas de entrega/garantía repetidas.

---

## Fase 15 — Legal mínimo (antes de datos sensibles)

**Para qué:** privacidad “después” de la lluvia = **antes** de cuentas, pasarela o denuncias.

**Contenido (con Paola / asesor si hace falta)**

- [ ] Política de privacidad (qué datos, para qué, WhatsApp, fotos).
- [ ] Aviso: denuncias no sustituyen autoridad.
- [ ] Aviso: comparendos no son asesoría jurídica.
- [ ] Criterio corto de moderación (linchamiento, menores, venganza = no se publica).

**Código**

- [ ] Páginas `/privacidad` y avisos enlazados en pie y en Tu voz / Tienda.
- [ ] Checkbox de “leí el aviso” donde se vaya a subir foto o dato personal.

**Queda lista cuando:** no se pide dato sensible sin aviso a la vista.

---

## Fase 16 — Tu voz: educación vial

**Para qué:** Moto Loigca útil, no manifiesto vacío.

**Contenido de Paola**

- [ ] Varios tips cortos (Colombia, moto). Enlaces a norma oficial si se cita.

**Código**

- [ ] Tabla `tips` (título, cuerpo, enlace oficial opcional). `GET /api/tips`. Alta en `/operar`.
- [ ] Módulo `voice`: listado + ficha de tip desde la API.
- [ ] Inicio puede mostrar un tip si hay fila.

**Queda lista cuando:** hay al menos un puñado de tips publicables en MySQL.

---

## Fase 17 — Tu voz: comparendos (básico)

**Para qué:** orientar sin fingir bufete.

**Código / contenido**

- [ ] Tabla `comparendos` (o `tips` con tipo `comparendo`): guía, enlace oficial, disclaimer. `GET` público.
- [ ] Guías de comparendos frecuentes en moto (filas reales, no un artículo único hardcodeado para siempre).
- [ ] Enlaces a consulta/pago **oficial**.
- [ ] Disclaimer fijo en cada ficha.
- [ ] Nada de formularios que parezcan de la autoridad.

**Queda lista cuando:** sirve para entender y para ir al canal oficial, no para “arreglarte el comparendo”.

---

## Fase 18 — Tu voz: denuncias

**Para qué:** constancia comunitaria (alcantarillas, calles, abusos).

**Código**

- [ ] Tabla `denuncias` (qué, dónde, cuándo, evidencia, estado de moderación). `POST /api/denuncias`; cola en `/operar`.
- [ ] Formulario: qué pasó, dónde, cuándo, evidencia (foto).
- [ ] Copy Armargura + evidencia Incauta + (opcional) nota Loigca.
- [ ] Cola de moderación: Paola publica / oculta / rechaza (update en MySQL).
- [ ] No doxxing: no exigir cédula de terceros; no publicar datos de menores.
- [ ] Aviso: no reemplaza denuncia formal.

**Queda lista cuando:** se puede enviar, Paola decide qué se ve, y lo publicado no parece tribunal.

**No se abre si la fase 15 no está hecha.**

---

## Fase 19 — Cuentas y panel de usuario

**Para qué:** tickets y compras “a tu nombre”, no red social.

**Código**

- [ ] Tablas `usuarios` (y sesión). Registro / login. No JSON de cuentas.
- [ ] Panel: mis tickets (`tickets` a su nombre), mis pedidos, mis datos — lecturas SQL, no lista local.
- [ ] Km personal **opcional** (si la persona quiere; columna o tabla, no un número pintado).
- [ ] El sitio sigue siendo browsable sin cuenta.
- [ ] Login exigido para: ticket a tu nombre, pedido en historial, publicar denuncia (si se decide así).

**Queda lista cuando:** Paola y la persona ven el mismo cupo/pedido sin rebuscar en WhatsApp.

**No incluye:** amigos, chat, feed.

---

## Fase 20 — Pasarela de pago

**Para qué:** cobrar sin que el sitio toque números de tarjeta.

**Código**

- [ ] Segundo adapter de `PaymentPort` (Wompi, Mercado Pago u otro en Colombia).
- [ ] El camino “escribir a Paola” **sigue existiendo**.
- [ ] No guardar tarjetas.
- [ ] Confirmación de pedido pagado en panel.

**Queda lista cuando:** se puede pagar en línea o seguir por WhatsApp, a elección.

**No se abre si 14 y 15 no están hechas.**

---

## Fase 21 — Membresías

**Para qué:** aporte al parche con beneficio escrito. **Bloqueada** hasta definir precio y qué incluye.

**Contenido de Paola (antes de código)**

- [ ] Precio y periodo (mes / temporada).
- [ ] Qué da: prioridad de cupo, merch, voz, otra cosa. Sin eso no se programa.

**Código (cuando esté definido)**

- [ ] Tabla `membresias` (persona, periodo, estado). Alta / renovación (Paola en `/operar` o pasarela).
- [ ] Distinción integrante visible ≠ membresía paga (si no son lo mismo, el copy lo dice).

**Queda lista cuando:** nadie paga “membresía” sin saber qué recibe.

---

## Fase 22 — Eventos de pago y publicidad

**Para qué:** no todas las salidas cobran; las que sí, y los aliados, con reglas.

**Código / contenido**

- [ ] Una salida puede ser gratis o de pago (precio en la ficha / columna en `outings`, no un texto suelto en la vista).
- [ ] Pago de ticket: WhatsApp y/o pasarela según fases 14/20; rastro en `tickets` / `pedidos`.
- [ ] Publicidad = alianzas en Parchese / franja. **Cero popups. Cero venta de datos.**
- [ ] Un aliado no se convierte en producto Paola.

**Queda lista cuando:** se puede cobrar un evento sin romper la marca ni spamear.

---

## Fase 23 — Mapa de ruta (simple)

**Para qué:** ver el recorrido, no trackear a nadie en vivo.

**Código**

- [ ] Mapa embebido o imagen del recorrido previsto (campo en `outings` o tabla `outing_routes`; no un mapa inventado en el front).
- [ ] Punto de encuentro claro (ya en `outings.meeting_point`).
- [ ] Sin GPS en vivo.

**Queda lista cuando:** quien no conoce la zona entiende dónde juntarse y por dónde se piensa ir.

---

## Fase 24 — Admin de Paola (una operadora)

**Para qué:** que ella no pida un deploy para subir una foto.

**Código**

- [ ] Panel privado (clave fuerte o auth de fase 19). Amplía `/operar`, no un CMS aparte.
- [ ] CRUD en MySQL: salidas, cupos, marcar realizado, memorias, integrantes, alianzas, productos, tips, denuncias (moderar).
- [ ] Pensado para **una sola persona**, no para un equipo 24/7.

**Queda lista cuando:** Paola publica una rodada y una memoria sin tocar código ni SQL a mano (salvo emergencia).

---

## Fase 25 — Dos canales: web + WhatsApp

**Para qué:** fijar la estrategia antes de acelerar **32–44**. Paola decidió que la web será **otro canal** de comunidad; WhatsApp sigue como alternativa cercana.

**Contenido de Paola**

- [ ] Copy oficial: qué va en web vs qué va en WhatsApp (Únete, rodada urgente, soporte pedido).
- [ ] Reglas de anuncios duplicados: qué se cross-postea y qué es exclusivo de cada canal.
- [ ] Enlace del grupo WA en `/parchese` / Únete **sigue visible**.

**Código**

- [ ] Página o bloque **“Dónde hablamos”**: web (cuenta, comunidades, tickets) vs WhatsApp (parche vivo).
- [ ] En admin: campo opcional `whatsapp_grupo` por comunidad (fase 36) o por rodada.
- [ ] Métricas mínimas: no vender datos; solo operación Paola.

**Queda lista cuando:** un parcero entiende dónde apuntarse, dónde chatear y dónde queda la memoria — sin confusión.

**No incluye:** apagar WhatsApp, sync automático bidireccional WA↔web (fase 37 lo aborda simple).

---

## Fase 28 — Comentarios en memorias (comunidad MVP)

**Para qué:** conversación **moderada** sobre lo rodado, sin red social.

**Candado:** fases **15** (legal), **10** (memorias publicadas), **19** (cuenta para comentar).

**Contenido / reglas**

- [ ] Normas visibles: respeto, no doxxing, no menores identificables, constancia comunitaria.
- [ ] Paola puede fijar comentario con reglas del parche.

**Código**

- [ ] Tabla `memoria_comentarios` (memoria, autor, texto, estado de moderación). Módulo `community` (o extensión de memorias): hilo por memoria publicada.
- [ ] Composer: texto, límite de caracteres, login obligado.
- [ ] Estados: enviado → en revisión → publicado / rechazado (autor ve su pendiente).
- [ ] Respuestas **un nivel** (comentario → respuesta, no árbol infinito).
- [ ] Acciones: reportar, responder; Paola: fijar, ocultar, eliminar (admin fase 24).
- [ ] Denuncias publicadas: comentarios **cerrados** o desactivados (solo lectura).
- [ ] Tests: no publicar sin moderación si así se configuró; no datos de terceros en campos libres obvios.

**Queda lista cuando:** en una memoria real se comenta, Paola modera, y no parece foro abierto ni chat.

**No incluye:** @menciones con notificación masiva, MD rico, adjuntos en comentario (fase posterior si hace falta).

---

## Fase 29 — Reacciones y compartir

**Para qué:** engagement ligero en memorias sin gamificación tóxica.

**Candado:** fase **28** o memorias estables; **15** legal (qué se cuenta, si aplica).

**Código**

- [ ] Barra de reacciones (iconos SVG propios, no emoji sistema obligatorio).
- [ ] Conteo visible pero discreto; sin ranking “más popular”.
- [ ] Compartir: enlace a memoria `#comentarios`, botón WhatsApp.
- [ ] Preview OG al compartir (coherente con fase 26).
- [ ] Una persona = una reacción por tipo (o toggle), no bots.

**Queda lista cuando:** se puede reaccionar y compartir una memoria sin popup ni tracker invasivo.

**No incluye:** stories, reels, feed de reacciones.

---

## Fase 30 — Notificaciones comunitarias (panel)

**Para qué:** avisos útiles en cuenta, no campana infinita.

**Candado:** fase **19** (panel usuario).

**Código**

- [ ] Lista en panel: “tu comentario fue publicado”, “Paola respondió”, “memoria nueva del parche” (opt-in).
- [ ] Preferencias: activar/desactivar por tipo (sin venta de datos).
- [ ] **No** push en tiempo real agresivo al inicio (correo o badge en panel basta).
- [ ] Sin notificar cada reacción a menos que Paola lo pida por escrito.

**Queda lista cuando:** el usuario ve lo relevante en su panel sin instalar app de chat.

**No incluye:** notificaciones marketing, popups.

---

## Fase 31 — Perfil parcero público (opcional)

**Para qué:** alias humano en comentarios y km, no perfil de influencer.

**Candado:** fase **19**; consentimiento explícito para aparecer.

**Contenido de Paola**

- [ ] Qué campos son públicos: alias, avatar, km opcional, moto opcional.
- [ ] Qué **nunca** es público: WhatsApp, correo, documento.

**Código**

- [ ] Ficha `/parcero/:alias` mínima o modal desde comentario.
- [ ] Badge “integrante” vs visita si aplica (distinto de membresía paga, fase 21).
- [ ] Integrante del club (fase 5) ≠ perfil de cuenta; el copy lo aclara.

**Queda lista cuando:** un comentario muestra alias coherente y no filtra contacto privado.

**No incluye:** seguidores, biografía larga, feed personal.

---

## Fase 32 — Amigos (vínculo simple)

**Para qué:** vínculo mutual entre parceros en la web (red social en crecimiento).

**Candado:** fases **28–31** estables; **25** (dos canales) documentada.

**Código**

- [ ] Solicitud / aceptar / bloquear (bloqueo mutuo silencioso).
- [ ] Lista en cuenta o Parchese; no exponer número WA.
- [ ] Coexiste con grupo WA: copy claro “también nos vemos en WhatsApp”.

**Queda lista cuando:** dos parceros se vinculan en web sin obligar a dejar el grupo WA.

**No incluye:** scraping de contactos del teléfono.

---

## Fase 33 — Chat básico

**Para qué:** mensajería en portal como **canal web**, paralela a WA.

**Candado:** **25**, **32** o comunidad con chat (fase 36+).

**Código**

- [ ] Tablas de chat en MySQL (hilos, mensajes). Hilos 1:1 y grupos; texto + foto moderada. No un store solo en el navegador.
- [ ] Reportar mensaje; Paola silencia hilo.
- [ ] Copy: chat web + WA son complementos; emergencias = líneas oficiales.

**Queda lista cuando:** un hilo web funciona y el grupo WA puede seguir activo sin conflicto.

**No incluye:** videollamada, E2E fingido.

---

## Fase 34 — Hilos por rodada / grupo

**Para qué:** coordinación post-apunte en web (persistente en la ficha de la salida).

**Candado:** **9**, **25**, preferible **33**.

**Código**

- [ ] Hilo por salida para quien tiene ticket; enlace desde ticket y comunidad.
- [ ] Solo lectura tras `realizado`; archivo en memoria.
- [ ] Avisos Paola fijados (Moto Loigca); opción “también enviado al WA”.

**Queda lista cuando:** cupo + chat web + WA conviven con reglas claras.

**No incluye:** GPS en vivo.

---

## Fase 35 — Actividad en Parchese

**Para qué:** pulso del parche en web antes del feed personal completo.

**Candado:** **28–29**; **25**.

**Código**

- [ ] Pestaña **Actividad** en Parchese: cronológico, destacados manuales Paola.
- [ ] Mezcla memorias, rodadas, comunidades (cuando existan).
- [ ] Sin algoritmo “para ti” opaco.

**Queda lista cuando:** Parchese es el centro social inicial de la web.

**No incluye:** feed infinito en Inicio (eso es fase 42 con reglas).

---

## Fase 36 — Comunidades persistentes (web)

**Para qué:** grupos con **hogar en el sitio** — no solo hilos efímeros de rodada.

**Candado:** **25**, **31**, **35**.

**Contenido de Paola**

- [ ] Primeras comunidades reales (ej. parche general, servicio cascos, ruta Anapoima alumni) — nombres y reglas por definir.

**Código**

- [ ] Tabla `comunidades` (slug, nombre, descripción, reglas, portada). `GET /api/comunidades`. Entidad `Community` en el módulo.
- [ ] Unirse / salir (tabla de membresía a comunidad); directorio en Parchese.
- [ ] Vincular rodadas, memorias y tips a una comunidad (FK, no listas en JSON).
- [ ] Módulo `communities` desacoplado (puertos en bootstrap).

**Queda lista cuando:** una comunidad tiene URL propia y contenido enlazado.

**No incluye:** comunidades privadas de pago (membresía fase 21 puede acoplarse después).

---

## Fase 37 — Enlace dual web ↔ WhatsApp

**Para qué:** la misma comunidad, **dos entradas**; web como registro, WA como calor.

**Candado:** **36**.

**Código**

- [ ] Ficha comunidad: botón “Grupo WhatsApp” (link real cuando exista) + “Quedarse en la web”.
- [ ] Bloque copy: no es obligatorio estar en ambos; sí recomendado para rodadas urgentes.
- [ ] Admin: publicar aviso en web con checkbox “recordar en WA” (manual, no bot al inicio).

**Queda lista cuando:** desde la ficha web se entiende y se llega al WA sin perder la memoria en sitio.

**No incluye:** sincronización automática de todos los mensajes WA→web.

---

## Fase 38 — Seguir comunidades y voces

**Para qué:** suscripción ligera sin amistad mutual.

**Candado:** **36**.

**Código**

- [ ] Seguir / dejar de seguir comunidad.
- [ ] Seguir canal “voces” (tips Loigca, memorias Incauta) si Paola los separa.
- [ ] Lista “Mis comunidades” en panel.

**Queda lista cuando:** el feed (fase 39) puede filtrar por suscripciones.

**No incluye:** notificar cada post por push agresivo.

---

## Fase 39 — Feed personal (cronológico)

**Para qué:** **red social en web** — timeline de lo que seguís.

**Candado:** **38**, **32** opcional.

**Código**

- [ ] Ruta `/feed` o pestaña en cuenta: posts de comunidades + amigos + Paola, leídos de MySQL con paginación.
- [ ] Orden cronológico con paginación; destacados manuales Paola.
- [ ] Crear post corto en comunidad (texto + foto moderada) — tabla `posts`, no solo comentarios en memoria.

**Queda lista cuando:** un parcero ve actividad relevante sin scrollear WA.

**No incluye:** algoritmo viral, publicidad, trending opaco.

---

## Fase 40 — Seguir parceros (unidireccional)

**Para qué:** seguir alias públicos sin ser “amigos”.

**Candado:** **31**, **39**.

**Código**

- [ ] Seguir / silenciar parcero (perfil fase 31).
- [ ] Privacidad: ocultar perfil, solo amigos ven km, etc.
- [ ] Aparece en feed solo si es público o amigo.

**Queda lista cuando:** seguir no expone WhatsApp ni datos sensibles.

**No incluye:** verificación azul pagada, influencers externos.

---

## Fase 41 — Roles en comunidad

**Para qué:** escalar moderación sin equipo 24/7 — delegados de confianza.

**Candado:** **36**, **24** (admin).

**Contenido de Paola**

- [ ] Quién puede ser moderador delegado (lista corta, revocable).

**Código**

- [ ] Rol `moderador` por comunidad: ocultar post, pin, no ban global.
- [ ] Paola mantiene ban global y denuncias Tu voz.
- [ ] Log de acciones moderación.

**Queda lista cuando:** una comunidad activa no depende solo del chat WA para orden.

**No incluye:** tribunal comunitario, expulsión permanente automática.

---

## Fase 42 — Pulso comunitario en Inicio

**Para qué:** Inicio muestra **módulo** del parche social, sin convertirse en TikTok.

**Candado:** **39**, **11** (Inicio vivo).

**Código**

- [ ] Widget “De tus comunidades”: 3–5 ítems recientes + enlace al feed.
- [ ] Tablero del día (rodada, km, Paola) **sigue primero**.
- [ ] Sin autoplay video infinito.

**Queda lista cuando:** Inicio integra lo social sin perder el resumen del día.

**No incluye:** feed infinito como pantalla principal.

---

## Fase 43 — Chat y posts enriquecidos

**Para qué:** profundizar chat web y publicaciones (voz, álbum, respuestas anidadas).

**Candado:** **33**, **39**.

**Código**

- [ ] Notas de voz cortas en chat (moderadas).
- [ ] Álbum en post de comunidad; hilos de respuesta en posts (más de un nivel, con límite).
- [ ] Reacciones en posts (reuse fase 29).

**Queda lista cuando:** la web cubre conversación rica sin mandar todo a WA.

**No incluye:** stories 24h, live streaming.

---

## Fase 44 — Red social Paola integrada

**Para qué:** cierre del arco social — auditoría, módulo, marca.

**Candado:** **36–43**; repetir checklist **27** en contexto social.

**Código**

- [ ] Módulo `social` (o composición en bootstrap): communities, feed, chat, friends — **desacoplados**, cableados en bootstrap.
- [ ] Tests: moderación, bloqueo, no filtrar WA en API pública.
- [ ] Privacidad actualizada (fase 15 revision): datos de chat, retención, exportar cuenta.
- [ ] Auditoría: ¿sigue sintiéndose Paola y no Facebook motero?

**Queda lista cuando:** la web es canal social completo del parche y WhatsApp sigue como alternativa documentada.

**No incluye:** GPS en vivo, envío nacional, marketplace.

---

## Fase 26 — Producción, confianza y extras de cobertura

**Para qué:** que el 100% no se rompa al salir a internet.

**Código / ops**

- [ ] Hosting + HTTPS + dominio.
- [ ] Favicon, títulos, descripción, preview al compartir (WhatsApp / IG).
- [ ] 404 y páginas vacías con mascota, no error crudo.
- [ ] Accesibilidad básica (contraste, foco, alt en fotos de memorias).
- [ ] Backup de fotos y de datos de cupos/pedidos.
- [ ] Tests de casos de uso: cupo, km, pedido, estados de salida.
- [ ] Sin analytics invasivos; si hay conteo, que no venda datos (coherente con alianzas).
- [ ] Envío nacional: **no** hasta que exista regla nueva (hoy está explícitamente fuera).

**Queda lista cuando:** se puede mandar el link del portal sin miedo a que se vea a medias.

---

## Fase 27 — Auditoría de voces y marca

**Para qué:** el último filtro: ¿se siente Paola o un club cualquiera?

**Checklist de pantallas**

- [ ] Inicio: Loigca (dato), Incauta (imagen), Armargura (gancho).
- [ ] Rodada anunciada: Loigca.
- [ ] Memoria: Incauta + cierre Armargura si hay algo que decir.
- [ ] Denuncia: Armargura + Incauta + Loigca opcional.
- [ ] Tienda: Loigca (precio, entrega, garantía); sin mezclar aliados.
- [ ] Pestaña Paola: Armargura en relato, Loigca en contacto, Incauta en video.
- [ ] Mascota 360 en vacíos / guía, no de adorno en todas las fotos.
- [ ] Prueba: “¿esto podría ser Motoclub o BSK sin que se note?” Si sí, se rehace.

**Queda lista cuando:** esa prueba se falla a propósito (se nota Paola).

---

## Orden de las puertas (no saltar)

```
0 → 1 → 2 → 3 → 4 → 5 → 6 → 7
                 ↓
            8 → 9 → 10 → 11
                 ↓
            12 → 13 → 14
                 ↓
            15 → 16 → 17 → 18
                 ↓
            19 → 20 → 21 → 22
                 ↓
            23 → 24 → 25
                 ↓
     Comunidad web (MVP social):
            28 → 29 → 30 → 31
                 ↓
     Social en crecimiento:
            32 → 33 → 34 → 35
                 ↓
            26 → 27
                 ↓
     Red social Paola (horizonte acordado):
            36 → 37 → 38 → 39 → 40 → 41 → 42 → 43 → 44
```

- **15** candado de **18** y **20**.
- **21** candada por contenido (precio y beneficios).
- **28** candado: **15**, **10**, **19**.
- **25** documenta **dos canales** (web + WhatsApp); WA **no se apaga**.
- **36–44** es el camino a red social en web; **no** es MVP inicial.

---

## Fuera de esta hoja (a propósito)

- GPS en vivo de la rodada.
- Marketplace de terceros.
- Trámite o representación de comparendos.
- Envío nacional (hasta nueva regla).
- Red social completa **en el primer corte** (MVP); el horizonte **36–44** está planificado.
- Comentarios públicos sin moderación ni legal (**28** exige **15**).
- Apagar WhatsApp cuando exista la web social.
- Equipo de moderación 24/7 (salvo fase **41** delegada y acotada).

Cuando algo de esa lista se vuelva sí, se añade **fase nueva** aquí; no se cuela en una fase ya tachada.
