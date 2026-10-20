# Componentes `@ui`

Léete **esto** antes de abrir los `.vue` de `front/src/shared/ui/`.
Catálogo vivo: `/admin/ui`. Estilos: `html-kit.css`. Import: `import X from '@ui/X.vue'`.

Reglas: afiche (brocha) ≠ formularios; un CTA `hero` por vista; vacío → `PageVacant` / `Empty` / `EmptyBlock`.

## Cómo armar una vista

1. Hero a todo el ancho: `KitHero` (Inicio portal) o `AficheHero` (páginas; `compact` en subpáginas).
2. Cuerpo en `.wrap`. Tablero: `HomeDash`.
   Secciones con subpáginas (Parchese, Tu voz): portada en bento de `HubTile` (`.hub-bento`; `.hub-bento--flip` pone la pieza grande a la derecha, como en Inicio) + una ruta hija por sección. Pestañas `SectionTabs`, cabecera de sección `BoardHead`.
3. Cascarón: `MegaHeader` + `SiteFooter` en `App.vue`.
4. Acciones: `Button` (`primary` | `hero` | `ghost` | `dark` | `danger` | `brush`).
5. Página sin contenido: `PageVacant`. Bloques vacíos: `Empty` / `EmptyBlock`.

## Cascarón y layout

| Componente | Para qué | Props / slots clave |
|---|---|---|
| `MegaHeader` | Header del portal: logo, pestañas; megamenú solo si el ítem trae `columns` (chevron) | `items`, `whatsapp`, `accountTo`, slot `widget` |
| `MegaPeek` | Widget del mega menú (próxima, tip, km) | `kicker`, `title`, `meta`, `copy`, `value`, `imageSrc`, `to`, `empty` |
| `MegaFooter` | Columnas de enlaces del pie (kit/demo) | `columns: { title, links[{ label, to?, href? }] }` |
| `SiteFooter` | Pie del portal: crest, columnas, suscripción, alianzas | `compact` (solo barra legal), `columns`, `copy`, `alliances`, `subscribeMail`, … |
| `PageVacant` | Página en construcción (mascota + CTAs; anillo cian estático tipo hero) | `title`, `kicker`, `copy` |
| `AppLink` | `router-link` o `<a>` según `to` / `href` | `to`, `href`, `target` |
| `KitHero` | Hero full-bleed del kit. `portal`: corte del día. `panelSlides`: mazo de rodadas (dots afuera, borde con resplandor) | `heroId`, `variant`, `tagline`, `kicker`, `photoSrc`, `panelSlides`, slots `voices` `panel` `footer` `actions` |
| `KitHeroPanel` | Panel “corte del día” | `title`, `km`, `cupo`, `fecha`, `splash`, `ctaTo`, `mediaSrc`, `blankMedia`, `mediaFigure` (PNG recortado sobre navy si no hay foto) |
| `KitHeroFooter` | KPIs bajo el hero portal | `stamp`, `rodadas`, `km`, `integrantes` |
| `AficheHero` | Hero de página (más bajo que el kit). `compact`: subpáginas, sin panel ni CTA hero | `kicker`, `title`, `plate`, `logo`, `photoSrc`, `compact`, slots `lead` `actions` `panel` |
| `SectionTabs` | Pestañas entre subpáginas (`router-link`, activa exacta) con estilo `filter-pill` | `label`, `items: { to, tag, label }[]` |
| `HubTile` | Tarjeta-afiche de la portada de sección: foto o mascota, número, voz, título brocha, CTA. Sin `to`/`href` es botón de alternar (`pressed`, emite `click`). Dentro: `.hub-stats`/`.hub-stat`, `.hub-meta`, `.hub-quote`, `.hub-dates`/`.hub-date` | `title`, `cta`, `to`/`href`, `index`, `kicker`, `voice`, `imageSrc`, `mascotSrc`, `tone` (`navy`/`blue`/`armargura`), `size` (`base`/`hero`/`wide`/`compact`), `pressed`, slot default |
| `StatBand` | Banda-afiche con cifras grandes al abrir una subpágina (cupos, km, encuestas, promesas de tienda) | `items` (`{ value, label }[]`), `title`, `kicker`, `lead`, `mascotSrc`, `tone`, slot default |
| `StepsPoster` | Afiche con pasos numerados: vacíos que explican qué viene (memorias, integrantes) y rails de "cómo funciona" | `title`, `kicker`, `lead`, `steps`, `mascotSrc`, `tone`, `wide` (pasos en fila, vacío de página), slot default (botones). Acepta `poster--mascot-top` |
| `BoardHead` | Cabecera de sección: voz, título, lead y "Ver todo" opcional | `title`, `lead`, `voice`, `moreTo`, `moreLabel` |
| `HomeDash` | Tablero Inicio: próxima + feed + columna lateral | slots `next` `pulse` `aside` |
| `DualChannel` | WhatsApp vs web (WA no se apaga) | slots `wa` `web` |
| `DualCta` | Dos CTAs en grid | default slot |
| `BottomNav` | 5 pestañas móviles (kit). El portal usa `.paola-bottom-nav` | `tabs` |
| `BrushDefs` | SVG filters; una vez en `App.vue` | — |

