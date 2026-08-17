# Hoja de ruta — portal web Paola

Documento operativo. La visión vive en [`brainstorming.md`](./brainstorming.md).  
Aquí solo hay **orden de construcción**: una fase a la vez, con puntos para tachar.

**Cómo usarla**

1. No se abre la siguiente fase hasta que la actual cumple su “queda lista cuando”.
2. Cada fase lista **contenido de Paola** y **trabajo de código**, para no enredar las dos cosas.
3. Si un punto no aplica aún (no hay aliados, no hay stock), se marca **bloqueado** y se sigue; no se inventa.
4. El contador de ejemplo del repo no es producto: sale en la fase 0.

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
| Amigos y chat | 25 |
| Admin para una sola operadora | 24 |
| SEO, 404, vacíos, accesibilidad, deploy, tests | 26 |
| Voces en copy de todo el sitio | 1, 27 |

---

## Fase 0 — Cimientos

**Para qué:** dejar el repo listo para un portal, no para el demo.

**Contenido de Paola**

- [ ] Dominio o subdominio donde va a vivir (aunque sea después).
- [ ] Correo que se usará de contacto (aunque el texto largo de “quién soy” aún no exista).

**Código**

- [ ] Quitar el módulo `counter` de ejemplo.
- [ ] Instalar Vue Router.
- [ ] Layout vacío: barra, área principal, pie.
- [ ] Rutas huecas de las 5 pestañas: `/` `/parchese` `/tu-voz` `/tienda` `/paola`.
- [ ] Mantener arquitectura modular (puertos, `index.ts`, `bootstrap.ts`).
- [ ] Confirmar `npm run dev` y `npm run build`.

**Queda lista cuando:** no hay contador; se navega entre 5 URLs aunque digan “próximamente”.

**No incluye:** diseño final, CMS, API.

---

## Fase 1 — Dirección visual (sin decorar todo)

**Para qué:** que el portal no se vea club genérico desde el primer pixel.

**Contenido de Paola**

- [ ] Primer dibujo de la mascota cámara 360 (aunque sea boceto).
- [ ] 3–5 palabras de tono: cómo habla Armargura, Incauta y Loigca (una frase cada una).

**Código / diseño**

- [ ] Paleta, tipo, textura (papel, asfalto, recorte) — no dashboard frío.
- [ ] Componentes base: botón, tarjeta, título, estado vacío con hueco para la mascota.
- [ ] Regla: marcos tipo recorte (Paper Mario); la mascota puede tener más volumen.
- [ ] No usar ilustración stock de “motoclub corporativo”.

**Queda lista cuando:** una pantalla vacía ya se siente Paola, no Vuetify por defecto.

**No incluye:** animaciones 360, ilustrar todas las páginas.

---

## Fase 2 — Cascarón de navegación

**Para qué:** las cinco entradas y la franja de alianzas existen como lugar, no como contenido rico.

**Código**

- [ ] Menú: Inicio, Parchese, Tu voz, Tienda, Paola.
- [ ] Menú móvil usable con una mano.
- [ ] Franja lateral (o columna) **Alianzas** persistente: placeholder “aquí van quienes apoyan el parche”.
- [ ] Pie con enlace a WhatsApp (placeholder) y a Paola.
- [ ] La franja **no** se mete dentro de fichas de tienda.

**Queda lista cuando:** en cualquier pestaña se ve dónde estás y dónde están los aliados.

---

## Fase 3 — Pestaña Paola

**Para qué:** la cara y el teléfono del portal. Sin esto el resto es anónimo.

**Contenido de Paola (obligatorio para publicar esta fase)**

- [ ] Texto: la razón.
- [ ] Texto: ¿quién es Paola?
- [ ] Texto: ¿por qué lo hago?
- [ ] Texto: ¿para qué lo hago?
- [ ] Correo.
- [ ] WhatsApp (número o wa.me).
- [ ] Links de redes.
- [ ] Video relevante (URL). Si aún no hay video: bloque “próximamente” explícito, no un hueco mudo.

**Código**

- [ ] Módulo `paola`: página con esos bloques.
- [ ] Botones de escribir (WhatsApp / correo) visibles.
- [ ] Tono Armargura en el relato; Loigca en los datos de contacto.

**Queda lista cuando:** alguien extraño entiende quién es y puede escribirle en menos de un minuto.

---

## Fase 4 — Únete y alianzas

**Para qué:** entrar al parche y ver quién lo banca, sin tickets todavía.

**Contenido de Paola**

- [ ] Link real de la comunidad WhatsApp.
- [ ] Lista de alianzas (nombre, qué apoyan, logo o frase). Si no hay ninguna: texto honesto “aún estamos armando el apoyo”, no logos inventados.

**Código**

- [ ] En Parchese: bloque **Únete**.
- [ ] En Parchese: bloque **Alianzas**.
- [ ] La misma lista alimenta la **franja global**.
- [ ] Aliado ≠ producto Paola (no hay CTA de “comprar” del aliado en Tienda).

