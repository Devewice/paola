# Identidad visual — Paola

Reglas de diseño del portal. **Vinculante** para UI, afiches y componentes.

Plantilla para ver componentes en el navegador: [`index.html`](./index.html) — hero **100vh** (`#hero`) + capa **UI** + capa **brocha** (`#brocha`). No es el portal.

Fuentes (carpeta `docs/resoruces/`):

| Archivo | Qué es | Autoridad |
|---------|--------|-----------|
| `logo.png` | Escudo y wordmark oficiales | **Logo actual. Es el que se usa.** No se redibuja ni se sustituye por una fuente. |
| `Rodada anapoimap.png` | Afiche de rodada (Anapoima) | Paleta eléctrica, iconos, bloques de dato, foto de grupo |
| `Primera rodada.webp` | Afiche “Rodada por mi Cumpleaños” | Oscuro, brocha, foto de Paola, ritmo de tipografías |
| `Brush King.otf` | Fuente brocha seca oficial | **RODADA**, **CUMPLEAÑOS** y títulos `type-brush-dry` |

La visión de producto sigue en [`brainstorming.md`](./brainstorming.md). Paper Mario / Insta360 no pisan esta marca.

Mascota (fase 1): **cámara Insta360**, fotos en `public/mascota/` (origen `docs/resoruces/mascota camara 360/`). Default de vacío: `en-pie.png`. No es una animación 360.

---

## 1. Personalidad de la interfaz

- Club motero real: **noche, ruta, foto, azul eléctrico**.
- Energía y respeto, no dashboard corporativo ni plantilla de motoclub genérico.
- Contraste alto: negro profundo + blanco + azul.
- La foto es protagonista; el azul recorta, subraya y llama a la acción.
- Textura (brocha, asfalto, glow) en **cabeceras y piezas de rodada**. En formularios y tienda, la misma paleta pero **legible y estable**.

Dos capas, misma marca:

| Capa | Dónde | Qué se permite |
|------|--------|----------------|
| **Pieza / afiche** | Memorias, anuncio de rodada, Inicio hero | Brocha, italic de velocidad, foto a sangre, glow, placas brochazo, separadores |
| **UI de uso** | Tickets, tienda, denuncias, panel | Superficies planas, botones claros, sin texto distorsionado |

**Regla de convivencia:** la capa brocha **se suma** a Oswald + Montserrat; **no los reemplaza**. Formularios y legal siguen en UI limpia.

---

## 2. Logo

Archivo maestro: `docs/resoruces/logo.png`.

Qué es el escudo:

- Contorno en capas (azul oscuro → cian → blanco).
- Paola de frente en moto blanca; el parche atrás.
- Ciudad a un lado, montaña al otro (urbano + ruta).
- Wordmark **Paola** en script blanco, contorno navy, halo cian; la última **a** cierra en corazón.
- Cinta **RODANDO CON PROPÓSITO** en sans extra-bold, mayúsculas, navy.

### Uso

- Usar **siempre el PNG** (o SVG si más adelante se vectoriza el mismo arte). Nunca escribir “Paola” con una cursiva de Google Fonts para fingir el logo.
- Fondo preferido: **negro / navy**. Sobre blanco, dejar aire y no aplastar el halo.
- No recolorear el dibujo. No rotar. No estirar. Proporción 1:1 del escudo.
- Área de respeto: alrededor, al menos **12%** del lado del escudo, vacío.
- Tamaños mínimos: favicon 32px (recorte del escudo); en header **40–56px**; en Inicio/Paola hasta **120–160px**.
- En la barra del portal: escudo a la izquierda + menú. No repetir el wordmark en fuente.
- Favicon y “apple-touch” salen de este logo, no de un ícono Material.

---

## 3. Color

Muestreo de las piezas. Usar estos tokens, no el azul por defecto de Vuetify (`primary` teal del demo se reemplaza).