Clases kit (no son Vue): `.wrap` ancho de contenido · `.stack` columna con gap · `.row` flex wrap · `.top` header del catálogo `/admin/ui`.

Tableros (`kit-overrides.css`): `.board-shell` (pestañas + ruta hija) · `.board` / `.board--hub` (separadores entre extractos) · `.board-section` · `.board-split` + `.board-main` / `.board-rail` (columna lateral sticky ≥960px) · `.board-panel` · `.board-grid` + `.board-card` · `.board-kicker` · `.board-more`.

Variantes de grilla: `.board-grid--numbered` (cifra 01, 02… en Oswald cian sobre cada hijo) · `.board-grid--feature` (la primera `.board-card` ocupa todo el ancho con fondo navy).

Afiches de panel (mismos tonos que `HubTile`): `.poster` + `.poster--navy` / `--blue` / `--armargura`. Mascota: `img.poster__mascot` + `.has-mascot` en el contenedor; el texto que no debe pisarla va en `.poster__copy`. `.poster--mascot-top` la sube a la esquina (paneles con formulario o lista). Perfil: `.poster--profile` + `.poster-avatar`. Cifras en `dl`: `.hub-stats.hub-stats--dl` (`dt` etiqueta, `dd > strong` número). Tira deslizable de tiles: `.tile-strip`.

Combinar sin repetir: cada vista elige una o dos piezas (banda, afiche en el rail, grilla numerada o destacada, tiles compactos). La brocha va en títulos de afiche, no en formularios.

## Marca / afiche / brocha

`BrushButton` CTA afiche (texto blanco, Montserrat 800) · `BrushText` (texto dinámico en títulos brocha: los números van en placa, Brush King no trae dígitos) · `BrushSplash` mancha + label · `BrushBanner` / `KitBrushBanner` · `BrushDivider` / `KitBrushDivider` · `BrushPlate` · `AficheBlock` marco afiche · `AficheMiniDemo` `AficheAnapoimaDemo` `AficheCumpleDemo` `AficheRefs` solo kit · `VoiceBadge` Loigca/Incauta/Armargura · `VoiceCard` · `PaolaBlock` · `RoadLightsBackdrop` luces de vía (fondo /paola) · `Mascot3d` cámara GLB/Draco · `MascotFlash` poses 360 + destello

Frames exportados de referencia (sprites): `front/public/mascota/frames/`.

## Botones, chips, iconos

`Button` · `SplitButton` · `BtnGroup` · `IconBtn` · `Icon` · `Chip` (abierto/lleno/cerrado/realizado) · `WishBtn` · `Fab` · `SpeedDial`

## Formularios

`Field` + `Input` / `Textarea` / `Select` / `PasswordField` / `PwdMeterField` · `tone="electric"` (borde brocha + glow cian; default limpio) · `Choice` `ChoiceList` · `PrivacyCheck` · `FilePicker` `Dropzone` `UploadQueue` · `QtyStepper` `RangeField` `OtpRow` `Search` `CalMiniPicker` `TimeChips` `SizePicker` `SwatchPicker` `CityGate`