**Queda lista cuando:** Únete abre WhatsApp y la franja muestra el mismo set que Parchese.

---

## Fase 5 — Así va el parche (integrantes)

**Para qué:** caras del club, con consentimiento.

**Contenido de Paola**

- [ ] Quién sale en público (alias, foto o avatar, moto opcional, Instagram opcional).
- [ ] Quién **no** sale (queda fuera; no hay lista oculta en el HTML).

**Código**

- [ ] Módulo `club`: listado de integrantes.
- [ ] Ficha simple, humana, no Excel.
- [ ] Sin Instagram no se inventa ícono vacío agresivo.

**Queda lista cuando:** el parche se ve; nadie aparece sin haber dicho que sí.

---

## Fase 6 — Agenda (sin cupos)

**Para qué:** “cuándo hay algo” antes de cobrar o reservar.

**Contenido de Paola**

- [ ] Al menos una actividad o rodada futura **o** un mensaje claro de “ahora mismo no hay fecha; el parche vive en WhatsApp”.

**Código**

- [ ] Vista Agenda: fecha, título, tipo (rodada / actividad), punto.
- [ ] Una actividad puede ser lavado grupal, no solo rodada.
- [ ] Estados visuales: próxima / pasada (las pasadas aún sin memoria rica).

**Queda lista cuando:** se entiende el calendario aunque no se pueda reservar.

**No incluye:** tickets, km, fotos.

---

## Fase 7 — Inicio (resumen, aún a mano)

**Para qué:** el corte del día, aunque los datos se peguen a mano.

**Código / contenido**

- [ ] Próxima rodada o actividad + CTA a Parchese / Apúntese (aunque Apúntese aún diga “por WhatsApp”).
- [ ] Destello de memoria o km (número provisional o “vamos contando”).
- [ ] Hueco de Tu voz (tip o frase; si no hay, no se fuerza denuncia).
- [ ] Una frase de quién es Paola + enlace a `/paola`.
- [ ] Tienda: solo si hay algo real que empujar; si no, no hay banner de shop.

**Queda lista cuando:** Inicio no es un welcome genérico; es un tablero del parche.

---

## Fase 8 — Publicar una salida (ciclo empieza)

**Para qué:** Paola arma rodada/actividad con datos de verdad.

**Contenido / reglas**

- [ ] Campos: fecha, punto de encuentro, ruta en texto, cupo máximo, qué llevar, si es rodada o actividad, si el cupo es gratis o de pago (aunque el cobro sea “se avisa por WhatsApp”).

**Código**

- [ ] Módulo `rides`: entidad salida + estados `abierto` / `lleno` / `cerrado` / `realizado`.
- [ ] Publicación: al inicio JSON o panel mínimo; no hace falta CMS gordo.
- [ ] Agenda y “próxima salida” leen esta entidad.
- [ ] Tests de caso de uso: no se publica sin fecha ni cupo.

**Queda lista cuando:** Paola puede anunciar una salida y se ve en Agenda e Inicio.

**No incluye:** pago en línea, mapa embebido, GPS en vivo.

---

## Fase 9 — Apúntese pa rodar (tickets propios)

**Para qué:** cupo con registro, sin Eventbrite.

**Código**

- [ ] Formulario: nombre, WhatsApp, moto (opcional).
- [ ] Descontar cupo; al llenarse → `lleno`.
- [ ] Aviso a Paola (WhatsApp, correo o lista que ella ve).
- [ ] Cerrar inscripción (`cerrado`) a mano.
- [ ] Al marcar `realizado`, ya no se venden cupos.
- [ ] Tests: no hay overbooking.

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

- [ ] Una memoria por salida `realizado`.
- [ ] Km de la salida + **km acumulado del parche**.
- [ ] Galería simple; crédito / link de redes, sin scrapear Instagram.
- [ ] Cámara Incauta en el recuento visual; Armargura puede cerrar con un párrafo.

**Queda lista cuando:** hay al menos una memoria completa y el km del parche no es un número inventado en el Inicio.

---

## Fase 11 — Inicio vivo

**Para qué:** el resumen deja de ser copy pegado.

**Código**

- [ ] Inicio lee: próxima salida real, último destello de memoria, km del parche, frase Paola, hueco de Tu voz si existe contenido.
- [ ] Si no hay próxima salida: estado vacío con mascota + Únete.

**Queda lista cuando:** cambiar una rodada actualiza Inicio sin editar la página a mano.

---

## Fase 12 — Tienda vitrina (sin checkout)

**Para qué:** oficio visible, reglas honestas, marca sin mezclar.

**Contenido de Paola**

- [ ] Piezas propias (accesorios / ropa) con precio o “preguntar”.
- [ ] Si hay collab: **estantería aparte**, nunca en la misma ficha que lo propio.
- [ ] Copy fijo: entrega gratis **solo Bogotá y Soacha**; fuera “aún no”.
- [ ] Copy fijo: garantía **solo defectos de fabricación**.

**Código**