| Token | Hex | Uso |
|-------|-----|-----|
| `--paola-black` | `#05070C` | Fondo de página, afiches, app bar |
| `--paola-ink` | `#000814` | Superficie más profunda, footer |
| `--paola-navy` | `#001028` | Contorno del logo, texto sobre cian, bloques |
| `--paola-navy-mid` | `#003060` | Hover oscuro, líneas de separación suaves |
| `--paola-blue` | `#0088F8` | CTA, iconos, subrayados, “eléctrico” de los afiches |
| `--paola-blue-deep` | `#0068C8` | Botón pressed, borde de foto |
| `--paola-cyan` | `#48B4FC` | Halo del logo, hover, glow, focus |
| `--paola-cyan-soft` | `#70C0F8` | Chips, iconos secundarios |
| `--paola-white` | `#F7FAFC` | Texto principal sobre oscuro |
| `--paola-muted` | `#8B9BB0` | Metadatos, captions |
| `--paola-line` | `#1A2A40` | Divisores |
| `--paola-surface` | `#0B1018` | Tarjetas, chips sobre black |
| `--paola-danger` | `#E23B4A` | Error / denuncia grave (poco; no es color de marca) |
| `--paola-ok` | `#3DDC97` | Cupo disponible, éxito (apoyo, no marca) |
| `--paola-warn` | `#E8A020` | Avisos, toasts, callouts (apoyo) |
| `--paola-chip-muted` | `#1A1F28` | Chip cupo lleno, fondos apagados |
| `--paola-wa` | `#3DDC97` | Acento canal WhatsApp (fase 25; no es marca) |
| `--paola-wa-text` | `#7DD4A0` | Texto sobre pill WA |

### Tríada de voces (UI)

Tono de copy, **no** font-family. Badges: `.voice-badge--loigca` · `--incauta` · `--armargura`.

| Token | Hex | Voz | Uso |
|-------|-----|-----|-----|
| `--paola-loigca` / `--loigca` | `#0088F8` | **Moto Loigca** | Datos, ley, cupo, tips, contacto |
| `--paola-incauta` / `--incauta` | `#E2E8F0` | **Cámara Incauta** | Evidencia, foto, memoria visual |
| `--paola-armargura` / `--armargura` | `#C878B4` | **Paola Armargura** | Relato, denuncia comunitaria (fase **18**) |
| `--armargura-soft` | `#D8A0E0` | Armargura | Texto badge / byline |
| `--armargura-deep` | `#783C8C` | Armargura | Borde acento, no confundir con `--danger` |

