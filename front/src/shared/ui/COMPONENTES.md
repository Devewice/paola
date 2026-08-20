# Componentes `@ui`

Léete **esto** antes de abrir los `.vue` de `front/src/shared/ui/`.
Catálogo vivo: `/admin/ui`. Estilos: `html-kit.css`. Import: `import X from '@ui/X.vue'`.

Reglas: afiche (brocha) ≠ formularios; un CTA `hero` por vista; vacío → `PageVacant` / `Empty` / `EmptyBlock`.

## Cómo armar una vista

1. Hero a todo el ancho: `KitHero` (Inicio portal) o `AficheHero` (páginas).
2. Cuerpo en `.wrap`. Tablero: `HomeDash`.
3. Cascarón: `MegaHeader` + `SiteFooter` en `App.vue`.
4. Acciones: `Button` (`primary` | `hero` | `ghost` | `dark` | `danger` | `brush`).
5. Página sin contenido: `PageVacant`. Bloques vacíos: `Empty` / `EmptyBlock`.

## Cascarón y layout

| Componente | Para qué | Props / slots clave |
|---|---|---|
| `MegaHeader` | Header del portal: logo, 5 pestañas, panel overlay (no empuja el hero) | `items`, `whatsapp`, `accountTo`, slot `widget` |
| `MegaPeek` | Widget del mega menú (próxima, tip, km) | `kicker`, `title`, `meta`, `copy`, `value`, `imageSrc`, `to`, `empty` |
| `MegaFooter` | Columnas de enlaces del pie (kit/demo) | `columns: { title, links[{ label, to?, href? }] }` |
| `SiteFooter` | Pie del portal: crest, columnas, suscripción, alianzas | `columns`, `copy`, `alliances`, `subscribeMail`, … |
| `PageVacant` | Página en construcción (mascota + CTAs) | `title`, `kicker`, `copy` |
| `AppLink` | `router-link` o `<a>` según `to` / `href` | `to`, `href`, `target` |
| `KitHero` | Hero full-bleed del kit. `portal`: corte del día. `panelSlides`: mazo de rodadas (dots afuera, borde con resplandor) | `heroId`, `variant`, `tagline`, `kicker`, `photoSrc`, `panelSlides`, slots `voices` `panel` `footer` `actions` |
| `KitHeroPanel` | Panel “corte del día” | `title`, `km`, `cupo`, `fecha`, `splash`, `ctaTo`, `mediaSrc`, `blankMedia` |
| `KitHeroFooter` | KPIs bajo el hero portal | `stamp`, `rodadas`, `km`, `integrantes` |
| `AficheHero` | Hero de página (más bajo que el kit) | `kicker`, `title`, `plate`, `logo`, `photoSrc`, slots `lead` `actions` |
| `HomeDash` | Tablero Inicio: próxima + feed + columna lateral | slots `next` `pulse` `aside` |
| `DualChannel` | WhatsApp vs web (WA no se apaga) | slots `wa` `web` |
| `DualCta` | Dos CTAs en grid | default slot |
| `BottomNav` | 5 pestañas móviles (kit). El portal usa `.paola-bottom-nav` | `tabs` |
| `BrushDefs` | SVG filters; una vez en `App.vue` | — |

Clases kit (no son Vue): `.wrap` ancho de contenido · `.stack` columna con gap · `.row` flex wrap · `.top` header del catálogo `/admin/ui`.

## Marca / afiche / brocha

`BrushButton` CTA afiche (texto blanco, Montserrat 800) · `BrushSplash` mancha + label · `BrushBanner` / `KitBrushBanner` · `BrushDivider` / `KitBrushDivider` · `BrushPlate` · `AficheBlock` marco afiche · `AficheMiniDemo` `AficheAnapoimaDemo` `AficheCumpleDemo` `AficheRefs` solo kit · `VoiceBadge` Loigca/Incauta/Armargura · `VoiceCard` · `PaolaBlock` · `Mascot3d` cámara GL/OBJ · `MascotFlash` poses 360 + destello