- [ ] Módulo `shop`: catálogo, ficha, dos estanterías (propia / colaboración).
- [ ] CTA: escribir a Paola (aún no pasarela).
- [ ] Franja de alianzas sigue fuera de la ficha.

**Queda lista cuando:** se entiende qué se vende, dónde llega, qué cubre la garantía, y no se mezcla marca.

---

## Fase 13 — Lavado de cascos

**Para qué:** el servicio no se pierde dentro de “productos”.

**Código / contenido**

- [ ] Ficha de servicio (qué incluye, cómo se entrega el casco, tiempo).
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
- [ ] Lista de pedidos para Paola (aunque sea un correo o un JSON que ella lee).

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

- [ ] Módulo `voice`: listado + ficha de tip.
- [ ] Inicio puede mostrar un tip.

**Queda lista cuando:** hay al menos un puñado de tips publicables.

---

## Fase 17 — Tu voz: comparendos (básico)

**Para qué:** orientar sin fingir bufete.

**Código / contenido**

- [ ] Guías de comparendos frecuentes en moto.
- [ ] Enlaces a consulta/pago **oficial**.
- [ ] Disclaimer fijo en cada ficha.
- [ ] Nada de formularios que parezcan de la autoridad.

**Queda lista cuando:** sirve para entender y para ir al canal oficial, no para “arreglarte el comparendo”.

---

## Fase 18 — Tu voz: denuncias

**Para qué:** constancia comunitaria (alcantarillas, calles, abusos).

**Código**

- [ ] Formulario: qué pasó, dónde, cuándo, evidencia (foto).
- [ ] Copy Armargura + evidencia Incauta + (opcional) nota Loigca.
- [ ] Cola de moderación: Paola publica / oculta / rechaza.
- [ ] No doxxing: no exigir cédula de terceros; no publicar datos de menores.
- [ ] Aviso: no reemplaza denuncia formal.

**Queda lista cuando:** se puede enviar, Paola decide qué se ve, y lo publicado no parece tribunal.

**No se abre si la fase 15 no está hecha.**

---

## Fase 19 — Cuentas y panel de usuario

**Para qué:** tickets y compras “a tu nombre”, no red social.

**Código**

- [ ] Registro / login.
- [ ] Panel: mis tickets, mis pedidos, mis datos.
- [ ] Km personal **opcional** (si la persona quiere).
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

- [ ] Alta / renovación (Paola o pasarela).
- [ ] Distinción integrante visible ≠ membresía paga (si no son lo mismo, el copy lo dice).

**Queda lista cuando:** nadie paga “membresía” sin saber qué recibe.

---

## Fase 22 — Eventos de pago y publicidad

**Para qué:** no todas las salidas cobran; las que sí, y los aliados, con reglas.

**Código / contenido**

- [ ] Una salida puede ser gratis o de pago (precio en la ficha).
- [ ] Pago de ticket: WhatsApp y/o pasarela según fases 14/20.
- [ ] Publicidad = alianzas en Parchese / franja. **Cero popups. Cero venta de datos.**
- [ ] Un aliado no se convierte en producto Paola.

**Queda lista cuando:** se puede cobrar un evento sin romper la marca ni spamear.

---

## Fase 23 — Mapa de ruta (simple)

**Para qué:** ver el recorrido, no trackear a nadie en vivo.

**Código**

- [ ] Mapa embebido o imagen del recorrido previsto.
- [ ] Punto de encuentro claro.
- [ ] Sin GPS en vivo.

**Queda lista cuando:** quien no conoce la zona entiende dónde juntarse y por dónde se piensa ir.

---

## Fase 24 — Admin de Paola (una operadora)

**Para qué:** que ella no pida un deploy para subir una foto.

**Código**

- [ ] Panel privado (clave fuerte o auth de fase 19).
- [ ] CRUD: salidas, cupos, marcar realizado, memorias, integrantes, alianzas, productos, tips, denuncias (moderar).
- [ ] Pensado para **una sola persona**, no para un equipo 24/7.

**Queda lista cuando:** Paola publica una rodada y una memoria sin tocar código.

---

## Fase 25 — Amigos y chat

**Para qué:** solo si WhatsApp se queda corto. Por defecto **no se construye**.

**Abrir solo si**

- [ ] El parche lo pide con claridad.
- [ ] WhatsApp ya no da abasto.

**Si se abre**

- [ ] Amigos (vínculo simple).
- [ ] Chat básico.
- [ ] Sin convertir el portal en red social ni en el Inicio.

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
            23 → 24 → 26 → 27
                 ↓
            25 solo si hace falta
```

- **15** es candado de **18** y **20**.
- **21** está candada por contenido (precio y beneficios).
- **25** está candada por necesidad real.

---

## Fuera de esta hoja (a propósito)

- GPS en vivo de la rodada.
- Marketplace de terceros.
- Trámite o representación de comparendos.
- Envío nacional (hasta nueva regla).
- Red social completa en el MVP.
- Equipo de moderación 24/7.

Cuando algo de esa lista se vuelva sí, se añade **fase nueva** aquí; no se cuela en una fase ya tachada.