## Feedback

`Alert` · `ToastHost` + `showToast()` · `Banner` `BannerInline` `AnnounceBar` `NoticeBar` `Callout` `TipBox` `DisclaimerBox` · `Empty` `EmptyBlock` `MascotEmpty` · `Modal` `Sheet` `ConfirmBox` · `ProgressBar` `Skeleton` `LoadingRow` `OfflineStrip` `UndoBar` `SuccessPanel`

## Parchese / rodadas

`AgendaItem` `AgendaRow` `RideListItem` `RideCard` `OutingCard` (`compact` para grillas: mapa bajo, texto recortado) `RideFicha` `RideStates` `RideThreadHead` · `ApuntarseBox` · `TicketCard` `PrintTicket` `DonutCupo` · `MapBlock` (con `route`: mapa real con salida, destino, trazado, km y enlace a Google Maps) `RouteMap` (Leaflet + OpenStreetMap oscurecido; carga perezosa) `MapStatic` (estático) — nada de GPS en vivo · `Itinerary` `StopList` `Formation` `Countdown` `WeatherPill` · `MemoriaHero` `MemoryLayout` `Gallery` `PhotoMeta` `ParticipantRow`

## Tienda

`ProductCard` `ProductRow` `DealSpotlight` `ShopFicha` `ProdGallery` `ShelfHeader` `ShelfDivider` · `ServiceCard` `ServiceFicha` · `CartPanel` `OrderSummary` `CheckoutSteps` `PayPicker` `WaOrder` `Receipt` · `DeliveryZones` `ZoneBadge` `HoursTable` `SpecTable`

## Social / feed / cuenta

`FeedPost` `EngageBar` `HomeFeedWidget` · `Comment*` (lista, compose, replies, mod) · `CommunityCard` `CommunityDir` `CommunityScope` · `ChatLayout` `ChatBubble` `WaBubble` · `ProfileHead` `ProfilePublic` `Avatar` `AvatarStack` `Follow` `FriendRow` · `AuthPanel` `AccountTeaser` `UserPanel` `UserMenuDropdown` `LoginStrip`

## Tu voz

`TipLink` · `Comparendo` `ComparendoGuide` · `DenunciaCard` `DenunciaForm` · `EduCard` `GuidelinesList`

## Club / alianzas

`AllianceStrip` · `KitAllianceStrip` · `AllianceCard` `AllyTile` `AllyList` · `MemberCard` `MemberRowCard` `IntegranteCard` `UneteBlock` `WaStrip` `WaHero`

## Navegación in-page

`Tabs` `TabPanel` `VerticalTabs` `Segmented` · `Crumbs` `BackBar` `PageNav` `Pager` `Accordion` `CollapseCard` `DropMenu` `TreeNav` `SectionIndex` `FilterPills` `SortToolbar`

## Administración

`AdminBar` (barra fija al navegar con sesión de operador) · `AdminNav` (barra lateral del panel) · `AdminPane` (listado con título, conteo y acciones) · `AdminDrawer` (formulario en panel lateral) · `AdminSpot` + `AdminItemTools` (Editar / Borrar sobre una pieza pública; borrar pide doble toque). Textos por defecto en `adminCopy.ts`.

En el panel: listado primero, botón *Nuevo* abre el `AdminDrawer`. En vistas públicas, el módulo recibe `editClave` y envuelve cada pieza en `AdminSpot`.

## Datos / KPI

`StatBig` `StatGrid` `KpiStrip` `DataBlock` `Timeline` `KitTable` `CompareTable` `SparkBars` `RingProgress`

## Kit-only / demo (no uses en vistas de producto)

`*Demo` · `ArsenalBlock` `PhaseLabel` `PhaseRoadmap` `LabHero` `HeroFake` `SoonHero` `MotionKitSection` `ColorSwatch*` `BrushTypeDemo` `BrushDeco*` `SkipLinkDemo` `PaolaPageDemo` `SocialOutScope` `SocialRoadmapList` `AdminShell` `CmdPalette` (demo kit)

Si hace falta el API exacto (emit, slots), ahí sí abre el `.vue`.