## Botones, chips, iconos

`Button` · `SplitButton` · `BtnGroup` · `IconBtn` · `Icon` · `Chip` (abierto/lleno/cerrado/realizado) · `WishBtn` · `Fab` · `SpeedDial`

## Formularios

`Field` + `Input` / `Textarea` / `Select` / `PasswordField` / `PwdMeterField` · `Choice` `ChoiceList` · `PrivacyCheck` · `FilePicker` `Dropzone` `UploadQueue` · `QtyStepper` `RangeField` `OtpRow` `Search` `CalMiniPicker` `TimeChips` `SizePicker` `SwatchPicker` `CityGate`

## Feedback

`Alert` · `Banner` `BannerInline` `AnnounceBar` `NoticeBar` `Callout` `TipBox` `DisclaimerBox` · `Empty` `EmptyBlock` `MascotEmpty` · `Modal` `Sheet` `ConfirmBox` · `ProgressBar` `Skeleton` `LoadingRow` `OfflineStrip` `UndoBar` `SuccessPanel`

## Parchese / rodadas

`AgendaItem` `AgendaRow` `RideListItem` `RideCard` `OutingCard` `RideFicha` `RideStates` `RideThreadHead` · `ApuntarseBox` · `TicketCard` `PrintTicket` `DonutCupo` · `MapBlock` `MapStatic` (estático, no GPS en vivo) · `Itinerary` `StopList` `Formation` `Countdown` `WeatherPill` · `MemoriaHero` `MemoryLayout` `Gallery` `PhotoMeta` `ParticipantRow`

## Tienda

`ProductCard` `ProductRow` `ShopFicha` `ProdGallery` `ShelfHeader` `ShelfDivider` · `ServiceCard` `ServiceFicha` · `CartPanel` `OrderSummary` `CheckoutSteps` `PayPicker` `WaOrder` `Receipt` · `DeliveryZones` `ZoneBadge` `HoursTable` `SpecTable`

## Social / feed / cuenta

`FeedPost` `EngageBar` `HomeFeedWidget` · `Comment*` (lista, compose, replies, mod) · `CommunityCard` `CommunityDir` `CommunityScope` · `ChatLayout` `ChatBubble` `WaBubble` · `ProfileHead` `ProfilePublic` `Avatar` `AvatarStack` `Follow` `FriendRow` · `AuthPanel` `AccountTeaser` `UserPanel` `UserMenuDropdown` `LoginStrip`

## Tu voz

`TipLink` · `Comparendo` `ComparendoGuide` · `DenunciaCard` `DenunciaForm` · `EduCard` `GuidelinesList`

## Club / alianzas

`AllianceStrip` · `KitAllianceStrip` · `AllianceCard` `AllyTile` `AllyList` · `MemberCard` `MemberRowCard` `IntegranteCard` `UneteBlock` `WaStrip` `WaHero`

## Navegación in-page

`Tabs` `TabPanel` `VerticalTabs` `Segmented` · `Crumbs` `BackBar` `PageNav` `Pager` `Accordion` `CollapseCard` `DropMenu` `TreeNav` `SectionIndex` `FilterPills` `SortToolbar`

## Datos / KPI

`StatBig` `StatGrid` `KpiStrip` `DataBlock` `Timeline` `KitTable` `CompareTable` `SparkBars` `RingProgress`

## Kit-only / demo (no uses en vistas de producto)

`*Demo` · `ArsenalBlock` `PhaseLabel` `PhaseRoadmap` `LabHero` `HeroFake` `SoonHero` `MotionKitSection` `ColorSwatch*` `BrushTypeDemo` `BrushDeco*` `SkipLinkDemo` `PaolaPageDemo` `SocialOutScope` `SocialRoadmapList` `AdminShell` `CmdPalette` (demo kit)

Si hace falta el API exacto (emit, slots), ahí sí abre el `.vue`.