**Regla:** `--danger` (#E23B4A) es error UI; **Armargura** es violeta emocional, sin estética policial. Formulario denuncia: `.denuncia-form` + borde `--armargura`.

**Implementación:** kit HTML usa `--black`, `--blue`, etc.; aliases `--paola-*` en `:root`. Vue: `front/src/shared/theme/colors.ts` + tema Vuetify `paolaDark`.

**Regla:** el color de marca es el **azul**. El verde/rojo del casco del logo no se vuelven paleta (el verde WA es **canal**, no rebranding).

### Fondos

- Portal: `--paola-black`. No fondo blanco de documento ofimático.
- Tarjeta: `#0B1018` con borde `--paola-blue-deep` o doble borde (navy + cyan) como el escudo, 1px + 1px.
- Bloque de datos (fecha, hora, punto): negro puro o ink, texto blanco, icono azul.
- Foto: puede ir a sangre; encima, degradado a negro en el tercio donde hay texto (`transparent → #05070C`).

### Texto sobre foto

- Blanco o cian. Nunca navy sobre foto oscura.
- Si no hay contraste, placa: brocha azul (pieza) o rectángulo `rgba(5,7,12,0.78)` (UI).

### Tema Vuetify (obligatorio al implementar)

Tema **`paolaDark`** en `front/src/app/plugins/vuetify.ts` — valores desde `front/src/shared/theme/colors.ts`:

```
primary:    #0088F8
secondary:  #001028
surface:    #0B1018
background: #05070C
success:    #3DDC97
warning:    #E8A020
error:      #E23B4A
info:       #48B4FC
on-*:       #F7FAFC / #FFFFFF sobre oscuro
```

Modo **oscuro por defecto**. No inventar un tema claro pastel que diluya el escudo. **Sin Roboto** como voz de marca.

---

## 4. Tipografía

### Qué no hacer

- No imitar el script de **Paola** con otra fuente.
- No usar Roboto (el default de Vuetify) como voz de marca.
- No poner cuerpo de formulario en fuente distressed.

### Familias

Cargar con `unplugin-fonts` / Fontsource:

| Rol | Fuente | Pesos | Dónde |
|-----|--------|-------|--------|
| **Display / afiche** | [Oswald](https://fonts.google.com/specimen/Oswald) | 500, 600, 700 | Títulos de rodada, “APÚNTESE”, números de hora |
| **UI / cuerpo** | [Montserrat](https://fonts.google.com/specimen/Montserrat) | 400, 500, 600, 700, 800 | Navegación, fichas, tienda, legal, botones de UI |
| **Wordmark** | — | — | Solo el PNG del logo |

Oswald: condensed, un poco itálica en CTAs de velocidad (`font-style: italic` + mayúsculas), como “CUMPLEAÑOS” y “NOS VEMOS EN LA RUTA”.  
Montserrat: estable, como “6:00 A.M.”, “RIDE • RESPECT • ENJOY”, datos de punto de encuentro.

### Escala (desktop)

| Token | Fuente | Size | Weight | Tracking | Transform |
|-------|--------|------|--------|----------|-----------|
| `display` | Oswald | 40–56px | 700 | 0.02em | uppercase; italic opcional |
| `h1` | Oswald | 32px | 700 | 0.04em | uppercase |
| `h2` | Montserrat | 22px | 700 | 0 | none |
| `h3` | Montserrat | 18px | 650 | 0.02em | uppercase en labels de bloque |
| `body` | Montserrat | 16px | 400 | 0 | none |
| `body-sm` | Montserrat | 14px | 400 | 0 | none |
| `meta` | Montserrat | 12px | 600 | 0.16em | uppercase (RIDE • RESPECT • ENJOY) |
| `btn` | Montserrat o Oswald | 14–16px | 700 | 0.08em | uppercase |

Interlineado: display 1.05; cuerpo 1.5; meta 1.3.

Móvil: `display` baja a 32–40px; `h1` a 26px. No achicar botones por debajo de 44px de alto.

### Capa afiche — tipografías brocha (variantes)

Solo en heroes, anuncios de rodada, memorias y bloques con foto. Ver [`index.html#brocha`](./index.html#brocha) junto a los flyers de referencia.

Los flyers usan **brocha seca** (bordes deshilachados, estrías verticales dentro del trazo, inclinación), no un marker plano ni líneas vectoriales lisas.

| Token / clase | Fuente | Tratamiento | Uso en flyer |
|---------------|--------|-------------|--------------|
| `type-brush-dry` | **Brush King** (`docs/resoruces/Brush King.otf`) | Blanco · `clamp(38px, 7.2vw, 76px)` | Hero afiche |
| `type-brush-dry--sm` | Brush King | Blanco/azul · títulos cortos (**RODADA**) | `clamp(26px, 4.8vw, 46px)` |
| `type-brush-dry--blue` | Brush King | Azul, sombra navy | Sobre `--sm` o `--xs` |
| `type-brush-dry--xs` | Brush King | Palabras largas (**CUMPLEAÑOS**) | `clamp(22px, 4vw, 38px)` |

Espaciado vertical fijo (no tocar `font-size`): `line-height: 1.2`, `padding-block` 6–8px, `margin-block` 10–14px (8–12px en `--sm` / `--xs`) para que no choque con texto arriba/abajo ni con la inclinación.
| `type-brush-hand` | **Rock Salt** (Knewave / Sedgwick Ave respaldo) | Brocha mano inclinada | Acentos, nombres (**NEZKO**) |
| `type-brush-script` | **Caveat** | Script fino blanco inclinado | **por mi** |
| `type-condensed` | **Bebas Neue** / **Anton** | Condensada, `skewX(-12deg)` | **INVITADOS**, fechas |
| `type-condensed--accent` | Bebas italic skew | Azul inclinado | **ANAPOIMA** |
| `type-stamped` | Bebas Neue | Filtro `#paola-stamped`, desgaste | **¡NOS VEMOS EN LA RUTA!**, pie |
| `label-brush` | Montserrat italic skew | Datos sobre foto | Hora, punto, tips |

Filtros SVG (`#paola-brush-edge`, `#paola-stamped`) en manchas y pie desgastado. **Brush King** ya trae textura seca — no aplicar `#paola-dry-brush` encima del título.

Aliases legacy: `type-brush` apunta a `type-brush-dry`. **Ninguna** fuente brocha sustituye al logo script ni va en formularios o legal.

### Placas y banners brochazo

| Componente | Qué es | Cuándo |
|------------|--------|--------|
| `brush-splash` | Trazo horizontal grueso con **bordes deshilachados** (`#brush-splash-blue` / `#brush-splash-white`) | Fecha: **7 DE JUNIO**, **Domingo 5 Julio** |
| `brush-banner` | Banda azul irregular (`#brush-banner-bg`) bajo el pie | **¡NOS VEMOS EN LA RUTA!** |

No usar rectángulos CSS redondeados para fechas en afiche: siempre mancha SVG horizontal.

### Separadores de brocha (`brush-divider`)

Dos tipos, como en los flyers:

1. **Banda gruesa** — mancha azul rellena, bordes irregulares (entre foto y bloque de datos).
2. **Trazo fino partido** — segmentos con huecos (`stroke-linecap: round`, no línea continua lisa).

Implementación: SVG inline (`preserveAspectRatio="none"`), no `border-bottom` ni curvas Bézier suaves solas.

### Decorativos estilo brocha

En afiches y piezas de marca: **no emoji del sistema**. Biblioteca SVG unificada en el kit (`#bd-*`).

| Regla | Valor |
|-------|-------|
| Contenedor | `.brush-icon` (+ `--sm` 24px, `--lg` 40px) |
| Color | `.brush-icon` azul · `--cyan` · `--white` · `--muted` |
| Trazo | viewBox 32×32, `stroke-width: 2.5`, `currentColor` |
| Textura | filtro `#paola-brush-edge-soft` en todos |
| Uso | `<svg viewBox="0 0 32 32"><use href="#bd-heart"/></svg>` |

**Símbolos (`#bd-*`):** corazón, fuego, cámara, pin, casco, moto, guantes, chaleco (`bd-vest`), ruta, bandera, rayo, chispa, estrella, check, flecha, chat, cita, ticket, escudo, llave inglesa, carita, garabato, onda, enlace (`bd-link`), **copiar (`bd-copy`)**, **compartir (`bd-share`)**, ojo.

**Compartir memoria (fase 29):** fila `.share-row` = input readonly + `.icon-btn` con `#bd-copy` (copiar URL) + `.icon-btn--wa` (WhatsApp, trazo propio) + `#bd-link` (ancla / deep link). Opcional `#bd-share` para share nativo. Sin botón texto «Copiar» en UI Paola.

**Manchas brochazo:** `#brush-splash-blue`, `#brush-splash-white`, `#brush-banner-bg` — paths irregulares, no `<rect>` plano.

Catálogo completo en [`index.html#brocha`](./index.html#brocha). Reacciones (`.reaction-bar`) usan `.brush-icon--sm` con los mismos símbolos.

### Botón inclinado (`btn-brush`)

- Misma paleta que botón primario/ghost, con `skewX(-6deg)` y sombra offset azul.
- **`btn-brush--brochazo`**: resplandor pulsante en reposo; al hover el borde limpio (cian, radio 10px) se desvanece y entra un trazo SVG con filtro `#paola-brush-edge` (borde → brochazo). **Solo capa afiche** — no sustituye a `.btn-primary--hero` en el portal.
- En tienda, tickets y denuncias: botones rectos (radio 10px, sin skew).

### Voces de copy (sí) vs fuentes (no)

Armargura / Incauta / Loigca son **tono de texto**, no tres font-family. Toda la UI comparte Montserrat + Oswald + logo.

---

## 5. Botones y controles

### Primario (CTA)

- Fondo `--paola-blue`. Texto blanco. Weight 700. Mayúsculas. Tracking amplio.
- Alto 48px. Padding horizontal 24px.
- Radio **10px** (curva del escudo, no píldora 999 ni Material 4px).
- Hover: fondo `--paola-cyan`, sombra `0 0 20px rgba(72,180,252,0.35)`.
- Pressed: `--paola-blue-deep`.
- Disabled: navy, texto muted, sin glow.
- Ejemplos: **ESCRIBIRLE A PAOLA**, confirmar pedido, acciones en formularios y modales.

### Primario hero (`.btn-primary--hero`)

- Misma forma que el primario (recto, radio 10px, **sin** skew).
- **Un solo CTA con pulso por vista** (Inicio, ficha rodada, barra sticky de cupo).
- Reposo: glow cian pulsante suave (`btn-primary-hero-glow`, ~2.8s).
- Hover / focus: pulso off, cian sólido + glow más fuerte (como el primario).
- Respeta `prefers-reduced-motion: reduce` (sin pulso).
- Combina con `.btn-sm` / `.btn-lg` si hace falta.
- Ejemplos: **APÚNTESE PA RODAR** en card de rodada, **VER PRÓXIMA SALIDA** en hero de Inicio.
- **No** usar en tienda, denuncias, admin ni cuando ya hay otro hero en pantalla.

### Jerarquía de tres niveles

| Clase | Capa | Cuándo |
|-------|------|--------|
| `.btn-primary` | Portal / UI | Acciones normales, varios por pantalla |
| `.btn-primary--hero` | Portal / marketing | **Uno** protagonista por vista |
| `.btn-brush--brochazo` | Afiche / brocha | Heroes del kit (`#hero`, `#hero-portal`), mini afiches (`#brocha`) |

### Secundario (ghost)

- Fondo transparente. Borde 2px `--paola-cyan`. Texto `--paola-white`.
- Hover: fondo `rgba(0,136,248,0.16)`.
- Ejemplos: **Ver memorias**, **Cómo llegar**.

### Oscuro / inverso

- Fondo `--paola-navy`. Borde 1px `--paola-blue`. Texto blanco.
- Para acciones en barra o sobre foto.

### Peligro

- Ghost o texto `--paola-danger`. No un botón rojo sólido de marca.

### Enlaces

- Color `--paola-cyan`. Hover blanco subrayado. No azul de navegador.

### Campos (`.input`, `.list-select`, `textarea`)

- Fondo `--paola-ink` (`#000814`). Borde **2px** `--paola-line`; hover: tinte azul suave + borde `--paola-navy-mid`.
- Focus: borde `--paola-cyan` + glow `0 0 0 3px rgba(72,180,252,0.28)` (igual que checkboxes).
- Label Montserrat 12px uppercase muted. Placeholder muted. Alto mínimo 48px. Radio 10px.
- **List select (`.list-select`):** desplegable custom — trigger como input; panel ink + borde cian (igual que drop). No usar `<select>` nativo en UI Paola.
- **Checkbox/radio:** custom (borde cian, tick/punto azul) — ver kit `#forms`.
- Disabled: opacidad reducida, fondo `--paola-surface`, sin glow.

### Menús y navegación secundaria

- **Drop (`.drop-menu`):** fondo ink, borde 2px cian, sombra + glow; ítems con hover azul.
- **Tabs:** subrayado azul activo, hover con fondo tenue.
- **Accordion (`.acc`):** borde cian al abrir, chevron cian animado.
- **Pager:** mismo lenguaje que checkboxes; página activa relleno azul + glow.

### Chips / estados de rodada

- `abierto`: cyan suave, texto navy o blanco según contraste.
- `lleno`: muted.
- `cerrado` / `realizado`: navy + línea.

### Listas (kit `#listas`)

| Patrón | Clase | Uso |
|--------|-------|-----|
| Checklist compacta | `.checklist` | Tareas, revisión visual |
| Elección radio | `.choice-list` + radio | Una opción (tipo salida) |
| Elección checks | `.choice-list` + checkbox | Varias (equipo, permisos) |
| Acciones | `.action-list` | Panel, enlaces internos |
| Media | `.media-list` | Integrantes, pedidos |

### Feedback en pantalla

- **Toast (`.toast-stack`):** esquina superior derecha; variantes info / ok / bad / warn; cierra solo o con ×.
- **Alert inline (`.alert`):** aviso dentro de la página, no flotante.
- **Empty state, skeleton, steps, filter-pills, search-field, field-error:** ver kit `#extras`.

### Componentes de producto (kit `#producto`)

| Patrón | Clase | Uso |
|--------|-------|-----|
| Ficha rodada | `.ride-card` | Parchese, Inicio hero |
| Ficha producto | `.product-card` / `--collab` | Tienda (estanterías separadas) |
| Stats memoria | `.stat-grid` | Km, fotos, gente |
| Denuncia | `.denuncia-card`, `.denuncia-form` | Tu voz · fase 18 · acento `--armargura` |
| Voces | `.voice-badge--loigca/incauta/armargura` | Tríada copy |
| Timeline | `.timeline` | Ticket, pedido, moderación |
| WhatsApp strip | `.wa-strip` | Pago / cupo / contacto |
| Alianzas | `.alliance-strip` | Franja global + Parchese |
| Galería | `.gallery` | Memorias, evidencia |
| Nav móvil | `.bottom-nav` | 5 pestañas |
| Cantidad | `.qty-stepper` | Tienda |
| Barra fija | `.action-bar` | Confirmar ticket / pedido móvil |

### Más patrones (kit `#patrones`)

| Patrón | Clase | Uso |
|--------|-------|-----|
| Ticket digital | `.ticket-card` | Cupo confirmado a tu nombre |
| Comparendos | `.comparendo-card` | Tu voz — educación + enlace oficial |
| Resumen pedido | `.order-summary` | Tienda checkout |
| Zona envío | `.zone-badge` | Bogotá / Soacha / fuera |
| Mapa estático | `.map-block` | Punto de encuentro (sin GPS vivo) |
| Memoria hero | `.memoria-hero` | Cabecera de memoria |
| Sheet móvil | `.sheet` | Acciones inferiores |
| FAB | `.fab` | CTA flotante rodada |
| Shell + footer | `.shell-header`, `.site-footer` | Layout portal |
| Offline / cookies | `.offline-banner`, `.consent-banner` | Estados sistema |

### Catálogo extendido (kit `#catalogo`)

KPI strip, notice bar, hero split, features, ride list, calendario mini, time chips, ring cupo, avatar stack, estanterías tienda, pipeline moderación, notify list, dropzone, OTP, tags, carousel, video block, sidebar panel, success panel, testimonial, rating, callouts, mobile row card y más. Referencia completa en el kit.

### Comunidad (kit `#comunidad`) — fases 25–44

**Decisión Paola:** red social en web (**36–44**); WhatsApp canal paralelo (**25**, **37**). MVP inicial: **28–31**; crecimiento: **32–35**.

| Patrón | Clase | Fase | Uso |
|--------|-------|------|-----|
| Dos canales | `.where-we-talk`, `.dual-channel` | 25, 37 | Web vs WhatsApp |
| Comunidad | `.community-card`, `.community-dir` | 36 | Ficha + directorio |
| Seguir | `.follow-btn` | 38 | Comunidades / voces |
| Feed | `.feed-post` | 39, 42 | Timeline + widget Inicio |
| Comentarios | `.comment-compose`, `.comment-list` | 28 | Hilo moderado |
| Engagement | `.engage-bar`, `.reaction-bar`, `.icon-btn`, `.share-row` | 29 | Reacciones + compartir (`#bd-copy`, WA, `#bd-link`) |
| Notificaciones | `.notify-prefs` | 30 | Panel usuario |
| Perfil | `.profile-public` | 31, 40 | Alias / parcero |
| Amigos | `.friend-row` | 32, 40 | Vínculo / seguir |
| Chat | `.chat-layout`, `.chat-bubble` | 33, 43 | Mensajería web |
| Hilo rodada | `.ride-thread-head` | 34 | Ticket + avisos |
| Actividad | `.parchese-activity` | 35 | Parchese |
| Horizonte | `.phase-roadmap-card.is-future` | 36–44 | Red social integrada |

Reglas: WA no se apaga, sin algoritmo viral, moderación Paola (**41** delegada acotada), constancia comunitaria.

---

## 6. Iconografía

De los afiches:

- Trazo **lineal**, uniforme, dentro de **círculo** o pin.
- Color `--paola-blue` o blanco sobre placa azul.
- Set mínimo: calendario, reloj, pin de mapa, casco, cámara, corazón (detalle de marca, no spam).
- No Material Icons redondos multicolor. Si se usa MDI, forzar color azul/blanco y peso light/regular.
- Corazón y “gente” del logo: solo en marca o pie, no como bullet de lista.

---

## 7. Espaciado y layout

Escala de **8px**: 4, 8, 16, 24, 32, 48, 64.

| Uso | Valor |
|-----|--------|
| Gutters móvil | 16 |
| Gutters desktop | 24–32 |
| Gap entre cards | 16 |
| Padding interno de card | 20–24 |
| Separación de secciones | 48–64 |
| App bar alto | 64 |
| Ancho de lectura | 720px máx. para texto largo |
| Ancho de shell | 1200px; franja de alianzas ~240px a partir de desktop |

### Ritmo de afiche (Inicio, ficha de rodada)

1. Franja superior oscura: título Oswald + logo a la derecha.
2. Foto (grupo o Paola) a sangre o 16:9.
3. Separador: **trazo azul** (línea 3–4px o brocha solo en pieza).
4. Bloque de datos en negro: icono + label + valor (hora grande en Oswald).
5. CTA primario abajo o sobre el separador.

### Franja de alianzas

- Misma paleta oscura. Logos de aliados en blanco/gris, no full color que pelee con el azul Paola.
- No banners parpadeantes.

### Grid

- Desktop Inicio: hero foto + columna de próxima salida.
- Parchese: lista / calendario a 1 columna móvil, 2 en desktop.
- Tienda: 2 columnas móvil, 3 desktop. Fichas propias y collab **no en el mismo grid mezcladas**.

---

## 8. Superficies, bordes, movimiento

- Radio general **10px**. Imágenes de memoria: 10px o 0 (a sangre). Escudo: circular/escudo, no se recorta a rounded-square feo.
- Sombra: casi ninguna negra genérica; preferir **glow cian** en hover de CTA y foco.
- Borde de card: 1px `#1A2A40`; card destacada (próxima rodada): 1px `--paola-blue`.
- Overlay de foto: viñeta negra, no filtro blanquecino.
- **CSS (UI):** 180–220ms ease en hover de botón. Pulso lento solo en `.btn-primary--hero` y `.btn-brush--brochazo` (con `prefers-reduced-motion`).
- Italic Oswald solo en títulos de energía, no en párrafos legales.

### Bibliotecas de animación (Vue + kit HTML)

Una sola stack en ambos entornos — no cambiar de librería al pasar del kit al portal.

| Capa | Herramienta | Uso |
|------|-------------|-----|
| Entradas, scroll, timelines | **GSAP** (`gsap`, `ScrollTrigger`) | Stagger de cards rodada, reveals al scroll, secuencias hero |
| Listas dinámicas | **AutoAnimate** (`@formkit/auto-animate`) | Comentarios, notificaciones, carrito, filtros |
| Hovers y pulso marca | **CSS** | Botones, brochazo, skeleton |
| Rastro de llanta (kit) | **Canvas** (`initPaolaCursorSmoke`) | Sprite de rodadura · anclado al scroll · fondo ~1 s · sobre UI ~0.4 s · quemado al click |
| Modales / sheets | **Vuetify** | Transiciones Material en overlays |
| Mascota / ilustración | **fotos Insta360** (Lottie opcional, no UI base) | Vacíos narrativos — no es animación 360 del sitio |

**Tokens compartidos:** `front/src/shared/motion/tokens.ts` — mismos valores en `docs/index.html#motion`.

| Token | Valor | Uso |
|-------|-------|-----|
| `duration.ui` | 0.18s | Hover micro |
| `duration.uiSlow` | 0.22s | Toast, sheet |
| `duration.reveal` | 0.35s | Entrada card / bloque |
| `stagger.cards` | 0.06s | Lista rodadas, tienda |
| `ease.enter` | `power2.out` | Entrada (sin rebote cartoon) |
| `offset.y` | 24px | Desplazamiento reveal |

**Vue:** plugin `@app/plugins/motion.ts` registra ScrollTrigger + AutoAnimate. Helpers: `staggerReveal`, `usePaolaGsap` en `@shared/motion`.

**Reglas:** sin algoritmo viral ni loops infinitos salvo hero/brochazo; siempre `prefers-reduced-motion`; GSAP no reemplaza cada `v-dialog`.

---

## 9. Foto e ilustración

- Fotos reales de rodada (como los afiches): moto, parche, Paola. Color frío/azul en grade si se unifica.
- No stock de “motociclista sonriente en estudio”.
- La ilustración del **escudo** no se recorta para avatares de integrantes (ahí va foto o inicial).
- Mascota 360 / recorte Paper Mario: solo vacíos y relato, **misma paleta** (negro, blanco, azul). Si no calza, no se fuerza.

---

## 10. Componentes del portal (cómo se deben ver)

| Pieza | Tratamiento |
|-------|-------------|
| App bar | `--paola-ink`, logo 48px, links Montserrat 600 uppercase 12px tracking, activo en `--paola-cyan` |
| Menú móvil | Fondo black, full screen o drawer ink, sin fondo blanco |
| Card rodada | Foto arriba, título Oswald, meta con iconos azules, CTA primario |
| Inicio | Corte del día tipo afiche reducido, no wizard |
| Tienda | Cards oscuras, precio Montserrat 700, CTA “escribirle a Paola” primario |
| Tu voz | Más Loigca (texto claro); denuncias: foto evidencia + título Armargura, sin estética policial |
| Footer | Ink, slogan uppercase muted, redes, logo chico |

---

## 11. Accesibilidad (sin romper la marca)

- Contraste blanco sobre `#05070C` y blanco sobre `#0088F8`: cumple.
- No texto cyan sobre azul eléctrico.
- Foco visible: anillo `--paola-cyan` 2px.
- Alt del logo: `Paola — Rodando con propósito`.
- No animar el glow en `prefers-reduced-motion`.

---

## 12. Checklist rápido (antes de merge de UI)

- [ ] El logo es el PNG del escudo, no una cursiva inventada.
- [ ] Primary de Vuetify es `#0088F8`, fondo `#05070C`, no teal del demo.
- [ ] Tipografías: Oswald + Montserrat; Roboto fuera.
- [ ] Botón principal: azul eléctrico, mayúsculas, radio 10px.
- [ ] Iconos de dato: círculo + trazo azul (fecha, hora, pin, casco).
- [ ] Aliados no se ven como marca Paola.
- [ ] Formularios legibles (capa UI, no brocha sobre el input).
- [ ] Afiches: `type-brush-dry` / `type-brush-hand` / `type-condensed` + `brush-splash` + `brush-divider` SVG.
- [ ] Decorativos SVG brocha, no emoji del sistema en piezas de marca.
