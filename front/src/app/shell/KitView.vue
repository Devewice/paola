<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import { runKitHeroEntrance } from '@shared/motion/runKitHero.ts'
import Accordion from '@ui/Accordion.vue'
import AccountTeaser from '@ui/AccountTeaser.vue'
import ActionBar from '@ui/ActionBar.vue'
import ActionList from '@ui/ActionList.vue'
import ActivityMini from '@ui/ActivityMini.vue'
import AficheAnapoimaDemo from '@ui/AficheAnapoimaDemo.vue'
import AficheCumpleDemo from '@ui/AficheCumpleDemo.vue'
import AficheMiniDemo from '@ui/AficheMiniDemo.vue'
import AficheRefs from '@ui/AficheRefs.vue'
import AddressCard from '@ui/AddressCard.vue'
import AdminShell from '@ui/AdminShell.vue'
import AgendaRow from '@ui/AgendaRow.vue'
import Alert from '@ui/Alert.vue'
import AllianceCard from '@ui/AllianceCard.vue'
import AllyList from '@ui/AllyList.vue'
import AllyTile from '@ui/AllyTile.vue'
import AnnounceBar from '@ui/AnnounceBar.vue'
import ApuntarseBox from '@ui/ApuntarseBox.vue'
import ApuntarseFormDemo from '@ui/ApuntarseFormDemo.vue'
import ArsenalBlock from '@ui/ArsenalBlock.vue'
import AuditList from '@ui/AuditList.vue'
import AuthPanel from '@ui/AuthPanel.vue'
import AuthLoginDemo from '@ui/AuthLoginDemo.vue'
import AudioPlayer from '@ui/AudioPlayer.vue'
import Avatar from '@ui/Avatar.vue'
import AvatarStack from '@ui/AvatarStack.vue'
import AvatarUpload from '@ui/AvatarUpload.vue'
import BadgeGrid from '@ui/BadgeGrid.vue'
import BadgeLiveOff from '@ui/BadgeLiveOff.vue'
import Banner from '@ui/Banner.vue'
import BannerInline from '@ui/BannerInline.vue'
import BatchBar from '@ui/BatchBar.vue'
import BeforeAfter from '@ui/BeforeAfter.vue'
import BlogCard from '@ui/BlogCard.vue'
import BackBar from '@ui/BackBar.vue'
import BottomNavDemo from '@ui/BottomNavDemo.vue'
import BtnGroup from '@ui/BtnGroup.vue'
import BrushButton from '@ui/BrushButton.vue'
import BrushDecoGrid from '@ui/BrushDecoGrid.vue'
import BrushDecoSizes from '@ui/BrushDecoSizes.vue'
import BrushSplash from '@ui/BrushSplash.vue'
import BrushTypeDemo from '@ui/BrushTypeDemo.vue'
import Button from '@ui/Button.vue'
import CalendarMini from '@ui/CalendarMini.vue'
import CalMiniPicker from '@ui/CalMiniPicker.vue'
import Callout from '@ui/Callout.vue'
import Card from '@ui/Card.vue'
import Carousel from '@ui/Carousel.vue'
import CartPanel from '@ui/CartPanel.vue'
import CatalogToolbar from '@ui/CatalogToolbar.vue'
import ChatBubble from '@ui/ChatBubble.vue'
import ChatLayout from '@ui/ChatLayout.vue'
import CheckList from '@ui/CheckList.vue'
import Changelog from '@ui/Changelog.vue'
import CheckoutSteps from '@ui/CheckoutSteps.vue'
import Chip from '@ui/Chip.vue'
import Choice from '@ui/Choice.vue'
import ChoiceList from '@ui/ChoiceList.vue'
import CityGate from '@ui/CityGate.vue'
import CmdPalette from '@ui/CmdPalette.vue'
import CodeCopy from '@ui/CodeCopy.vue'
import ColorSwatchGrid from '@ui/ColorSwatchGrid.vue'
import CollapseCard from '@ui/CollapseCard.vue'
import Comment from '@ui/Comment.vue'
import CommentCompose from '@ui/CommentCompose.vue'
import CommentClosed from '@ui/CommentClosed.vue'
import CommentList from '@ui/CommentList.vue'
import CommentReplyBox from '@ui/CommentReplyBox.vue'
import CommentLoadMore from '@ui/CommentLoadMore.vue'
import CommentActions from '@ui/CommentActions.vue'
import CommentReplies from '@ui/CommentReplies.vue'
import CommentRemoved from '@ui/CommentRemoved.vue'
import CommentToolbar from '@ui/CommentToolbar.vue'
import CommunityCard from '@ui/CommunityCard.vue'
import CommunityDir from '@ui/CommunityDir.vue'
import CommunityScope from '@ui/CommunityScope.vue'
import Comparendo from '@ui/Comparendo.vue'
import ComparendoGuide from '@ui/ComparendoGuide.vue'
import CompareTable from '@ui/CompareTable.vue'
import ContactCard from '@ui/ContactCard.vue'
import ConfirmBox from '@ui/ConfirmBox.vue'
import CookiePrefs from '@ui/CookiePrefs.vue'
import CornerRibbon from '@ui/CornerRibbon.vue'
import Crumbs from '@ui/Crumbs.vue'
import Countdown from '@ui/Countdown.vue'
import DeliveryZones from '@ui/DeliveryZones.vue'
import DenunciaCard from '@ui/DenunciaCard.vue'
import DenunciaForm from '@ui/DenunciaForm.vue'
import DividerOr from '@ui/DividerOr.vue'
import DisclaimerBox from '@ui/DisclaimerBox.vue'
import DiscountRow from '@ui/DiscountRow.vue'
import DonutCupo from '@ui/DonutCupo.vue'
import DropMenu from '@ui/DropMenu.vue'
import Dropzone from '@ui/Dropzone.vue'
import DataBlock from '@ui/DataBlock.vue'
import DualChannelPills from '@ui/DualChannelPills.vue'
import DualChannel from '@ui/DualChannel.vue'
import DualCta from '@ui/DualCta.vue'
import EduCard from '@ui/EduCard.vue'
import EmbedBlock from '@ui/EmbedBlock.vue'
import EmergencyStrip from '@ui/EmergencyStrip.vue'
import Empty from '@ui/Empty.vue'
import EmptyBlock from '@ui/EmptyBlock.vue'
import EngageBar from '@ui/EngageBar.vue'
import ExpandTable from '@ui/ExpandTable.vue'
import Fab from '@ui/Fab.vue'
import FaqList from '@ui/FaqList.vue'
import Feature from '@ui/Feature.vue'
import FeatureIcons from '@ui/FeatureIcons.vue'
import FeedPost from '@ui/FeedPost.vue'
import Field from '@ui/Field.vue'
import FilePicker from '@ui/FilePicker.vue'
import FilterPills from '@ui/FilterPills.vue'
import Follow from '@ui/Follow.vue'
import FriendRow from '@ui/FriendRow.vue'
import Formation from '@ui/Formation.vue'
import Gallery from '@ui/Gallery.vue'
import GearGrid from '@ui/GearGrid.vue'
import GuidelinesList from '@ui/GuidelinesList.vue'
import Heatmap from '@ui/Heatmap.vue'
import HeroFake from '@ui/HeroFake.vue'
import HeroSplit from '@ui/HeroSplit.vue'
import HomeDash from '@ui/HomeDash.vue'
import HomeFeedWidget from '@ui/HomeFeedWidget.vue'
import HoursTable from '@ui/HoursTable.vue'
import IconBtn from '@ui/IconBtn.vue'
import IconToolbar from '@ui/IconToolbar.vue'
import Input from '@ui/Input.vue'
import IntegranteCard from '@ui/IntegranteCard.vue'
import IntegrantesRow from '@ui/IntegrantesRow.vue'
import Itinerary from '@ui/Itinerary.vue'
import KitAllianceStrip from '@ui/KitAllianceStrip.vue'
import KitBrushDivider from '@ui/KitBrushDivider.vue'
import KitHero from '@ui/KitHero.vue'
import KitHeroFooter from '@ui/KitHeroFooter.vue'
import KitHeroPanel from '@ui/KitHeroPanel.vue'
import KitChecklist from '@ui/KitChecklist.vue'
import KitQuote from '@ui/KitQuote.vue'
import KitTable from '@ui/KitTable.vue'
import KpiStrip from '@ui/KpiStrip.vue'
import LabHero from '@ui/LabHero.vue'
import Leaderboard from '@ui/Leaderboard.vue'
import LegalToc from '@ui/LegalToc.vue'
import LightboxGrid from '@ui/LightboxGrid.vue'
import LinkPreview from '@ui/LinkPreview.vue'
import ListBlock from '@ui/ListBlock.vue'
import LoadingRow from '@ui/LoadingRow.vue'
import LoginStrip from '@ui/LoginStrip.vue'
import MapBlock from '@ui/MapBlock.vue'
import MapStatic from '@ui/MapStatic.vue'
import MascotBubble from '@ui/MascotBubble.vue'
import MascotEmpty from '@ui/MascotEmpty.vue'
import MemoryLayout from '@ui/MemoryLayout.vue'
import MaintCard from '@ui/MaintCard.vue'
import MegaFooter from '@ui/MegaFooter.vue'
import MemberRowCard from '@ui/MemberRowCard.vue'
import MembershipTeaser from '@ui/MembershipTeaser.vue'
import MemoryGalleryDemo from '@ui/MemoryGalleryDemo.vue'
import MemoriaHero from '@ui/MemoriaHero.vue'
import MobileRowCard from '@ui/MobileRowCard.vue'
import ModItem from '@ui/ModItem.vue'
import ModActions from '@ui/ModActions.vue'
import ModBar from '@ui/ModBar.vue'
import MotionKitSection from '@ui/MotionKitSection.vue'
import ModeCards from '@ui/ModeCards.vue'
import MediaList from '@ui/MediaList.vue'
import MentionChip from '@ui/MentionChip.vue'
import Modal from '@ui/Modal.vue'
import MultiProgress from '@ui/MultiProgress.vue'
import Newsletter from '@ui/Newsletter.vue'
import NoPopupBanner from '@ui/NoPopupBanner.vue'
import NoticeBar from '@ui/NoticeBar.vue'
import NotifyPrefs from '@ui/NotifyPrefs.vue'
import NotifyList from '@ui/NotifyList.vue'
import NotifDropdown from '@ui/NotifDropdown.vue'
import OfflineStrip from '@ui/OfflineStrip.vue'
import NpsScale from '@ui/NpsScale.vue'
import OgPreview from '@ui/OgPreview.vue'
import OnboardSteps from '@ui/OnboardSteps.vue'
import OrderSummary from '@ui/OrderSummary.vue'
import OtpRow from '@ui/OtpRow.vue'
import Pager from '@ui/Pager.vue'
import PagerText from '@ui/PagerText.vue'
import PaolaPageDemo from '@ui/PaolaPageDemo.vue'
import PageNav from '@ui/PageNav.vue'
import ParticipantRow from '@ui/ParticipantRow.vue'
import ParcheseActivity from '@ui/ParcheseActivity.vue'
import PayPicker from '@ui/PayPicker.vue'
import PrivacyDoc from '@ui/PrivacyDoc.vue'
import PwdMeterField from '@ui/PwdMeterField.vue'
import PaperFrame from '@ui/PaperFrame.vue'
import PasswordField from '@ui/PasswordField.vue'
import PhaseLabel from '@ui/PhaseLabel.vue'
import PhaseRoadmap from '@ui/PhaseRoadmap.vue'
import PhotoMeta from '@ui/PhotoMeta.vue'
import PinBoard from '@ui/PinBoard.vue'
import PinList from '@ui/PinList.vue'
import Pipeline from '@ui/Pipeline.vue'
import Poll from '@ui/Poll.vue'
import PopoverWrap from '@ui/PopoverWrap.vue'
import PricingGrid from '@ui/PricingGrid.vue'
import PrintTicket from '@ui/PrintTicket.vue'
import ProdGallery from '@ui/ProdGallery.vue'
import ProductCard from '@ui/ProductCard.vue'
import ProfileHead from '@ui/ProfileHead.vue'
import ProfilePublic from '@ui/ProfilePublic.vue'
import ProductRow from '@ui/ProductRow.vue'
import ProgressBar from '@ui/ProgressBar.vue'
import PwaBanner from '@ui/PwaBanner.vue'
import QrBlock from '@ui/QrBlock.vue'
import QtyStepper from '@ui/QtyStepper.vue'
import QuoteBlock from '@ui/QuoteBlock.vue'
import QuoteReply from '@ui/QuoteReply.vue'
import RangeField from '@ui/RangeField.vue'
import RatingRow from '@ui/RatingRow.vue'
import ReasonChips from '@ui/ReasonChips.vue'
import Receipt from '@ui/Receipt.vue'
import RibbonCard from '@ui/RibbonCard.vue'
import RoadmapLayout from '@ui/RoadmapLayout.vue'
import RideCard from '@ui/RideCard.vue'
import RideFicha from '@ui/RideFicha.vue'
import RideStates from '@ui/RideStates.vue'
import RideThreadHead from '@ui/RideThreadHead.vue'
import RideListItem from '@ui/RideListItem.vue'
import RingProgress from '@ui/RingProgress.vue'
import RouteCard from '@ui/RouteCard.vue'
import Search from '@ui/Search.vue'
import ScrollStrip from '@ui/ScrollStrip.vue'
import SectionIndex from '@ui/SectionIndex.vue'
import Select from '@ui/Select.vue'
import ServiceCard from '@ui/ServiceCard.vue'
import ServiceFicha from '@ui/ServiceFicha.vue'
import ShareIconRow from '@ui/ShareIconRow.vue'
import ShopFicha from '@ui/ShopFicha.vue'
import SoonHero from '@ui/SoonHero.vue'
import SpeedDial from '@ui/SpeedDial.vue'
import SplitButton from '@ui/SplitButton.vue'
import StatBig from '@ui/StatBig.vue'
import Segmented from '@ui/Segmented.vue'
import ShareRowInput from '@ui/ShareRowInput.vue'
import ShareRow from '@ui/ShareRow.vue'
import SortToolbar from '@ui/SortToolbar.vue'
import SocialOutScope from '@ui/SocialOutScope.vue'
import SocialRoadmapList from '@ui/SocialRoadmapList.vue'
import ShellNav from '@ui/ShellNav.vue'
import ShelfDivider from '@ui/ShelfDivider.vue'
import ShelfHeader from '@ui/ShelfHeader.vue'
import SidebarLayout from '@ui/SidebarLayout.vue'
import SiteFooter from '@ui/SiteFooter.vue'
import SizePicker from '@ui/SizePicker.vue'
import Skeleton from '@ui/Skeleton.vue'
import SkipLinkDemo from '@ui/SkipLinkDemo.vue'
import SlotGrid from '@ui/SlotGrid.vue'
import SparkBars from '@ui/SparkBars.vue'
import SpecTable from '@ui/SpecTable.vue'
import StatGrid from '@ui/StatGrid.vue'
import StatusList from '@ui/StatusList.vue'
import Steps from '@ui/Steps.vue'
import StickyCta from '@ui/StickyCta.vue'
import StopList from '@ui/StopList.vue'
import SuccessPanel from '@ui/SuccessPanel.vue'
import SwatchPicker from '@ui/SwatchPicker.vue'
import TabPanel from '@ui/TabPanel.vue'
import Tabs from '@ui/Tabs.vue'
import TagCloud from '@ui/TagCloud.vue'
import Sheet from '@ui/Sheet.vue'
import TooltipWrap from '@ui/TooltipWrap.vue'
import Testimonial from '@ui/Testimonial.vue'
import Textarea from '@ui/Textarea.vue'
import ThumbsRow from '@ui/ThumbsRow.vue'
import TicketCard from '@ui/TicketCard.vue'
import TimeChips from '@ui/TimeChips.vue'
import TipBox from '@ui/TipBox.vue'
import TipLink from '@ui/TipLink.vue'
import Timeline from '@ui/Timeline.vue'
import ToggleList from '@ui/ToggleList.vue'
import TreeNav from '@ui/TreeNav.vue'
import TrustStrip from '@ui/TrustStrip.vue'
import UploadQueue from '@ui/UploadQueue.vue'
import VerticalTabs from '@ui/VerticalTabs.vue'
import VideoBlock from '@ui/VideoBlock.vue'
import VideoThumb from '@ui/VideoThumb.vue'
import Viewer360 from '@ui/Viewer360.vue'
import VoiceBadge from '@ui/VoiceBadge.vue'
import VoiceCard from '@ui/VoiceCard.vue'
import WaBubble from '@ui/WaBubble.vue'
import UneteBlock from '@ui/UneteBlock.vue'
import UndoBar from '@ui/UndoBar.vue'
import UserMenuDropdown from '@ui/UserMenuDropdown.vue'
import UserPanel from '@ui/UserPanel.vue'
import WaHero from '@ui/WaHero.vue'
import WaOrder from '@ui/WaOrder.vue'
import WalletPass from '@ui/WalletPass.vue'
import WaStrip from '@ui/WaStrip.vue'
import WeatherPill from '@ui/WeatherPill.vue'
import WishBtn from '@ui/WishBtn.vue'
import ZoneBadge from '@ui/ZoneBadge.vue'

const nombre = ref('')
const wa = ref('')
const ciudad = ref('bogota')
const moto = ref('')
const nota = ref('')
const fotosOk = ref(true)
const privacidad = ref(false)
const tipoSalida = ref('rodada')
const avisos = ref(true)
const qty = ref(1)
const searchShop = ref('')
const waError = ref('abc')
const filterShelf = ref('todo')
const sortBy = ref('fecha')
const modalOpen = ref(false)
const sheetOpen = ref(false)
const denuncia = ref('')
const navTab = ref('t1')
const pagerPage = ref(2)
const rideTime = ref('6am')
const segmentedMem = ref('rodadas')
const commentSort = ref('recientes')
const notifyComment = ref(true)
const notifyReply = ref(true)
const notifyMemory = ref(false)
const notifyReact = ref(false)
const commentDraft = ref('')
const followComm = ref(true)
const passDemo = ref('parche2026')
const otpCode = ref('')
const shopTags = ref(['Pulsar NS200', 'Bogotá', 'Nocturna'])
const carouselSlide = ref(0)
const rating = ref(3)
const sizePick = ref('M')
const vTab = ref('inicio')
const cmdOpen = ref(false)
const cookieAnalytics = ref(false)
const cookiePrefs = ref(false)
const colorPick = ref('blue')
const discountCode = ref('')
const npsScore = ref<number | undefined>()
const newsletterEmail = ref('')
const prodView = ref('Vista 1')
const wishOn = ref(false)
const catalogView = ref<'grid' | 'list'>('grid')
const deliveryMode = ref('entrega')
const kmMine = ref(false)
const onboardStep = ref(1)
const helmetSlot = ref('11:00')
const thumbsPick = ref<'yes' | 'no' | undefined>()
const reportReason = ref('Contenido falso')
const batchVisible = ref(false)
const shellTab = ref('inicio')
const priceRange = ref(60)
const pwdKit = ref('')
const kitPage = ref(1)
const iconTool = ref('edit')
const undoVisible = ref(false)
const cityGate = ref('bogota')
const payMethod = ref('wa')
const settingRows = ref([
  { id: 'rodada', label: 'Notificaciones rodada', on: true },
  { id: 'wa', label: 'Recordatorio WhatsApp', on: false },
  { id: 'publico', label: 'Perfil público', on: true },
])

function removeTag(tag: string): void {
  shopTags.value = shopTags.value.filter((item) => item !== tag)
}

function toggleSetting(id: string): void {
  settingRows.value = settingRows.value.map((row) => (row.id === id ? { ...row, on: !row.on } : row))
}

const ciudadOptions = [
  { value: 'bogota', label: 'Bogotá' },
  { value: 'soacha', label: 'Soacha' },
  { value: 'otra', label: 'Otra — aún no hay envío', muted: true },
] as const

const sortOptions = [
  { value: 'fecha', label: 'Por fecha' },
  { value: 'cupo', label: 'Por cupo' },
  { value: 'nombre', label: 'Por nombre' },
] as const

const shelfPills = [
  { id: 'todo', label: 'Todo' },
  { id: 'paola', label: 'Paola' },
  { id: 'collab', label: 'Collab' },
  { id: 'rodadas', label: 'Rodadas' },
] as const

const navTabs = [
  { id: 't1', label: 'Agenda' },
  { id: 't2', label: 'Memorias' },
  { id: 't3', label: 'Alianzas' },
] as const

const calendarCells = [
  { label: 'L', muted: true },
  { label: 'M', muted: true },
  { label: 'X', muted: true },
  { label: 'J', muted: true },
  { label: 'V', muted: true },
  { label: 'S', muted: true },
  { label: 'D', muted: true },
  { label: '', muted: true },
  { label: '1', day: true },
  { label: '2', day: true },
  { label: '3', day: true },
  { label: '4', day: true },
  { label: '5', day: true },
  { label: '6', day: true, on: true },
  { label: '7', day: true },
  { label: '8', day: true },
  { label: '9', day: true },
  { label: '10', day: true },
  { label: '11', day: true },
  { label: '12', day: true },
  { label: '13', day: true },
  { label: '14', day: true },
  { label: '15', day: true },
] as const

const timeChipOptions = [
  { id: '6am', label: '6:00 a.m.' },
  { id: '7am', label: '7:00 a.m.' },
  { id: 'tarde', label: 'Tarde', disabled: true },
] as const

const pipelineDemo = [
  { label: 'Recibida', state: 'done' as const },
  { label: 'Revisión', state: 'active' as const },
  { label: 'Publicada', state: 'idle' as const },
]

const notifyDemo = [
  { title: 'Cupo confirmado — Anapoima', meta: 'Hace 1 h · ticket a tu nombre', unread: true },
  { title: 'Memoria nueva publicada', meta: 'Ayer · 36 fotos' },
]

const sidebarItems = [
  { label: 'Resumen', href: '#catalogo' },
  { label: 'Tickets', href: '#catalogo' },
  { label: 'Pedidos', href: '#catalogo' },
  { label: 'Denuncias', href: '#catalogo' },
] as const

const prefItems = [
  { title: 'Notificaciones', meta: 'Email · próximamente', href: '#catalogo' },
  { title: 'Privacidad en memorias', meta: 'Salir en fotos', href: '#catalogo' },
] as const

const listSimpleItems = ['Parchese', 'Tu voz', 'Tienda'] as const
const listOrderedItems = ['Crear salida', 'Tomar ticket', 'Pasar a memoria'] as const
const kitChecklistItems = [
  { id: 'ck-logo', label: 'Logo PNG en header', checked: true },
  { id: 'ck-cta', label: 'CTA en mayúsculas', checked: true },
  { id: 'ck-roboto', label: 'Quitar Roboto del portal' },
] as const
const choiceRadioItems = [
  { title: 'Rodada', meta: 'Ruta en grupo · cupo limitado', checked: true },
  { title: 'Actividad', meta: 'Encuentro sin ruta larga' },
] as const
const choiceCheckItems = [
  { title: 'Casco', meta: 'Obligatorio en rodada', checked: true },
  { title: 'Salir en fotos / memoria', meta: 'Cámara Incauta puede publicar', checked: true },
  { title: 'Chaleco reflectivo', meta: 'Recomendado de noche' },
] as const
const actionListDemoItems = [
  { title: 'Mis tickets', meta: '2 activos · 1 realizado', href: '#forms' },
  { title: 'Memorias de rodadas', meta: 'Fotos y km del parche', href: '#nav' },
  { title: 'Escribirle a Paola', meta: 'WhatsApp · pago y cupo', href: '#feedback' },
] as const
const mediaListItems = [
  { avatar: 'N', title: 'Nezko', meta: 'Moto por confirmar', chip: 'En parche' },
  { avatar: 'P', title: 'Paola', meta: 'Operadora · rodada Anapoima', chip: 'Host', chipTone: 'realizado' as const },
] as const
const dropMenuItems = ['Inicio', 'Parchese', 'Tu voz', 'Tienda', 'Paola'] as const
const kitTableColumns = ['Salida', 'Cupo', 'Estado'] as const
const kitTableRows = [
  { cells: ['Anapoima', '12 / 20'], chip: 'Abierto' },
  { cells: ['Cumpleaños', '20 / 20'], chip: 'Lleno', chipTone: 'lleno' as const },
  { cells: ['Primera rodada', '—'], chip: 'Realizado', chipTone: 'realizado' as const },
] as const
const deliveryModeOptions = [
  { value: 'entrega', title: 'Entrega', copy: 'Bogotá / Soacha' },
  { value: 'recoger', title: 'Recoger', copy: 'Punto por confirmar' },
] as const

const cartLines = [
  { title: 'Bandana azul', qty: '× 1', price: '$ —' },
  { title: 'Servicio casco', qty: '× 1', price: '$ —' },
] as const

const sizeOptions = [
  { id: 'S', label: 'S' },
  { id: 'M', label: 'M' },
  { id: 'L', label: 'L' },
  { id: 'XL', label: 'XL', disabled: true },
] as const

const trustItems = [
  { title: 'Garantía', copy: 'Solo defectos de fabricación' },
  { title: 'Entrega', copy: 'Bogotá y Soacha gratis' },
  { title: 'Pago', copy: 'WhatsApp con Paola primero' },
  { title: 'Cascos', copy: 'Si quedó mal, se corrige' },
] as const

const pollOptions = [
  { label: 'Anapoima', pct: '—%', width: '60%' },
  { label: 'Cundinamarca', pct: '—%', width: '30%' },
] as const

const vTabItems = [
  { id: 'inicio', label: 'Inicio', panel: 'Contenido Inicio · hero, KPIs, próxima rodada.' },
  { id: 'parchese', label: 'Parchese', panel: 'Parchese · calendario, lista, apúntese.' },
  { id: 'tienda', label: 'Tienda', panel: 'Tienda · estanterías Paola y collab aparte.' },
] as const

const cmdItems = [
  'Próxima rodada',
  'Tienda · Marca Paola',
  'Apúntese WhatsApp',
  'Comparendos · educación',
] as const

const socialRoadmap = [
  { bold: '28–31', text: 'comentarios y reacciones (MVP comunidad)' },
  { bold: '32–35', text: 'amigos, chat, hilos rodada, actividad Parchese' },
  { bold: '25', text: 'reglas dos canales (web + WhatsApp)' },
  { bold: '36–44', text: 'red social Paola en web — horizonte acordado' },
  { bold: 'WhatsApp', text: 'no se apaga · sin algoritmo viral · sin vender datos' },
] as const

const footerLinks = [
  { label: 'Apúntese', href: '#forms' },
  { label: 'Avisos legales', href: '#feedback' },
  { label: 'Privacidad', href: '#patrones' },
] as const

const checkoutDemo = [
  { label: 'Carrito', meta: 'Productos elegidos', state: 'done' as const },
  { label: 'Datos', meta: 'Ciudad y contacto', state: 'active' as const },
  { label: 'Pago', meta: 'WhatsApp con Paola', state: 'idle' as const },
]

const receiptLines = [
  { label: 'Bandana azul ×1', value: '$ —' },
  { label: 'Envío Bogotá', value: 'Gratis' },
  { label: 'Descuento', value: '—', discount: true },
  { label: 'Total', value: '$ —', total: true },
]

const compareHeaders = ['Bandana', 'Buff collab'] as const
const compareRows = [
  { label: 'Marca Paola', cells: ['✓', '—'] },
  { label: 'Estantería aparte', cells: ['—', '✓'] },
  { label: 'Entrega local', cells: ['✓', '✓'] },
] as const

const faqItems = [
  { q: '¿Cómo pago?', a: 'Primero escribirle a Paola por WhatsApp o correo.' },
  { q: '¿Envían a Medellín?', a: 'Aún no hay envío nacional. Solo Bogotá y Soacha gratis.' },
  { q: '¿Membresía?', a: 'Próximamente · precio y beneficios por definir.' },
  { q: '¿Ticket rodada?', a: 'Sistema propio con cupo. No Eventbrite al inicio.' },
] as const

const megaCols = [
  { title: 'Parche', links: [{ label: 'Rodadas', href: '#arsenal' }, { label: 'Únete WhatsApp', href: '#arsenal' }] },
  { title: 'Tienda', links: [{ label: 'Marca Paola', href: '#arsenal' }, { label: 'Collab aparte', href: '#arsenal' }] },
  { title: 'Tu voz', links: [{ label: 'Comparendos', href: '#arsenal' }, { label: 'Denuncias', href: '#arsenal' }] },
  { title: 'Legal', links: [{ label: 'Avisos', href: '#feedback' }, { label: 'Privacidad', href: '#arsenal' }] },
] as const

const membershipPlans = [
  { name: 'Base', price: '—', note: 'Próximamente' },
  { name: 'Parche', price: '—', note: 'Fase 21', featured: true },
  { name: 'Full', price: '—', note: 'Por definir' },
] as const

const itineraryStops = [
  { title: 'Salida', time: '—:—', active: true },
  { title: 'Parada', time: 'TBD' },
  { title: 'Destino', time: 'Anapoima' },
  { title: 'Regreso', time: '—:—' },
] as const

const stopTimes = [
  { time: '—:—', title: 'Punto de encuentro', meta: 'Por confirmar en grupo' },
  { time: '—:—', title: 'Parada técnica', meta: 'Combustible / café' },
  { time: '—:—', title: 'Destino', meta: 'Anapoima' },
] as const

const helmetSlots = [
  { id: '9:00', label: '9:00' },
  { id: '11:00', label: '11:00' },
  { id: '14:00', label: '14:00' },
  { id: '16:00', label: '16:00', disabled: true },
  { id: '17:00', label: '17:00' },
  { id: '18:00', label: '18:00' },
] as const

const treeNavItems = [
  { label: 'Marca Paola', active: true, expanded: true, children: [{ label: 'Ropa' }, { label: 'Accesorios' }] },
  { label: 'Estantería collab', expanded: false },
  { label: 'Servicio cascos', expanded: false },
] as const

const heatmapCells = [
  'l1', '', 'l2', '', 'l3', '', 'l1', '', 'l2', '', '', 'l1',
  '', 'l2', '', 'l3', '', 'l1', '', '', 'l2', '', 'l1', '',
  'l3', '', '', 'l1', '', 'l2', 'l3', '', '', 'l1', '', 'l2',
] as const

const sparkHeights = ['30%', '55%', '40%', '80%', '45%', '65%', '50%'] as const

const multiProgressRows = [
  { label: 'Km mes', value: '—', width: '65%' },
  { label: 'Rodadas', value: '—', width: '40%' },
] as const

const expandTableRows = [
  { id: '0', order: '#0000', status: 'En revisión', detail: 'Detalle: Bandana ×1 · pago pendiente WhatsApp · entrega Bogotá.' },
  { id: '1', order: '#0001', status: 'Placeholder', detail: 'Sin pedidos reales aún.' },
] as const

const formationRows = [
  { count: 1, lead: true },
  { count: 2 },
  { count: 3 },
] as const

const gearItems = [
  { icon: 'helmet', label: 'Casco' },
  { icon: 'glove', label: 'Guantes', tone: 'cyan' as const },
  { icon: 'vest', label: 'Chaleco' },
] as const

const reportReasons = ['Spam', 'Contenido falso', 'Menor de edad', 'Doxxing'] as const

const guidelineItems = [
  'No linchamiento ni doxxing.',
  'No menores identificables sin consentimiento.',
  'Constancia comunitaria, no denuncia penal.',
  'Moderación humana — una operadora.',
] as const

const scrollStripItems = [
  { title: 'Anapoima', meta: 'Rodada' },
  { title: '360°', meta: 'Mascota' },
  { title: 'Tips', meta: 'Moto Loigca' },
] as const

const featureIconItems = [
  { icon: '🎫', label: 'Tickets propios' },
  { icon: '📦', label: 'Entrega local' },
  { icon: '🛡', label: 'Garantía clara' },
  { icon: '💬', label: 'WhatsApp primero' },
] as const

const uploadFiles = [
  { name: 'evidencia.jpg', width: '80%' },
  { name: 'foto_ruta.webp', width: '35%' },
] as const

const shellTabs = [
  { id: 'inicio', label: 'Inicio', href: '#roadmap' },
  { id: 'parchese', label: 'Parchese', href: '#roadmap' },
  { id: 'voz', label: 'Tu voz', href: '#roadmap' },
  { id: 'tienda', label: 'Tienda', href: '#roadmap' },
  { id: 'paola', label: 'Paola', href: '#roadmap' },
] as const

const phaseSocialMap = [
  { phase: '25', title: 'Dos canales', copy: 'Web + WhatsApp' },
  { phase: '28', title: 'Comentarios', copy: 'Memorias moderadas' },
  { phase: '29', title: 'Reacciones', copy: 'Compartir' },
  { phase: '30', title: 'Notificaciones', copy: 'Panel' },
  { phase: '31', title: 'Perfil', copy: 'Parcero público' },
  { phase: '32–35', title: 'Social+', copy: 'Amigos · chat · feed Parchese' },
  { phase: '36–44', title: 'Red social', copy: 'Comunidades · feed · integración', tone: 'future' as const },
] as const

const phaseSocialGated = [
  { phase: '32', title: 'Amigos', copy: 'Solicitar · aceptar · bloquear', tone: 'gated' as const },
  { phase: '33', title: 'Chat', copy: '1:1 · moderado · reportar', tone: 'gated' as const },
  { phase: '34', title: 'Hilo rodada', copy: 'Solo con ticket · Paola fija avisos', tone: 'gated' as const },
  { phase: '35', title: 'Actividad Parchese', copy: 'Cronológico · no Inicio', tone: 'gated' as const },
] as const

const phaseSocialFuture = [
  { phase: '36', title: 'Comunidades', copy: 'Grupos con URL propia', tone: 'future' as const },
  { phase: '37', title: 'Dual WA', copy: 'Web + enlace grupo', tone: 'future' as const },
  { phase: '38', title: 'Seguir', copy: 'Comunidades y voces', tone: 'future' as const },
  { phase: '39', title: 'Feed', copy: 'Timeline cronológico', tone: 'future' as const },
  { phase: '40', title: 'Seguir parceros', copy: 'Unidireccional', tone: 'future' as const },
  { phase: '41', title: 'Moderadores', copy: 'Delegados por comunidad', tone: 'future' as const },
  { phase: '42', title: 'Inicio social', copy: 'Widget, no TikTok', tone: 'future' as const },
  { phase: '43–44', title: 'Integración', copy: 'Chat rico + auditoría', tone: 'future' as const },
] as const

const swatchFondos = [
  { css: 'var(--black)', label: '--black · #05070C · página' },
  { css: 'var(--ink)', label: '--ink · #000814 · cards profundas' },
  { css: 'var(--surface)', label: '--surface · #0B1018 · tarjeta' },
  { css: 'var(--navy)', label: '--navy · #001028 · bloques' },
  { css: 'var(--navy-mid)', label: '--navy-mid · #003060 · hover' },
  { css: 'var(--line)', label: '--line · #1A2A40 · divisores' },
] as const

const swatchMarca = [
  { css: 'var(--blue)', label: '--blue · #0088F8 · CTA' },
  { css: 'var(--blue-deep)', label: '--blue-deep · #0068C8 · pressed' },
  { css: 'var(--cyan)', label: '--cyan · #48B4FC · hover / focus' },
  { css: 'var(--cyan-soft)', label: '--cyan-soft · #70C0F8 · chips' },
  { css: 'var(--white)', label: '--white · #F7FAFC · texto', border: true },
  { css: 'var(--muted)', label: '--muted · #8B9BB0 · meta' },
] as const

const swatchSemanticos = [
  { css: 'var(--danger)', label: '--danger · #E23B4A · error' },
  { css: 'var(--ok)', label: '--ok · #3DDC97 · éxito / cupo' },
  { css: 'var(--warn)', label: '--warn · #E8A020 · aviso' },
  { css: 'var(--chip-muted)', label: '--chip-muted · #1A1F28 · chip lleno' },
] as const

const swatchVoces = [
  { css: 'var(--loigca)', label: '--loigca · #0088F8 · datos, ley, tips' },
  { css: 'var(--incauta)', label: '--incauta · #E2E8F0 · evidencia, foto', border: true },
  { css: 'var(--armargura)', label: '--armargura · #C878B4 · relato, denuncia' },
  { css: 'var(--armargura-soft)', label: '--armargura-soft · #D8A0E0 · texto badge' },
  { css: 'var(--armargura-deep)', label: '--armargura-deep · #783C8C · borde fuerte' },
  { css: 'var(--armargura-bg)', label: '--armargura-bg · fondo denuncia', border: true },
] as const

const swatchWa = [
  { css: 'var(--wa)', label: '--wa · #3DDC97 · acento' },
  { css: 'var(--wa-text)', label: '--wa-text · #7DD4A0 · texto pill' },
] as const

const aficheRefItems = [
  {
    src: '/kit-assets/Rodada anapoimap.png',
    alt: 'Referencia flyer Anapoima',
    caption: 'Referencia Anapoima — RODADA brocha azul, INVITADOS/ANAPOIMA condensada inclinada, fecha en mancha blanca, banner deshilachado al pie.',
  },
  {
    src: '/kit-assets/_ref_cumple.png',
    alt: 'Referencia flyer cumpleaños',
    caption: 'Referencia cumpleaños — RODADA blanca + CUMPLEAÑOS azul (brocha seca), POR MI script, líneas finas partidas entre datos.',
  },
] as const

const brushDecoItems = [
  { icon: 'heart', label: 'Corazón · reacción' },
  { icon: 'fire', label: 'Fuego · calor', tone: 'cyan' as const },
  { icon: 'camera', label: 'Cámara · Incauta' },
  { icon: 'pin', label: 'Pin · ruta', tone: 'cyan' as const },
  { icon: 'helmet', label: 'Casco' },
  { icon: 'bike', label: 'Moto', tone: 'cyan' as const },
  { icon: 'glove', label: 'Guantes' },
  { icon: 'route', label: 'Ruta · km', tone: 'cyan' as const },
  { icon: 'flag', label: 'Meta · bandera' },
  { icon: 'bolt', label: 'Rayo · tip', tone: 'cyan' as const },
  { icon: 'spark', label: 'Chispa' },
  { icon: 'star', label: 'Estrella', tone: 'cyan' as const },
  { icon: 'check', label: 'Check · ok' },
  { icon: 'arrow', label: 'Flecha', tone: 'cyan' as const },
  { icon: 'chat', label: 'Chat · parche' },
  { icon: 'quote', label: 'Cita · voz', tone: 'cyan' as const },
  { icon: 'ticket', label: 'Ticket' },
  { icon: 'shield', label: 'Escudo · Paola', tone: 'cyan' as const },
  { icon: 'wrench', label: 'Oficio · servicio' },
  { icon: 'smile', label: 'Carita · mood', tone: 'cyan' as const },
  { icon: 'scribble', label: 'Garabato · brocha' },
  { icon: 'wave', label: 'Onda · sticker', tone: 'cyan' as const },
  { icon: 'link', label: 'Enlace · ancla' },
  { icon: 'copy', label: 'Copiar · memoria', tone: 'cyan' as const },
  { icon: 'share', label: 'Compartir · exportar' },
  { icon: 'eye', label: 'Vista · memoria', tone: 'cyan' as const },
] as const

const activityMiniItems = [
  { icon: '💬', title: 'Nuevo comentario', meta: 'Memoria Anapoima · placeholder' },
  { icon: '♥', title: 'Reacciones', meta: 'En memoria · sin notificar en exceso' },
  { icon: '📋', title: 'Denuncia publicada', meta: 'Tras moderación Paola' },
] as const

const segmentedMemOptions = [
  { value: 'rodadas', label: 'Rodadas' },
  { value: 'actividades', label: 'Actividades' },
] as const

const kitAllianceStripItems = ['Aliado', 'Aliado', 'Aliado', 'Próximamente'] as const

const bottomNavTabs = [
  { href: '#producto', icon: 'In', label: 'Inicio' },
  { href: '#producto', icon: 'Pc', label: 'Parchese', active: true },
  { href: '#producto', icon: 'Tv', label: 'Tu voz', badge: true },
  { href: '#producto', icon: 'Td', label: 'Tienda' },
  { href: '#producto', icon: 'Pa', label: 'Paola' },
] as const

const dataBlockDemoItems = [
  { label: 'Fecha', value: '21 JUL', icon: '📅' },
  { label: 'Hora', value: '6:00 AM', icon: '🕐' },
  { label: 'Punto', value: 'Por confirmar', icon: '📍' },
] as const

const notifDropdownItems = [
  { title: 'Rodada', meta: 'Fecha por confirmar', unread: true },
  { title: 'Pedido', meta: 'Placeholder' },
] as const

const userMenuLinks = [
  { label: 'Mis tickets', href: '#lab' },
  { label: 'Mis pedidos', href: '#lab' },
] as const

const iconTools = [
  { id: 'edit', label: 'Editar', icon: '✎' },
  { id: 'dup', label: 'Duplicar', icon: '⧉' },
  { id: 'del', label: 'Eliminar', icon: '🗑' },
] as const

const speedDialActions = [
  { label: 'WhatsApp', icon: 'W' },
  { label: 'Nuevo', icon: '+' },
] as const

const allyListItems = [
  { logo: 'Logo', title: 'Aliado placeholder', copy: 'Apoya rodadas · no es producto Paola' },
  { logo: '—', title: 'Aún armando apoyo', copy: 'Sin logos inventados' },
] as const

const rideFichaFields = [
  { label: 'Fecha', value: 'Por confirmar' },
  { label: 'Punto', value: 'Bogotá · TBD' },
  { label: 'Ruta (texto)', value: 'Bogotá → Anapoima → regreso' },
  { label: 'Cupo', value: '— / —' },
  { label: 'Qué llevar', value: 'Casco, SOAT, lluvia' },
  { label: 'Tipo', value: 'Rodada' },
] as const

const shopRulesHtml = '<strong>Reglas fijas Loigca:</strong><br/>Entrega gratis Bogotá y Soacha · fuera = aún no.<br/>Garantía solo defectos de fabricación.'

const serviceSteps = [
  'Escríbele a Paola por WhatsApp',
  'Entrega el casco en punto acordado',
  'Recoges listo · si quedó mal, se corrige',
] as const

const cityGateOptions = [
  { id: 'bogota', label: 'Bogotá · envío gratis' },
  { id: 'soacha', label: 'Soacha · envío gratis' },
  { id: 'otra', label: 'Otra ciudad · aún no', blocked: true, disabled: true },
] as const

const waOrderLines = [
  'Hola Paola, quiero pedir:',
  '· Bandana azul ×1',
  '· Entrega: Bogotá',
  '· Total: $ —',
] as const

const privacySections = [
  { title: 'Qué datos', copy: 'Nombre, WhatsApp, fotos de rodada/denuncia · placeholder legal.' },
  { title: 'Para qué', copy: 'Tickets, pedidos, moderación comunitaria.' },
] as const

const adminShellRows = [
  { id: 'outing', title: 'Salida Anapoima', meta: '12/20 · abierto' },
  { id: 'denuncia', title: 'Denuncia #—', meta: 'En cola' },
  { id: 'crud', title: 'Producto / tip / integrante', meta: 'CRUD placeholder' },
] as const

const chatThreads = [
  { id: '0', title: 'Parcero A', preview: 'Último mensaje…' },
  { id: '1', title: 'Grupo Anapoima', preview: 'Paola: lluvia…' },
] as const

const parcheseItems = [
  { time: 'Hoy', title: 'Memoria publicada', copy: 'Anapoima · Cámara Incauta' },
  { time: 'Ayer', title: 'Comentario destacado', copy: 'Elegido por Paola · no algoritmo' },
  { time: '—', title: 'Rodada anunciada', copy: 'Moto Loigca · cupo abierto' },
] as const

const auditItems = [
  'Inicio: Loigca dato · Incauta imagen · Armargura gancho',
  'Rodada anunciada: Loigca',
  'Memoria: Incauta + cierre Armargura si aplica',
  'Denuncia: Armargura + Incauta + Loigca opcional',
  'Tienda: Loigca precio/entrega/garantía · aliados fuera',
  '¿Podría ser Motoclub genérico? → rehacer',
] as const

const payOptions = [
  { id: 'wa', icon: 'W', title: 'WhatsApp con Paola', copy: 'Camino que no se apaga' },
  { id: 'gate', icon: '$', title: 'Pasarela', copy: 'Fase 20 · Wompi/MP placeholder' },
] as const

const authTabs = [
  { id: 'login', label: 'Entrar' },
  { id: 'register', label: 'Crear cuenta' },
] as const

const userPanelTabs = [
  { id: 'tickets', label: 'Mis tickets' },
  { id: 'orders', label: 'Mis pedidos' },
  { id: 'km', label: 'Km personal' },
  { id: 'data', label: 'Mis datos' },
] as const

const userPanelPanels = [
  { id: 'tickets', content: 'Ticket #0000 · Anapoima · confirmado placeholder' },
  { id: 'orders', content: 'Pedido #0000 · Bandana · WhatsApp pendiente' },
  { id: 'km', content: '' },
  { id: 'data', content: 'Nombre, WhatsApp · editar placeholder' },
] as const

const integrantesSlots = ['+', '·', '·', '·', '·', '·'] as const


onMounted(async () => {
  try {
    if (document.fonts?.ready) await document.fonts.ready
  } catch {
    /* seguir */
  }
  await nextTick()
  runKitHeroEntrance('hero')
  runKitHeroEntrance('hero-portal')
})
</script>

<template>
  <div class="html-kit-page">
<header class="top">
      <img src="/kit-assets/logo.png" alt="Paola — Rodando con propósito" />
      <p class="meta" style="margin:0">Kit de UI · no es el portal</p>
      <nav>
        <a href="#hero">Inicio</a>
        <a href="#hero-portal">Portal</a>
        <a href="#marca">Marca</a>
        <a href="#tipo">Tipo</a>
        <a href="#brocha">Brocha</a>
        <a href="#botones">Botones</a>
        <a href="#forms">Forms</a>
        <a href="#listas">Listas</a>
        <a href="#extras">Extras</a>
        <a href="#motion">Motion</a>
        <a href="#producto">Producto</a>
        <a href="#patrones">Más</a>
        <a href="#catalogo">Catálogo</a>
        <a href="#arsenal">Arsenal</a>
        <a href="#lab">Lab</a>
        <a href="#roadmap">Roadmap</a>
        <a href="#comunidad">Comunidad</a>
        <a href="#data">Datos</a>
        <a href="#nav">Nav</a>
        <a href="#feedback">Avisos</a>
      </nav>
    </header>

    <KitHero hero-id="hero" variant="classic" scroll-href="#hero-portal" scroll-label="Portal" />

    <KitHero hero-id="hero-portal" variant="portal" scroll-href="#marca" scroll-label="Bajar">
      <template #voices>
        <VoiceBadge voice="loigca" />
        <VoiceBadge voice="incauta" />
        <VoiceBadge voice="armargura" />
      </template>
      <template #panel>
        <KitHeroPanel />
      </template>
      <template #footer>
        <KitHeroFooter />
      </template>
    </KitHero>

    <main class="wrap">
      <p class="hint" style="margin-top:0">
        Plantilla para alinear componentes con <code>docs/visual.md</code>.
        Logo oficial: PNG del escudo. Arriba: dos heroes de referencia —
        <a href="#hero">clásico</a> y <a href="#hero-portal">portal con corte del día</a>.
      </p>

      <section id="marca">
        <h2 class="sec-title">Marca y color</h2>
        <p class="sm" style="color:var(--muted);margin:-8px 0 20px">
          Fuente única: <code>docs/visual.md</code> · variables <code>:root</code> en este kit ·
          <code>src/shared/theme/colors.ts</code> en Vue. Los nombres cortos (<code>--blue</code>) y
          <code>--paola-*</code> apuntan al mismo hex.
        </p>
        <div class="row" style="margin-bottom:24px">
          <img src="/kit-assets/logo.png" width="120" height="120" alt="Logo 120" />
          <img src="/kit-assets/logo.png" width="56" height="56" alt="Logo 56 header" />
          <img src="/kit-assets/logo.png" width="40" height="40" alt="Logo 40" />
        </div>

        <h3 class="kit">Fondos y superficies</h3>
        <ColorSwatchGrid :items="swatchFondos" />

        <h3 class="kit">Azul eléctrico (marca)</h3>
        <ColorSwatchGrid :items="swatchMarca" />

        <h3 class="kit">Semánticos (apoyo, no marca)</h3>
        <ColorSwatchGrid :items="swatchSemanticos" />

        <h3 class="kit">Tríada de voces (copy, no fuentes)</h3>
        <p class="meta" style="margin:-8px 0 12px">Loigca · Incauta · Armargura — badges <code>.voice-badge--*</code> · fase 18 denuncia usa <strong>Armargura</strong>.</p>
        <div class="row" style="gap:10px;margin-bottom:16px;flex-wrap:wrap">
          <VoiceBadge voice="loigca" />
          <VoiceBadge voice="incauta" />
          <VoiceBadge voice="armargura" />
        </div>
        <ColorSwatchGrid :items="swatchVoces" />

        <h3 class="kit">Canal WhatsApp (paralelo)</h3>
        <p class="meta" style="margin:-8px 0 12px">Verde solo para pills/enlaces WA · fase 25 · no sustituye el azul de marca.</p>
        <ColorSwatchGrid :items="swatchWa" />
      </section>

      <section id="tipo">
        <h2 class="sec-title">Tipografía</h2>
        <p class="display">Display Oswald 56</p>
        <p class="display speed">Display speed italic</p>
        <h1 class="kit">H1 Oswald 32 — próxima rodada</h1>
        <h2 class="kit">H2 Montserrat 22 — Así va el parche</h2>
        <h3 class="kit">H3 label 18 — punto de encuentro</h3>
        <p class="lead">Cuerpo 16. El parche rueda con cupo, memoria y oficio. Loigca explica; Incauta presencia; Armargura nombra.</p>
        <p class="sm">Cuerpo small 14 — entrega gratis solo Bogotá y Soacha.</p>
        <p class="meta">Ride · Respect · Enjoy</p>
        <p style="margin-top:16px">Enlace <a href="#tipo">ver memorias</a> en cian.</p>
        <p class="sm" style="margin-top:16px;color:var(--muted)">
          ↑ Capa UI (portal, formularios). La capa <strong>brocha</strong> va abajo: afiches, heroes, memorias.
        </p>
      </section>

      <section id="brocha">
        <h2 class="sec-title">Capa afiche — brocha</h2>
        <p class="sm" style="margin:-8px 0 16px;color:var(--muted)">
          Basado en los flyers reales. <strong>No reemplaza</strong> la capa UI (Oswald + Montserrat).
          Fuentes secundarias: Brush King (local, `type-brush-dry`), Rock Salt, Bebas Neue, Anton, Caveat, Sedgwick Ave.
        </p>

        <AficheRefs :items="aficheRefItems" />

        <AficheAnapoimaDemo />
        <AficheCumpleDemo />

        <h3 class="kit">Tipografías brocha (roles del flyer)</h3>
        <BrushTypeDemo />

        <h3 class="kit">Placa brochazo — fecha / banner</h3>
        <p class="sm" style="color:var(--muted);margin-bottom:16px">
          En el flyer la fecha va sobre un <strong>trazo horizontal grueso</strong> con bordes deshilachados, no un rectángulo.
        </p>
        <div class="row" style="margin-bottom:24px;align-items:center">
          <BrushSplash label="7 DE JUNIO" />
          <BrushSplash label="Domingo 5 Julio" tone="white" />
        </div>

        <h3 class="kit">Separadores de brocha seca</h3>
        <p class="lead">Texto arriba</p>
        <KitBrushDivider />
        <p class="lead">Texto abajo — banda gruesa (entre foto y datos)</p>
        <KitBrushDivider variant="thin" />
        <p class="lead">Trazo fino partido (entre bloques de info)</p>

        <h3 class="kit" style="margin-top:32px">Decorativos brocha (no emoji del sistema)</h3>
        <p class="sm" style="color:var(--muted);margin:-4px 0 16px">
          Biblioteca unificada: símbolos <code>#bd-*</code>, viewBox 32×32, trazo 2.5px, filtro <code>#paola-brush-edge-soft</code>.
          Usar <code>.brush-icon</code> — nunca emoji del sistema en afiches.
        </p>

        <BrushDecoSizes />

        <BrushDecoGrid :items="brushDecoItems" />

        <h3 class="kit" style="margin-top:32px">Mini afiche compuesto</h3>
        <AficheMiniDemo />
      </section>

      <section id="botones">
        <h2 class="sec-title">Botones</h2>
        <p class="sm" style="color:var(--muted);margin:-8px 0 16px">
          Jerarquía: <strong style="color:var(--white)">primario</strong> (UI) ·
          <strong style="color:var(--cyan)">primario hero</strong> (un pulso por vista) ·
          <strong style="color:var(--white)">brochazo</strong> (solo capa afiche, ver <a href="#brocha">Brocha</a>).
        </p>
        <div class="row">
          <Button>Apúntese pa rodar</Button>
          <Button variant="hero">Apúntese · hero</Button>
          <Button variant="ghost">Ver memorias</Button>
          <Button variant="dark">Únete</Button>
          <Button variant="danger">Rechazar denuncia</Button>
          <Button disabled>Disabled</Button>
        </div>
        <div class="row" style="margin-top:12px">
          <Button size="sm">Small · UI</Button>
          <Button variant="hero" size="sm">Small · hero</Button>
          <Button>Escribirle a Paola</Button>
          <Button variant="hero" size="lg">Large · hero</Button>
        </div>

        <h3 class="kit" style="margin-top:28px">Brochazo · capa afiche</h3>
        <p class="sm" style="color:var(--muted);margin:-4px 0 12px">
          Inclinado + pulso + borde cian que se vuelve trazo brocha al hover.
          Heroes del kit (<a href="#hero">clásico</a>, <a href="#hero-portal">portal</a>) y
          <a href="#brocha">mini afiche</a>. En UI de tickets/tienda: primario recto.
        </p>
        <div class="row">
          <BrushButton>Apúntese pa rodar</BrushButton>
          <BrushButton size="sm">Apúntese · sm</BrushButton>
          <BrushButton href="#brocha">Como enlace</BrushButton>
        </div>
        <div class="row" style="margin-top:16px">
          <Chip>Abierto</Chip>
          <Chip tone="lleno">Lleno</Chip>
          <Chip tone="realizado">Realizado</Chip>
          <Chip tone="zona-ok">Cupo ok</Chip>
        </div>

        <h3 class="kit" style="margin-top:28px">Iconos de acción · compartir</h3>
        <p class="sm" style="color:var(--muted);margin:-4px 0 12px">
          <code>.icon-btn</code> 40×40 · brocha <code>#bd-copy</code>, <code>#bd-link</code>, <code>#bd-share</code> ·
          WhatsApp mantiene trazo propio (<code>.icon-btn--wa</code>). Sin texto en la fila — solo <code>aria-label</code>.
        </p>
        <ShareRowInput style="max-width:480px;margin-bottom:8px" />
      </section>

      <section>
        <h2 class="sec-title">Cards y cajas</h2>
        <div class="grid grid-2">
          <Card>
            <h3 class="kit">Card base</h3>
            <p class="sm">Superficie #0B1018, borde line, radio 10px.</p>
          </Card>
          <Card variant="hot">
            <h3 class="kit">Próxima salida</h3>
            <p class="sm">Borde azul eléctrico para destacar.</p>
            <Button variant="hero" size="sm">Apúntese</Button>
          </Card>
          <Card variant="double">
            <h3 class="kit">Doble borde</h3>
            <p class="sm">Como el escudo: navy + cian.</p>
          </Card>
          <HeroFake />
        </div>
      </section>

      <section id="forms">
        <h2 class="sec-title">Formularios</h2>
        <div class="grid grid-2">
          <Field label="Nombre">
            <Input v-model="nombre" placeholder="Cómo te dicen en el parche" />
          </Field>
          <Field label="WhatsApp">
            <Input v-model="wa" type="tel" placeholder="300 000 0000" />
          </Field>
          <Field label="Ciudad">
            <Select v-model="ciudad" :options="ciudadOptions" />
          </Field>
          <Field label="Moto">
            <Input v-model="moto" placeholder="Opcional" />
          </Field>
          <Field label="Ejemplo disabled">
            <Input model-value="" placeholder="No editable" disabled />
          </Field>
          <Field label="Nota" style="grid-column: 1 / -1">
            <Textarea v-model="nota" placeholder="Qué pasó, dónde, cuándo" />
          </Field>
          <Field label="Archivo / evidencia" hint="Foto o PDF para constancia · máx. 5 MB" style="grid-column: 1 / -1">
            <FilePicker />
          </Field>
        </div>
        <div class="stack" style="margin-top:16px;gap:14px">
          <Choice v-model="fotosOk" label="Acepto salir en la memoria (fotos)" />
          <Choice v-model="privacidad" label="Leí el aviso de privacidad" />
          <Choice
            :model-value="tipoSalida === 'rodada'"
            kind="radio"
            name="tipo"
            label="Rodada"
            @update:model-value="tipoSalida = 'rodada'"
          />
          <Choice
            :model-value="tipoSalida === 'actividad'"
            kind="radio"
            name="tipo"
            label="Actividad"
            @update:model-value="tipoSalida = 'actividad'"
          />
          <Choice v-model="avisos" kind="switch" label="Notificaciones" />
        </div>
      </section>

      <section id="listas">
        <h2 class="sec-title">Listas y checklist</h2>
        <p class="sm" style="color:var(--muted);margin:-8px 0 20px">
          Variantes para formularios, panel y configuración. Misma casilla/radio que en <a href="#forms">Formularios</a>.
        </p>
        <div class="grid grid-2" style="margin-bottom:24px">
          <div class="card">
            <h3 class="kit">Lista simple</h3>
            <ListBlock :items="listSimpleItems" />
            <ListBlock :items="listOrderedItems" ordered />
          </div>
          <div class="card">
            <h3 class="kit">Checklist compacta</h3>
            <KitChecklist :items="kitChecklistItems" />
          </div>
        </div>

        <div class="grid grid-2">
          <div class="card">
            <h3 class="kit">Lista con radio — una opción</h3>
            <p class="sm" style="color:var(--muted);margin:0 0 12px">Tipo de salida, método de pago, etc.</p>
            <ChoiceList kind="radio" name="tipo-salida" :items="choiceRadioItems" />
          </div>
          <div class="card">
            <h3 class="kit">Lista con checks — varias opciones</h3>
            <p class="sm" style="color:var(--muted);margin:0 0 12px">Equipamiento, permisos de memoria, etc.</p>
            <ChoiceList kind="checkbox" :items="choiceCheckItems" />
          </div>
          <div class="card">
            <h3 class="kit">Lista de acciones</h3>
            <p class="sm" style="color:var(--muted);margin:0 0 12px">Panel, cuenta, enlaces internos.</p>
            <ActionList bare :items="actionListDemoItems" />
          </div>
          <div class="card">
            <h3 class="kit">Lista con avatar</h3>
            <p class="sm" style="color:var(--muted);margin:0 0 12px">Integrantes, pedidos, moderación.</p>
            <MediaList :items="mediaListItems" />
          </div>
        </div>
      </section>

      <section id="data">
        <h2 class="sec-title">Bloques de dato (afiche)</h2>
        <div class="grid grid-3">
          <DataBlock v-for="item in dataBlockDemoItems" :key="item.label" :label="item.label" :value="item.value" :icon="item.icon" />
        </div>
      </section>

      <section>
        <h2 class="sec-title">Tabla</h2>
        <KitTable :columns="kitTableColumns" :rows="kitTableRows" />
      </section>

      <section id="nav">
        <h2 class="sec-title">Navegación: tabs, drop, accordion, crumbs, pager</h2>
        <Crumbs
          :items="[
            { label: 'Kit', href: '#marca' },
            { label: 'Parchese' },
            { label: 'Apúntese' },
          ]"
        />
        <Tabs v-model="navTab" :tabs="navTabs" style="margin: 16px 0 0" />
        <TabPanel :show="navTab === 't1'">Calendario de rodadas y actividades.</TabPanel>
        <TabPanel :show="navTab === 't2'">Km, fotos, participantes.</TabPanel>
        <TabPanel :show="navTab === 't3'">Quienes apoyan el parche.</TabPanel>

        <div class="row" style="margin:20px 0">
          <DropMenu :items="dropMenuItems" />
        </div>

        <div class="stack">
          <Accordion title="¿Qué incluye el ticket?" default-open>
            <p class="sm" style="margin:0">Cupo en la rodada. No es un concierto.</p>
          </Accordion>
          <Accordion title="Garantía">
            <p class="sm" style="margin:0">Solo defectos de fabricación.</p>
          </Accordion>
        </div>

        <Pager v-model="pagerPage" :pages="3" style="margin-top:16px" />
      </section>

      <section id="feedback">
        <h2 class="sec-title">Avisos, toasts, progreso, modal</h2>
        <h3 class="kit">Notificaciones en pantalla (toast)</h3>
        <p class="sm" style="color:var(--muted);margin:0 0 12px">
          Esquina superior derecha · auto-cierran a los 5 s · no bloquean la UI.
        </p>
        <div class="row" style="margin-bottom:24px">
          <Button variant="ghost" size="sm" data-toast="info">Info</Button>
          <Button size="sm" data-toast="ok">Éxito</Button>
          <Button variant="danger" size="sm" data-toast="bad">Error</Button>
          <Button variant="dark" size="sm" data-toast="warn">Aviso</Button>
        </div>

        <h3 class="kit">Alertas en página (inline)</h3>
        <div class="stack" style="margin-bottom:24px">
          <Alert>Esto no sustituye una denuncia ante autoridad.</Alert>
          <Alert tone="ok">Ticket reservado. Paola ya tiene tu WhatsApp.</Alert>
          <Alert tone="bad">Cupo lleno. Únete al WhatsApp para la próxima.</Alert>
        </div>

        <BannerInline
          style="margin-bottom:24px"
          copy="Comparendos: educación + enlace oficial. Paola no tramita ni representa."
        />

        <p class="meta" style="margin:0 0 8px">Cupo 12 / 20</p>
        <ProgressBar style="margin-bottom:24px" />

        <div class="row" style="margin-top:0">
          <Avatar initial="P" />
          <Button @click="modalOpen = true">Abrir modal</Button>
        </div>
        <KitQuote style="margin-top:20px">
          Si una pantalla podría ser cualquier motoclub, está mal.
        </KitQuote>
      </section>

      <section id="extras">
        <h2 class="sec-title">Extras útiles</h2>
        <div class="grid grid-2">
          <Card>
            <h3 class="kit">Empty state</h3>
            <Empty title="Sin rodadas aún" copy="Próximamente Paola anuncia la siguiente salida." glyph="◎" cta-label="Próximamente" compact />
          </Card>
          <Card>
            <h3 class="kit">Skeleton (carga)</h3>
            <Skeleton kind="card" />
            <Skeleton width="w60" />
            <Skeleton width="w40" />
          </Card>
          <Card style="grid-column:1/-1">
            <h3 class="kit">Pasos — flujo ticket / pedido</h3>
            <Steps
              :current="1"
              :steps="[
                { title: 'Paso 1', copy: 'Apúntese' },
                { title: 'Paso 2', copy: 'WhatsApp a Paola' },
                { title: 'Paso 3', copy: 'Cupo confirmado' },
              ]"
            />
          </Card>
          <Card>
            <h3 class="kit">Filtros (pills)</h3>
            <p class="sm" style="color:var(--muted);margin:0 0 12px">Tienda, memorias, categorías.</p>
            <FilterPills v-model="filterShelf" :pills="shelfPills" />
          </Card>
          <Card>
            <h3 class="kit">Búsqueda + error de campo</h3>
            <Search v-model="searchShop" placeholder="Buscar en tienda…" />
            <Field label="WhatsApp" error="Escribe un número válido de Colombia.">
              <Input v-model="waError" type="tel" invalid />
            </Field>
          </Card>
        </div>
      </section>

      <section id="motion">
        <h2 class="sec-title">Motion · GSAP + AutoAnimate</h2>
        <p class="sm" style="color:var(--muted);margin:-8px 0 24px">
          Misma stack que Vue (<code>gsap</code>, <code>@formkit/auto-animate</code>). Tokens en
          <code>src/shared/motion/tokens.ts</code>. CSS sigue en 180–220&nbsp;ms; GSAP para entradas y listas.
          <strong style="color:var(--cyan)">Rastro de llanta</strong> en todo el kit (fondo ~1&nbsp;s · sobre cards/botones ~0.4&nbsp;s · anclado al scroll) —
          <code>initPaolaCursorSmoke()</code> · off con <code>prefers-reduced-motion</code> o touch.
        </p>

        <MotionKitSection />

        <KitQuote style="margin-top:24px">
          <strong>Vuetify</strong> conserva modales y sheets. <strong>GSAP</strong> marca entradas y scroll.
          <strong>Lottie</strong> reservado para mascota 360 cuando haya asset.
        </KitQuote>
      </section>

      <section id="producto">
        <h2 class="sec-title">Componentes de producto</h2>
        <p class="sm" style="color:var(--muted);margin:-8px 0 24px">
          Piezas del portal real: Parchese, Tienda, Tu voz, tickets y navegación móvil.
        </p>

        <div class="grid grid-2" style="margin-bottom:24px">
          <RideCard
            title="Rodada Anapoima"
            meta="Domingo · punto por confirmar"
            featured
            cta-label="Apúntese pa rodar"
            :taken="12"
            :capacity="20"
          />
          <ProductCard title="Buff bandana azul" price="$ —" note="precio por definir" media-label="Foto producto" shelf="Paola" />
          <ProductCard title="Marca aliada · aparte" price="$ —" collab cta-label="Ver detalle" />
          <Card>
            <h3 class="kit">Cantidad + precio</h3>
            <p class="price" style="margin:0 0 12px">$ —</p>
            <QtyStepper v-model="qty" />
            <p class="field-hint" style="margin-top:10px">Entrega gratis Bogotá y Soacha</p>
          </Card>
        </div>

        <div class="grid grid-2" style="margin-bottom:24px">
          <Card>
            <h3 class="kit">Memoria — stats</h3>
            <StatGrid :items="[{ value: '84', label: 'Km' }, { value: '36', label: 'Fotos' }, { value: '18', label: 'En ruta' }]" />
          </Card>
          <Card>
            <h3 class="kit">Segmented + tooltip</h3>
            <Segmented
              id="segmentedMem"
              v-model="segmentedMem"
              :options="segmentedMemOptions"
              style="margin-bottom:16px"
            />
            <TooltipWrap tip="Constancia comunitaria, no penal">
              <Button variant="ghost" size="sm">¿Qué es Tu voz?</Button>
            </TooltipWrap>
          </Card>
        </div>

        <div class="grid grid-2" style="margin-bottom:24px">
          <Card>
            <h3 class="kit">Denuncia / Tu voz</h3>
            <DenunciaCard title="Hueco en calzada · Kennedy" meta="Enviada hace 2 días · sin datos personales" />
          </Card>
          <Card>
            <h3 class="kit">Timeline — estado ticket</h3>
            <Timeline
              :steps="[
                { title: 'Apunte recibido', meta: 'Formulario enviado', state: 'done' },
                { title: 'WhatsApp a Paola', meta: 'Confirma cupo y pago', state: 'active' },
                { title: 'Ticket a tu nombre', meta: 'Cuando Paola confirme' },
              ]"
            />
          </Card>
        </div>

        <WaStrip title="Pago y cupo" copy="Escríbele a Paola por WhatsApp. La pasarela viene después; este camino no se apaga." style="margin-bottom:24px">
          <Button size="sm">Escribirle a Paola</Button>
        </WaStrip>

        <h3 class="kit">Franja alianzas + galería memoria</h3>
        <KitAllianceStrip :items="kitAllianceStripItems" style="margin-bottom:16px" />
        <Gallery />

        <h3 class="kit" style="margin-top:32px">Nav móvil (5 pestañas) + barra de acción</h3>
        <div class="grid grid-2" style="margin-top:16px">
          <BottomNavDemo :tabs="bottomNavTabs" />
          <div class="stack">
            <ActionBar>
              <template #info><strong>1 ticket</strong> · Anapoima</template>
              <Button size="sm">Confirmar</Button>
            </ActionBar>
            <LoadingRow copy="Cargando memorias…" />
            <MemberRowCard initial="N" name="Nezko" meta="Integrante · moto por confirmar" />
          </div>
        </div>
      </section>

      <section id="patrones">
        <h2 class="sec-title">Más patrones</h2>
        <p class="sm" style="color:var(--muted);margin:-8px 0 24px">
          Ticket digital, legal, pedido, mapa estático, shell del portal y mobile.
        </p>

        <div class="grid grid-2" style="margin-bottom:24px">
          <TicketCard
            title="Anapoima"
            ticket-id="Ticket #0000"
            :rows="[{ label: 'Nombre', value: 'Por confirmar' }, { label: 'Estado', value: 'Reservado' }]"
            meta="Válido cuando Paola confirme por WhatsApp."
          />
          <Comparendo />
        </div>

        <div class="grid grid-2" style="margin-bottom:24px">
          <div>
            <h3 class="kit">Resumen de pedido</h3>
            <OrderSummary
              :lines="[{ label: 'Buff bandana × 1', value: '$ —' }, { label: 'Envío Bogotá / Soacha', value: 'Gratis' }]"
              total="$ —"
            />
            <div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap">
              <ZoneBadge zone="bogota" />
              <ZoneBadge zone="soacha" />
              <ZoneBadge zone="fuera" />
            </div>
          </div>
          <Card>
            <h3 class="kit">Denuncia — contador + preview foto</h3>
            <Field label="Descripción">
              <Textarea v-model="denuncia" placeholder="Qué pasó, dónde, cuándo…" />
            </Field>
            <p class="field-hint">{{ denuncia.length }} / 280</p>
          </Card>
        </div>

        <div class="grid grid-2" style="margin-bottom:24px">
          <div>
            <h3 class="kit">Mapa estático — punto de encuentro</h3>
            <p class="sm" style="color:var(--muted);margin:0 0 10px">Sin GPS en vivo. Solo pin + enlace externo.</p>
            <MapBlock meeting-point="Punto por confirmar" />
          </div>
          <div>
            <h3 class="kit">Compartir memoria</h3>
            <p class="sm" style="color:var(--muted);margin:0 0 10px">Copiar · WhatsApp · enlace ancla.</p>
            <ShareRow url="https://paolabiker.com/memoria/…" />
            <MemoriaHero title="Anapoima 2026" meta="84 km · 36 fotos · Ride · Respect · Enjoy" />
          </div>
        </div>

        <RibbonCard style="max-width:360px;margin-bottom:24px">
          <RideCard title="Salida destacada" meta="Ribbon en esquina" hide-cta />
        </RibbonCard>

        <h3 class="kit">Shell desktop + barra atrás móvil</h3>
        <ShellNav v-model="shellTab" :tabs="shellTabs" style="margin-bottom:16px" />
        <BackBar title="Apúntese" />

        <SortToolbar v-model:sort-model="sortBy" :sort-options="sortOptions" style="margin-bottom:24px" />

        <div class="grid grid-2" style="margin-bottom:24px">
          <Banner tone="offline">Sin conexión — algunos datos pueden estar desactualizados.</Banner>
          <Banner tone="consent">
            <p>Cookies mínimas para que el sitio funcione. Sin publicidad ni venta de datos.</p>
            <Button size="sm">Entendido</Button>
          </Banner>
        </div>

        <AccountTeaser style="margin-bottom:24px" />

        <PagerText style="margin-bottom:24px" />

        <Button variant="dark" size="sm" @click="sheetOpen = true">Abrir sheet (móvil)</Button>
      </section>

      <section id="catalogo">
        <h2 class="sec-title">Catálogo extendido</h2>
        <p class="sm" style="color:var(--muted);margin:-8px 0 28px">
          Más piezas para Inicio, Parchese, Tienda, Tu voz, panel y mobile. Placeholders honestos donde falte contenido real.
        </p>

        <h3 class="kit">Inicio y marca</h3>
        <NoticeBar kicker="Nuevo" text="Próxima rodada — fecha por confirmar · cupo limitado" />
        <KpiStrip
          :items="[
            { value: '—', label: 'Km parche' },
            { value: '—', label: 'Rodadas' },
            { value: '—', label: 'Fotos' },
            { value: '—', label: 'Integrantes' },
          ]"
        />
        <HeroSplit
          kicker="Inicio hero"
          title="El parche rueda con propósito"
          copy="Memoria, cupo y oficio. Sin postureo corporativo."
          style="margin-bottom:24px"
        >
          <Button variant="hero" size="sm">Ver próxima salida</Button>
        </HeroSplit>
        <div class="grid grid-3" style="margin-bottom:32px">
          <Feature icon="K" title="Km medidos" copy="Memoria del parche, no solo afiche" />
          <Feature icon="V" title="Tu voz" copy="Constancia comunitaria en la vía" />
          <Feature icon="T" title="Tienda" copy="Producto propio, reglas claras" />
        </div>

        <h3 class="kit">Parchese — agenda y cupo</h3>
        <div class="grid grid-2" style="margin-bottom:24px">
          <div class="stack" style="gap:10px">
            <RideListItem day="21" month="Jul" title="Anapoima" meta="Domingo · 12 / 20 cupo">
              <Chip>Abierto</Chip>
            </RideListItem>
            <RideListItem day="—" month="TBD" title="Próxima por anunciar" meta="Únete al WhatsApp">
              <BadgeLiveOff />
            </RideListItem>
          </div>
          <Card>
            <p class="meta" style="margin:0 0 12px">Calendario + hora + cupo ring</p>
            <CalendarMini month="Julio 2026" :cells="calendarCells" style="margin-bottom:16px" />
            <TimeChips v-model="rideTime" :chips="timeChipOptions" />
            <div style="display:flex;align-items:center;gap:16px;margin-top:16px">
              <RingProgress :pct="60" label="12" title="12 de 20" />
              <div>
                <p class="meta" style="margin:0">Cupo</p>
                <p style="margin:4px 0 0;font-size:14px">12 / 20 · <AvatarStack :initials="['A', 'B', 'C']" more="+9" /></p>
              </div>
            </div>
          </Card>
        </div>
        <h3 class="kit">Tienda y servicios</h3>
        <ShelfHeader title="Paola" href="#catalogo" />
        <ProductRow title="Bandana azul" meta="Marca Paola · talla única" price="$ —" style="margin-bottom:20px" />
        <ShelfHeader title="Colaboraciones" collab note="Estantería aparte" />
        <div class="grid grid-2" style="margin-bottom:32px">
          <ServiceCard title="Lavado de casco" copy="Servicio Paola en Bogotá / Soacha. Si quedó mal, se corrige.">
            <Button variant="ghost" size="sm">Escribirle a Paola</Button>
          </ServiceCard>
          <AllianceCard copy="Apoya el parche · no es marca Paola" />
        </div>

        <h3 class="kit">Tu voz — moderación y denuncias</h3>
        <div class="grid grid-2" style="margin-bottom:24px">
          <div>
            <Pipeline :steps="pipelineDemo" style="margin-bottom:12px" />
            <ModBar>
              <Button size="sm">Aprobar</Button>
              <Button variant="ghost" size="sm">Pedir edición</Button>
              <Button variant="danger" size="sm">Rechazar</Button>
            </ModBar>
            <p class="field-hint" style="margin-top:10px">Solo Paola · constancia comunitaria</p>
          </div>
          <NotifyList :items="notifyDemo" />
        </div>

        <h3 class="kit">Formularios avanzados</h3>
        <div class="grid grid-2" style="margin-bottom:24px">
          <Card>
            <Dropzone />
            <PasswordField v-model="passDemo" label="Contraseña (cuenta futura)" id="pass-demo" style="margin-top:16px" />
            <p class="meta" style="margin:16px 0 8px">Código verificación</p>
            <OtpRow v-model="otpCode" />
          </Card>
          <Card>
            <p class="meta" style="margin:0 0 8px">Tags moto / búsqueda</p>
            <TagCloud :tags="shopTags" @remove="removeTag" />
            <DividerOr style="margin:20px 0" />
            <div class="row">
              <IconBtn name="share" label="Compartir" />
              <IconBtn name="heart" label="Favorito" />
              <BtnGroup>
                <Button variant="dark" size="sm">Lista</Button>
                <Button variant="dark" size="sm">Grid</Button>
              </BtnGroup>
            </div>
            <PopoverWrap style="margin-top:16px">
              <template #trigger>
                <Button variant="ghost" size="sm">¿Garantía?</Button>
              </template>
              Solo defectos de fabricación. Servicio de cascos: si quedó mal, se corrige.
            </PopoverWrap>
          </Card>
        </div>

        <h3 class="kit">Memorias, media y layout</h3>
        <div class="grid grid-2" style="margin-bottom:24px">
          <Carousel
            v-model="carouselSlide"
            :slides="['Rodada Anapoima', 'Cumpleaños en ruta', 'Memoria colectiva']"
          />
          <VideoBlock copy="Video Incauta · próximamente" />
        </div>
        <div class="grid grid-2" style="margin-bottom:24px">
          <Testimonial
            quote="Rodamos con respeto y memoria. Esto no es un motoclub genérico."
            who="Paola · operadora"
            initial="P"
          />
          <SuccessPanel title="Apunte enviado" copy="Paola te escribe por WhatsApp para confirmar cupo.">
            <Button variant="ghost" size="sm">Ver mis tickets</Button>
          </SuccessPanel>
        </div>

        <SidebarLayout
          current="Resumen"
          :items="sidebarItems"
          kicker="Panel cuenta (futuro)"
          copy="Cuando haya ticket, pedido o denuncia a tu nombre."
          style="margin-bottom:24px"
        />

        <ActionList title="Preferencias" :items="prefItems" style="margin-bottom:24px" />

        <div class="grid grid-2" style="margin-bottom:24px">
          <MobileRowCard
            title="Anapoima"
            :rows="['Fecha: 21 Jul', 'Cupo: 12/20', 'Hora: 6:00 a.m.', 'Estado: Activo']"
          >
            <template #chip>
              <Chip>Abierto</Chip>
            </template>
            <Button variant="hero" size="sm">Apúntese</Button>
          </MobileRowCard>
          <div class="stack" style="gap:12px">
            <Callout title="Tip Loigca" copy="Revisa casco y luces antes de salir. Cupo no es transferible." />
            <Callout tone="warn" title="Entrega" copy="Fuera de Bogotá y Soacha: aún no hay envío nacional." />
            <div>
              <p class="meta" style="margin:0 0 8px">¿Cómo estuvo la rodada?</p>
              <RatingRow v-model="rating" />
            </div>
          </div>
        </div>
      </section>

      <section id="arsenal">
        <h2 class="section-title">Arsenal · tercera tanda</h2>
        <p class="lead">Más piezas listas para rodadas, tienda, legal, feedback y utilidades — sin inventar datos reales.</p>

        <h3 class="subsection-title">Rodada y parche</h3>
        <div class="arsenal-grid arsenal-grid--3">
          <ArsenalBlock>
            <h4>Cuenta regresiva</h4>
            <Countdown
              :units="[
                { value: '—', label: 'Días' },
                { value: '—', label: 'Horas' },
                { value: '—', label: 'Min' },
              ]"
              note="Fecha por confirmar"
            />
          </ArsenalBlock>
          <ArsenalBlock>
            <h4>Ruta estática</h4>
            <RouteCard
              title="Anapoima"
              meta="Salida Bogotá · regreso mismo día"
              :stats="['~ km por confirmar', 'Paradas TBD']"
            />
          </ArsenalBlock>
          <ArsenalBlock>
            <h4>Clima en ruta</h4>
            <WeatherPill />
            <p class="sm" style="margin-top:10px;color:var(--muted)">Tip Moto Loigca: capa de lluvia siempre.</p>
          </ArsenalBlock>
        </div>

        <div class="arsenal-grid arsenal-grid--2">
          <ArsenalBlock>
            <h4>Checklist de salida</h4>
            <CheckList
              :items="[
                { label: 'Casco y guantes', done: true },
                { label: 'Documentos moto y SOAT', done: true },
                { label: 'Combustible · revisar antes' },
                { label: 'Kit lluvia' },
              ]"
            />
          </ArsenalBlock>
          <ArsenalBlock>
            <h4>Zonas de entrega tienda</h4>
            <DeliveryZones
              :rows="[
                { zone: 'Bogotá y Soacha', value: 'Gratis', ok: true },
                { zone: 'Resto del país', value: 'Aún no' },
              ]"
            />
          </ArsenalBlock>
        </div>

        <div class="arsenal-grid arsenal-grid--2">
          <ArsenalBlock>
            <h4>Quién va (placeholder)</h4>
            <AvatarStack :initials="['P']" more="+12" />
            <p class="meta" style="margin-top:10px">Lista completa con ticket · próximamente</p>
          </ArsenalBlock>
          <ArsenalBlock>
            <h4>Ranking km parche</h4>
            <Leaderboard
              :rows="[
                { rank: '1', name: '—', km: '—' },
                { rank: '2', name: '—', km: '—' },
                { rank: '—', name: 'Tú', km: '—', me: true },
              ]"
            />
          </ArsenalBlock>
        </div>

        <ArsenalBlock style="margin-bottom:28px">
          <h4>Insignias del parche</h4>
          <BadgeGrid
            :items="[
              { icon: '1ª', label: 'Primera rodada' },
              { icon: '📷', label: 'Cámara' },
              { icon: '?', label: 'Próxima', locked: true },
              { icon: '?', label: 'Membresía', locked: true },
            ]"
          />
        </ArsenalBlock>

        <h3 class="subsection-title">Tienda y pedido</h3>
        <div class="arsenal-grid arsenal-grid--2">
          <ArsenalBlock>
            <h4>Mini carrito</h4>
            <CartPanel :lines="cartLines" total="$ —">
              <Button style="width:100%">Escribirle a Paola</Button>
            </CartPanel>
          </ArsenalBlock>
          <ArsenalBlock>
            <h4>Checkout vertical</h4>
            <CheckoutSteps :steps="checkoutDemo" />
          </ArsenalBlock>
        </div>

        <div class="arsenal-grid arsenal-grid--3">
          <ArsenalBlock>
            <h4>Tallas</h4>
            <SizePicker v-model="sizePick" :sizes="sizeOptions" />
          </ArsenalBlock>
          <ArsenalBlock>
            <h4>Color</h4>
            <SwatchPicker
              v-model="colorPick"
              :colors="[
                { id: 'blue', label: 'Azul' },
                { id: 'black', label: 'Negro' },
                { id: 'white', label: 'Blanco' },
              ]"
            />
          </ArsenalBlock>
          <ArsenalBlock>
            <h4>Código descuento</h4>
            <DiscountRow v-model="discountCode" />
          </ArsenalBlock>
        </div>

        <ArsenalBlock style="margin-bottom:20px">
          <h4>Confianza tienda</h4>
          <TrustStrip :items="trustItems" />
        </ArsenalBlock>

        <div class="arsenal-grid arsenal-grid--2">
          <ArsenalBlock>
            <h4>Recibo / factura</h4>
            <Receipt meta="Pedido #0000 · placeholder" :lines="receiptLines" />
          </ArsenalBlock>
          <ArsenalBlock>
            <h4>Comparar productos</h4>
            <CompareTable :headers="compareHeaders" :rows="compareRows" />
            <SpecTable
              style="margin-top:16px"
              :rows="[
                { label: 'Material', value: 'Por confirmar' },
                { label: 'Talla', value: 'Única' },
              ]"
            />
          </ArsenalBlock>
        </div>

        <h3 class="subsection-title">Media y memoria</h3>
        <div class="arsenal-grid arsenal-grid--2">
          <ArsenalBlock>
            <h4>Antes / después (casco)</h4>
            <BeforeAfter before="Antes" after="Después · servicio Paola" />
          </ArsenalBlock>
          <ArsenalBlock>
            <h4>Galería lightbox</h4>
            <LightboxGrid :items="['Rodada', 'Parche', '360', 'Ruta', 'Grupo', '+']" />
          </ArsenalBlock>
        </div>

        <div class="arsenal-grid arsenal-grid--2">
          <ArsenalBlock>
            <h4>Video memoria</h4>
            <VideoThumb />
          </ArsenalBlock>
          <ArsenalBlock>
            <h4>Nota de voz</h4>
            <AudioPlayer note="Tu voz · relatos Paola Armargura" />
          </ArsenalBlock>
        </div>

        <div class="arsenal-grid arsenal-grid--2">
          <ArsenalBlock>
            <h4>Encuesta rápida</h4>
            <Poll question="¿Próxima rodada?" :options="pollOptions" />
          </ArsenalBlock>
          <ArsenalBlock>
            <h4>Reacciones (sin emoji sistema)</h4>
            <EngageBar :likes="12" :there="8" :fire="5" />
          </ArsenalBlock>
        </div>

        <h3 class="subsection-title">Layout y navegación</h3>
        <div class="arsenal-grid arsenal-grid--2">
          <ArsenalBlock>
            <h4>Tabs verticales</h4>
            <VerticalTabs v-model="vTab" :tabs="vTabItems" />
          </ArsenalBlock>
          <ArsenalBlock>
            <h4>Acordeón cards</h4>
            <div class="stack" style="gap:8px">
              <CollapseCard title="Garantía producto" default-open>
                Solo defectos de fabricación. Servicio cascos: si quedó mal, se corrige.
              </CollapseCard>
              <CollapseCard title="Comparendos">
                Educación + enlace oficial. No trámites ni formularios que parezcan autoridad.
              </CollapseCard>
              <CollapseCard title="Denuncias">
                Constancia comunitaria, moderación. No linchamiento, no menores, no doxxing.
              </CollapseCard>
            </div>
          </ArsenalBlock>
        </div>

        <ArsenalBlock style="margin-bottom:20px">
          <h4>Miga de pan</h4>
          <Crumbs
            :items="[
              { label: 'Inicio', href: '#arsenal' },
              { label: 'Tienda', href: '#arsenal' },
              { label: 'Bandana azul' },
            ]"
          />
        </ArsenalBlock>

        <div class="arsenal-grid arsenal-grid--2">
          <ArsenalBlock>
            <h4>Árbol categorías tienda</h4>
            <TreeNav :items="treeNavItems" />
          </ArsenalBlock>
          <ArsenalBlock>
            <h4>Índice de página</h4>
            <SectionIndex
              :items="[
                { label: 'Descripción', href: '#arsenal' },
                { label: 'Especificaciones', href: '#arsenal' },
                { label: 'Garantía', href: '#arsenal' },
                { label: 'Entrega', href: '#arsenal' },
              ]"
            />
          </ArsenalBlock>
        </div>

        <ArsenalBlock style="margin-bottom:20px">
          <h4>Footer extendido</h4>
          <MegaFooter :columns="megaCols" />
        </ArsenalBlock>

        <div class="arsenal-grid arsenal-grid--2">
          <ArsenalBlock>
            <h4>CTA dual</h4>
            <DualCta>
              <Button variant="hero">Apúntese</Button>
              <Button variant="ghost">WhatsApp</Button>
            </DualCta>
          </ArsenalBlock>
          <ArsenalBlock>
            <h4>Barra sticky (demo)</h4>
            <StickyCta copy="12 / 20 cupo">
              <Button variant="hero" size="sm">Rodar</Button>
            </StickyCta>
          </ArsenalBlock>
        </div>

        <h3 class="subsection-title">Legal, confianza y contacto</h3>
        <div class="arsenal-grid arsenal-grid--2">
          <ArsenalBlock>
            <h4>TOC legal</h4>
            <LegalToc
              :items="[
                { label: 'Términos de uso', href: '#feedback' },
                { label: 'Privacidad', href: '#feedback' },
                { label: 'Comparendos · disclaimer', href: '#feedback' },
                { label: 'Denuncias comunitarias', href: '#feedback' },
              ]"
            />
          </ArsenalBlock>
          <ArsenalBlock>
            <h4>Disclaimers</h4>
            <DisclaimerBox style="margin-bottom:10px">
              Comparendos: información educativa. Enlace a fuente oficial — no somos autoridad de tránsito.
            </DisclaimerBox>
            <DisclaimerBox tone="info">
              Denuncias: constancia comunitaria moderada, no denuncia penal.
            </DisclaimerBox>
          </ArsenalBlock>
        </div>

        <div class="arsenal-grid arsenal-grid--2">
          <ArsenalBlock>
            <h4>Preferencias cookies</h4>
            <CookiePrefs>
              <Choice v-model="cookieAnalytics" kind="switch" label="Analítica" />
              <Choice v-model="cookiePrefs" kind="switch" label="Preferencias" />
            </CookiePrefs>
            <p class="meta" style="margin:10px 0 0">Necesarias siempre activas · mismas casillas que <a href="#forms">Formularios</a> · legal fase 15</p>
          </ArsenalBlock>
          <ArsenalBlock>
            <h4>Changelog</h4>
            <Changelog
              :items="[
                { time: '—', text: 'Kit UI · arsenal ampliado' },
                { time: '—', text: 'Fase 0 · shell cinco pestañas' },
              ]"
            />
          </ArsenalBlock>
        </div>

        <ArsenalBlock style="margin-bottom:20px">
          <h4>FAQ en columnas</h4>
          <FaqList :items="faqItems" />
        </ArsenalBlock>

        <div class="arsenal-grid arsenal-grid--2">
          <ArsenalBlock>
            <h4>Contacto Paola</h4>
            <ContactCard
              :items="[
                { icon: 'W', label: 'WhatsApp · próximamente' },
                { icon: '@', label: 'Correo · próximamente' },
              ]"
            />
          </ArsenalBlock>
          <ArsenalBlock>
            <h4>Franja emergencia ruta</h4>
            <EmergencyStrip
              title="Seguridad en ruta"
              copy="Números oficiales y protocolo del parche · por publicar. No sustituye servicios de emergencia."
            />
          </ArsenalBlock>
        </div>

        <h3 class="subsection-title">Feedback y datos</h3>
        <div class="arsenal-grid arsenal-grid--2">
          <ArsenalBlock>
            <h4>NPS 0–10</h4>
            <NpsScale v-model="npsScore" />
          </ArsenalBlock>
          <ArsenalBlock>
            <h4>¿Te sirvió?</h4>
            <ThumbsRow v-model="thumbsPick" />
          </ArsenalBlock>
        </div>

        <div class="arsenal-grid arsenal-grid--2">
          <ArsenalBlock>
            <h4>Actividad km (heatmap)</h4>
            <Heatmap :cells="heatmapCells" />
          </ArsenalBlock>
          <ArsenalBlock>
            <h4>Sparkline km</h4>
            <SparkBars :heights="sparkHeights" />
            <MultiProgress :rows="multiProgressRows" style="margin-top:16px" />
          </ArsenalBlock>
        </div>

        <ArsenalBlock style="margin-bottom:20px">
          <h4>Tabla expandible</h4>
          <ExpandTable :rows="expandTableRows" />
        </ArsenalBlock>

        <h3 class="subsection-title">Tickets, utilidades y PWA</h3>
        <div class="arsenal-grid arsenal-grid--3">
          <ArsenalBlock>
            <h4>QR grande</h4>
            <QrBlock title="Ticket rodada" meta="#0000 · Anapoima" />
          </ArsenalBlock>
          <ArsenalBlock>
            <h4>Wallet pass</h4>
            <WalletPass title="Anapoima" meta="Domingo · cupo confirmado" />
          </ArsenalBlock>
          <ArsenalBlock>
            <h4>Ticket impresión</h4>
            <PrintTicket title="Paola Biker" outing="Anapoima · —" />
          </ArsenalBlock>
        </div>

        <div class="arsenal-grid arsenal-grid--2">
          <ArsenalBlock>
            <h4>Copiar código</h4>
            <CodeCopy code="PAOLA-RODADA-0000" />
          </ArsenalBlock>
          <ArsenalBlock>
            <h4>Estado servicios</h4>
            <StatusList
              :items="[
                { label: 'Portal · operativo', tone: 'ok' },
                { label: 'Tickets · próximo', tone: 'ok' },
                { label: 'Pasarela · fase 20', tone: 'warn' },
              ]"
            />
          </ArsenalBlock>
        </div>

        <div class="arsenal-grid arsenal-grid--2">
          <ArsenalBlock>
            <h4>Horario atención</h4>
            <HoursTable
              :rows="[
                { day: 'Lun – Vie', hours: 'Por confirmar' },
                { day: 'Sáb – Dom', hours: 'Rodadas / eventos' },
              ]"
            />
          </ArsenalBlock>
          <ArsenalBlock>
            <h4>Membresía teaser</h4>
            <MembershipTeaser title="Membresía parche" copy="Beneficios y precio · próximamente (fase 21)">
              <Button variant="ghost" disabled>Avisarme</Button>
            </MembershipTeaser>
          </ArsenalBlock>
        </div>

        <div class="arsenal-grid arsenal-grid--2">
          <ArsenalBlock>
            <h4>Burbuja WhatsApp</h4>
            <WaBubble
              body="¡Hola parcero! Para el ticket escríbeme por aquí con tu nombre y talla de casco."
              meta="Paola · placeholder"
            />
          </ArsenalBlock>
          <ArsenalBlock>
            <h4>Tablón avisos</h4>
            <PinBoard
              :notes="[
                'Punto de salida por confirmar — revisar grupo.',
                'Lluvia: rodada se reprograma con aviso.',
              ]"
            />
          </ArsenalBlock>
        </div>

        <div class="arsenal-grid arsenal-grid--2" style="margin-bottom:20px">
          <ArsenalBlock>
            <h4>Instalar app (PWA)</h4>
            <PwaBanner title="Paola en tu pantalla" copy="Acceso rápido a rodadas y tienda">
              <Button style="height:40px;padding:0 14px">Instalar</Button>
            </PwaBanner>
          </ArsenalBlock>
          <ArsenalBlock>
            <h4>Newsletter</h4>
            <Newsletter v-model="newsletterEmail" />
          </ArsenalBlock>
        </div>

        <ArsenalBlock>
          <h4>Command palette</h4>
          <p class="meta" style="margin:0 0 10px">Búsqueda rápida · Ctrl+K en portal real</p>
          <Button variant="ghost" @click="cmdOpen = true">Abrir paleta</Button>
        </ArsenalBlock>
      </section>

      <section id="lab">
        <LabHero
          title="Lab · cuarta tanda"
          copy="Perfil, tienda avanzada, rodada, Tu voz, contenido y micro-interacciones."
        />

        <h3 class="subsection-title">Perfil y cuenta</h3>
        <div class="arsenal-grid arsenal-grid--2">
          <ArsenalBlock>
            <h4>Encabezado perfil</h4>
            <ProfileHead name="Parcero" meta="Km parche · — · placeholder" initial="P" />
          </ArsenalBlock>
          <ArsenalBlock>
            <h4>Ajustes</h4>
            <ToggleList :items="settingRows" @toggle="toggleSetting" />
          </ArsenalBlock>
        </div>

        <div class="arsenal-grid arsenal-grid--3">
          <ArsenalBlock>
            <h4>Avatar upload</h4>
            <AvatarUpload />
          </ArsenalBlock>
          <ArsenalBlock>
            <h4>Sin login aún</h4>
            <LoginStrip copy="Cuenta cuando tengas ticket, pedido o denuncia.">
              <Button variant="ghost" style="height:36px">Entrar</Button>
            </LoginStrip>
          </ArsenalBlock>
          <ArsenalBlock>
            <h4>Onboarding</h4>
            <OnboardSteps :current="onboardStep" :steps="['Parche', 'Perfil', 'Listo']" />
            <Button style="width:100%;margin-top:12px;height:40px" @click="onboardStep = Math.min(2, onboardStep + 1)">Siguiente</Button>
          </ArsenalBlock>
        </div>

        <h3 class="subsection-title">Tienda avanzada</h3>
        <div class="arsenal-grid arsenal-grid--2">
          <ArsenalBlock>
            <h4>Galería producto</h4>
            <ProdGallery v-model="prodView" :views="['Vista 1', 'Vista 2', 'Detalle']" />
            <div style="display:flex;gap:10px;margin-top:12px;align-items:center">
              <WishBtn v-model="wishOn" />
              <Button style="flex:1">Escribirle a Paola</Button>
            </div>
          </ArsenalBlock>
          <ArsenalBlock>
            <h4>Toolbar catálogo</h4>
            <CatalogToolbar v-model="catalogView" />
            <TagCloud :tags="['Paola', 'Accesorios']" />
            <ModeCards v-model="deliveryMode" :options="deliveryModeOptions" style="margin-top:12px" />
          </ArsenalBlock>
        </div>

        <ShelfDivider label="Marca Paola" />
        <ShelfDivider label="Estantería collab · aparte" collab />

        <div class="arsenal-grid arsenal-grid--2">
          <ArsenalBlock>
            <h4>Tarifas membresía (placeholder)</h4>
            <PricingGrid :plans="membershipPlans" />
          </ArsenalBlock>
          <ArsenalBlock>
            <h4>Dirección guardada</h4>
            <AddressCard badge="Default" title="Casa · placeholder" meta="Bogotá · barrio por confirmar" />
          </ArsenalBlock>
        </div>

        <h3 class="subsection-title">Rodada avanzada</h3>
        <AnnounceBar title="Próxima rodada" copy="Anapoima · fecha TBD" style="margin-bottom:20px">
          <Button variant="hero" size="sm">Apúntese</Button>
        </AnnounceBar>

        <div class="arsenal-grid arsenal-grid--2">
          <ArsenalBlock>
            <h4>Itinerario horizontal</h4>
            <Itinerary :stops="itineraryStops" />
          </ArsenalBlock>
          <ArsenalBlock>
            <h4>Cupo donut</h4>
            <DonutCupo footnote="Sin GPS en vivo" />
          </ArsenalBlock>
        </div>

        <div class="arsenal-grid arsenal-grid--2">
          <ArsenalBlock>
            <h4>Paradas con hora</h4>
            <StopList :stops="stopTimes" />
          </ArsenalBlock>
          <ArsenalBlock>
            <h4>Puntos estáticos</h4>
            <PinList
              :items="[
                { title: 'Salida Bogotá', meta: 'Coordenadas en grupo WhatsApp' },
                { title: 'Destino', meta: 'Anapoima · mapa estático' },
              ]"
            />
          </ArsenalBlock>
        </div>

        <div class="arsenal-grid arsenal-grid--3">
          <ArsenalBlock>
            <h4>Formación en ruta</h4>
            <Formation :rows="formationRows" note="Líder adelante · placeholder educativo" />
          </ArsenalBlock>
          <ArsenalBlock>
            <h4>Equipo obligatorio</h4>
            <GearGrid :items="gearItems" />
          </ArsenalBlock>
          <ArsenalBlock>
            <h4>Únete WhatsApp</h4>
            <WaHero title="El parche vive en WhatsApp" copy="Únete = escribir · no sustituye el panel">
              <Button disabled>Link próximamente</Button>
            </WaHero>
          </ArsenalBlock>
        </div>

        <h3 class="subsection-title">Tu voz y moderación</h3>
        <div class="arsenal-grid arsenal-grid--2">
          <ArsenalBlock>
            <h4>Comparendos · educación</h4>
            <EduCard
              copy="Información orientativa sobre infracciones. No somos autoridad de tránsito ni tramitamos comparendos."
              official-href="#feedback"
              official-label="→ Fuente oficial (placeholder)"
            />
          </ArsenalBlock>
          <ArsenalBlock>
            <h4>Denuncia en revisión</h4>
            <DenunciaCard title="Constancia #0000" meta="contenido resumido placeholder. No denuncia penal." status="Moderación" compact />
          </ArsenalBlock>
        </div>

        <div class="arsenal-grid arsenal-grid--2">
          <ArsenalBlock>
            <h4>Motivo de reporte</h4>
            <ReasonChips v-model="reportReason" :reasons="reportReasons" />
          </ArsenalBlock>
          <ArsenalBlock>
            <h4>Cola moderación</h4>
            <ModItem chip="Nuevo" title="Reporte #—" meta="Denuncia comunitaria">
              <Button variant="ghost" style="height:32px;padding:0 10px">Ver</Button>
              <Button style="height:32px;padding:0 10px">OK</Button>
            </ModItem>
          </ArsenalBlock>
        </div>

        <ArsenalBlock style="margin-bottom:20px">
          <h4>Normas comunitarias</h4>
          <GuidelinesList :items="guidelineItems" />
        </ArsenalBlock>

        <ArsenalBlock style="margin-bottom:28px">
          <h4>Relato · Paola Armargura</h4>
          <VoiceCard voice="armargura">
            Rodar no es escapar: es encontrarte con gente que entiende por qué el casco pesa menos que el silencio de la carretera.
            <template #byline>
              Paola · placeholder · <VoiceBadge voice="armargura" style="margin-left:4px" />
            </template>
          </VoiceCard>
        </ArsenalBlock>

        <h3 class="subsection-title">Contenido y media</h3>
        <div class="arsenal-grid arsenal-grid--3">
          <ArsenalBlock>
            <h4>Blog / memoria</h4>
            <BlogCard
              read-time="— min lectura"
              voice="Cámara Incauta"
              title="Primera rodada del parche"
              copy="Memoria colectiva · placeholder"
            />
          </ArsenalBlock>
          <ArsenalBlock>
            <h4>Testimonio</h4>
            <QuoteBlock
              quote="Paola no vende motos: vende pertenencia con casco puesto."
              cite="— Parcero · placeholder"
            />
          </ArsenalBlock>
          <ArsenalBlock>
            <h4>Relacionados</h4>
            <ScrollStrip :items="scrollStripItems" />
          </ArsenalBlock>
        </div>

        <div class="arsenal-grid arsenal-grid--2">
          <ArsenalBlock>
            <h4>Embed video</h4>
            <EmbedBlock copy="Video / YouTube · placeholder" />
          </ArsenalBlock>
          <ArsenalBlock>
            <h4>Vista 360 · Cámara Incauta</h4>
            <Viewer360 copy="Arrastrar para rotar · placeholder" />
            <PhotoMeta :items="['ISO —', 'f/—', 'Rodada —', 'Paola Biker']" />
          </ArsenalBlock>
        </div>

        <ArsenalBlock style="margin-bottom:28px">
          <h4>Mascota · globo</h4>
          <MascotBubble text="¡Ey parcero! Revisa el casco antes de salir — tip del parche." />
        </ArsenalBlock>

        <h3 class="subsection-title">Formularios y reservas</h3>
        <div class="arsenal-grid arsenal-grid--3">
          <ArsenalBlock>
            <h4>Rango precio</h4>
            <RangeField v-model="priceRange" />
          </ArsenalBlock>
          <ArsenalBlock>
            <h4>Contraseña</h4>
            <PwdMeterField v-model="pwdKit" />
          </ArsenalBlock>
          <ArsenalBlock>
            <h4>Slots servicio casco</h4>
            <SlotGrid v-model="helmetSlot" :slots="helmetSlots" />
          </ArsenalBlock>
        </div>

        <ArsenalBlock style="margin-bottom:28px">
          <h4>Calendario mini</h4>
          <CalMiniPicker />
        </ArsenalBlock>

        <h3 class="subsection-title">Nav, acciones y estados</h3>
        <div class="arsenal-grid arsenal-grid--2">
          <ArsenalBlock>
            <h4>Notificaciones</h4>
            <NotifDropdown :items="notifDropdownItems" />
          </ArsenalBlock>
          <ArsenalBlock>
            <h4>Menú usuario</h4>
            <UserMenuDropdown :links="userMenuLinks" />
          </ArsenalBlock>
        </div>

        <div class="arsenal-grid arsenal-grid--2">
          <ArsenalBlock>
            <h4>Compartir memoria</h4>
            <p class="meta" style="margin:0 0 10px"><code>#bd-copy</code> · WA · <code>#bd-link</code> ancla</p>
            <ShareIconRow />
          </ArsenalBlock>
          <ArsenalBlock>
            <h4>Split button</h4>
            <SplitButton>Apúntese</SplitButton>
          </ArsenalBlock>
        </div>

        <div class="arsenal-grid arsenal-grid--3">
          <ArsenalBlock>
            <h4>Toolbar iconos</h4>
            <IconToolbar v-model="iconTool" :tools="iconTools" />
          </ArsenalBlock>
          <ArsenalBlock>
            <h4>Speed dial</h4>
            <SpeedDial :actions="speedDialActions" />
          </ArsenalBlock>
          <ArsenalBlock>
            <h4>Tooltip</h4>
            <TipBox tip="Garantía solo defectos de fabricación">
              <Button variant="ghost" style="height:36px">?</Button>
            </TipBox>
          </ArsenalBlock>
        </div>

        <div class="arsenal-grid arsenal-grid--2">
          <ArsenalBlock>
            <h4>Confirmación destructiva</h4>
            <ConfirmBox title="¿Cancelar ticket?" copy="El cupo se libera. Paola debe confirmar por WhatsApp.">
              <Button variant="ghost">Volver</Button>
              <Button style="background:var(--danger)">Sí, cancelar</Button>
            </ConfirmBox>
          </ArsenalBlock>
          <ArsenalBlock>
            <h4>Undo bar</h4>
            <UndoBar message="Producto quitado del carrito" :visible="undoVisible">
              <Button variant="ghost" style="height:32px">Deshacer</Button>
            </UndoBar>
            <Button variant="ghost" style="margin-top:12px" @click="undoVisible = !undoVisible">Simular quitar</Button>
          </ArsenalBlock>
        </div>

        <ArsenalBlock style="margin-bottom:20px">
          <h4>Paginación</h4>
          <PageNav v-model="kitPage" :pages="3" />
        </ArsenalBlock>

        <h3 class="subsection-title">Estados vacíos y sistema</h3>
        <div class="arsenal-grid arsenal-grid--2">
          <ArsenalBlock>
            <h4>404 mini</h4>
            <EmptyBlock glyph="404" copy="Esta ruta no existe · volver al parche" />
          </ArsenalBlock>
          <ArsenalBlock>
            <h4>Sin resultados</h4>
            <EmptyBlock glyph="∅" copy="No hay productos con esos filtros" />
          </ArsenalBlock>
        </div>

        <div class="arsenal-grid arsenal-grid--2">
          <ArsenalBlock>
            <h4>Offline</h4>
            <OfflineStrip copy="Sin conexión · revisa tu red y vuelve a intentar" />
          </ArsenalBlock>
          <ArsenalBlock>
            <h4>Mantenimiento</h4>
            <MaintCard title="Volvemos pronto" copy="Actualizando tickets · placeholder" />
          </ArsenalBlock>
        </div>

        <div class="arsenal-grid arsenal-grid--2">
          <ArsenalBlock>
            <h4>Próximamente</h4>
            <SoonHero title="PASARELA" copy="Fase 20 · WhatsApp sigue primero" />
          </ArsenalBlock>
          <ArsenalBlock>
            <h4>Ribbon esquina</h4>
            <CornerRibbon title="Producto nuevo" copy="Estantería Paola" />
          </ArsenalBlock>
        </div>

        <h3 class="subsection-title">Alianzas, comunidad y datos</h3>
        <div class="arsenal-grid arsenal-grid--3">
          <ArsenalBlock>
            <h4>Tarjeta alianza</h4>
            <AllyTile title="Marca aliada" copy="Visual aparte · no mezclar con Paola" />
          </ArsenalBlock>
          <ArsenalBlock>
            <h4>Integrantes (placeholder)</h4>
            <IntegrantesRow :slots="integrantesSlots" note="Lista real · por definir" />
          </ArsenalBlock>
          <ArsenalBlock>
            <h4>Stat grande</h4>
            <StatBig value="—" trend="↑ —%" label="Km parche · mes" />
          </ArsenalBlock>
        </div>

        <div class="arsenal-grid arsenal-grid--2">
          <ArsenalBlock>
            <h4>Features grid</h4>
            <FeatureIcons :items="featureIconItems" />
          </ArsenalBlock>
          <ArsenalBlock>
            <h4>Subida archivos</h4>
            <UploadQueue :files="uploadFiles" />
            <BatchBar count="2 seleccionados" :visible="batchVisible">
              <Button variant="ghost" style="height:32px;color:#fff">Eliminar</Button>
            </BatchBar>
            <Button variant="ghost" style="margin-top:10px;height:36px" @click="batchVisible = !batchVisible">Mostrar batch bar</Button>
          </ArsenalBlock>
        </div>
      </section>

      <section id="roadmap">
        <LabHero
          title="Roadmap · cobertura 100%"
          copy="Piezas que faltaban según docs/roadmap.md — layouts por fase, sin inventar datos reales."
        />

        <h3 class="subsection-title">Fases 0–2 · Cascarón y nav</h3>
        <ArsenalBlock style="margin-bottom:20px">
          <PhaseLabel>Fase 0–2</PhaseLabel>
          <h4>Layout portal (5 pestañas + franja alianzas)</h4>
          <RoadmapLayout
            aside-title="Alianzas"
            aside-copy="Franja global · mismo set que Parchese · sin CTA tienda"
            main-copy="Área principal · Vue Router hueco"
          >
            <template #nav>
              <ShellNav v-model="shellTab" :tabs="shellTabs" style="margin-bottom:12px;border:none;padding:0" />
            </template>
          </RoadmapLayout>
        </ArsenalBlock>

        <div class="arsenal-grid arsenal-grid--2">
          <ArsenalBlock>
            <PhaseLabel>Fase 1 · 27</PhaseLabel>
            <h4>Voces tríada</h4>
            <p style="margin:0 0 10px;font-size:13px">
              <VoiceBadge voice="loigca" />
              <VoiceBadge voice="incauta" />
              <VoiceBadge voice="armargura" />
            </p>
            <PaperFrame voice="loigca" voice-label="Loigca">
              <p style="margin:8px 0 0;font-size:13px">Marco tipo recorte Paper Mario · portal oscuro.</p>
            </PaperFrame>
          </ArsenalBlock>
          <ArsenalBlock>
            <PhaseLabel>Fase 26</PhaseLabel>
            <h4>Accesibilidad + preview share</h4>
            <SkipLinkDemo href="#roadmap" style="margin-bottom:12px" />
            <OgPreview
              title="Paola Biker · Rodando con propósito"
              desc="Próxima rodada · WhatsApp · placeholder OG"
            />
          </ArsenalBlock>
        </div>

        <h3 class="subsection-title">Fases 3 · Pestaña Paola</h3>
        <ArsenalBlock style="margin-bottom:20px">
          <PhaseLabel>Fase 3</PhaseLabel>
          <h4>Página Paola — bloques obligatorios</h4>
          <PaolaPageDemo />
        </ArsenalBlock>

        <h3 class="subsection-title">Fases 4–5 · Únete, alianzas, integrantes</h3>
        <div class="arsenal-grid arsenal-grid--2">
          <ArsenalBlock>
            <PhaseLabel>Fase 4</PhaseLabel>
            <h4>Únete (Parchese)</h4>
            <UneteBlock title="Únete al parche" copy="WhatsApp · link real cuando exista">
              <Button disabled>Escribir al grupo</Button>
            </UneteBlock>
          </ArsenalBlock>
          <ArsenalBlock>
            <PhaseLabel>Fase 4</PhaseLabel>
            <h4>Lista alianzas</h4>
            <AllyList :items="allyListItems" />
          </ArsenalBlock>
        </div>

        <ArsenalBlock style="margin-bottom:28px">
          <PhaseLabel>Fase 5</PhaseLabel>
          <h4>Ficha integrante (consentimiento)</h4>
          <IntegranteCard
            avatar="A"
            alias="Alias placeholder"
            meta="Moto opcional · Instagram si lo dio · sin inventar"
            consent="Autorizó salir en público"
          />
        </ArsenalBlock>

        <h3 class="subsection-title">Fases 6–11 · Agenda, rodadas, tickets, memorias, inicio</h3>
        <ArsenalBlock style="margin-bottom:20px">
          <PhaseLabel>Fase 6</PhaseLabel>
          <h4>Agenda (sin cupos aún)</h4>
          <AgendaRow day="—" month="Jul" title="Anapoima" kind-label="Rodada" point="Punto TBD" when-label="Próxima" />
          <AgendaRow day="—" month="Jun" title="Lavado grupal cascos" kind-label="Actividad" when-label="Pasada" past kind-tone="realizado" when-tone="realizado" />
        </ArsenalBlock>

        <ArsenalBlock style="margin-bottom:20px">
          <PhaseLabel>Fase 8</PhaseLabel>
          <h4>Salida · estados y ficha</h4>
          <RideStates>
            <Chip>Abierto</Chip>
            <Chip tone="lleno">Lleno</Chip>
            <Chip tone="realizado">Cerrado</Chip>
            <Chip tone="zona-ok">Realizado</Chip>
            <Chip>Gratis</Chip>
            <Chip>De pago · $ —</Chip>
          </RideStates>
          <RideFicha voice="loigca" voice-label="Loigca anuncia" title="Rodada Anapoima" :fields="rideFichaFields" />
        </ArsenalBlock>

        <div class="arsenal-grid arsenal-grid--2">
          <ArsenalBlock>
            <PhaseLabel>Fase 9</PhaseLabel>
            <h4>Apúntese pa rodar</h4>
            <ApuntarseBox>
              <ApuntarseFormDemo />
            </ApuntarseBox>
          </ArsenalBlock>
          <ArsenalBlock>
            <PhaseLabel>Fase 9</PhaseLabel>
            <h4>Cupo lleno (bloqueado)</h4>
            <ApuntarseBox blocked copy="Únete al WhatsApp para la próxima · sin overbooking" />
            <p class="meta" style="margin-top:12px">Paola recibe aviso · ticket a tu nombre en fase 19</p>
          </ArsenalBlock>
        </div>

        <ArsenalBlock style="margin-bottom:20px">
          <PhaseLabel>Fase 10</PhaseLabel>
          <h4>Memoria de salida</h4>
          <MemoryLayout km="—">
            <template #main>
              <MemoryGalleryDemo />
            </template>
            <template #participants>
              <ParticipantRow avatar="P" alias="Alias" vehicle="Moto —" />
              <ParticipantRow avatar="+" alias="Con permiso" instagram="@instagram si lo dieron" instagram-href="#" />
            </template>
          </MemoryLayout>
        </ArsenalBlock>

        <ArsenalBlock style="margin-bottom:28px">
          <PhaseLabel>Fase 7 · 11</PhaseLabel>
          <h4>Inicio · tablero del parche</h4>
          <HomeDash>
            <template #hero>
              <h4>Próxima rodada</h4>
              <p style="margin:0 0 10px">Anapoima · TBD</p>
              <Button variant="hero" size="sm">Apúntese / Parchese</Button>
            </template>
            <template #km>
              <h4>Km parche</h4>
              <strong style="font-family:var(--display);font-size:28px;color:var(--cyan)">—</strong>
            </template>
            <template #memory>
              <h4>Destello memoria</h4>
              <p class="meta" style="margin:0">Última salida · foto placeholder</p>
            </template>
            <template #voice>
              <h4>Tu voz</h4>
              <p class="meta" style="margin:0">Tip Loigca · si no hay, no se fuerza</p>
            </template>
            <template #paola>
              <h4>Paola</h4>
              <p class="meta" style="margin:0"><a href="#roadmap">Quién es y cómo escribirle →</a></p>
            </template>
          </HomeDash>
          <MascotEmpty title="Sin próxima salida" copy="Estado vacío fase 11 · Únete al WhatsApp" style="margin-top:16px">
            <Button variant="ghost">Únete</Button>
          </MascotEmpty>
        </ArsenalBlock>

        <h3 class="subsection-title">Fases 12–14 · Tienda y pedido</h3>
        <ArsenalBlock style="margin-bottom:20px">
          <PhaseLabel>Fase 12</PhaseLabel>
          <h4>Ficha producto · dos estanterías</h4>
          <ShopFicha
            shelf="Marca Paola"
            title="Bandana azul"
            price="$ —"
            price-note="o preguntar"
            description="Descripción placeholder."
            :rules="shopRulesHtml"
          >
            <Button style="width:100%;margin-top:12px">Escribirle a Paola</Button>
          </ShopFicha>
        </ArsenalBlock>

        <div class="arsenal-grid arsenal-grid--2">
          <ArsenalBlock>
            <PhaseLabel>Fase 13</PhaseLabel>
            <h4>Lavado de casco (servicio)</h4>
            <ServiceFicha
              title="Limpieza de casco"
              copy="Qué incluye · tiempo · placeholder"
              :steps="serviceSteps"
              note="<strong>Garantía servicio</strong> distinta a producto."
            />
          </ArsenalBlock>
          <ArsenalBlock>
            <PhaseLabel>Fase 14</PhaseLabel>
            <h4>Pedido WhatsApp + ciudad</h4>
            <CityGate v-model="cityGate" :options="cityGateOptions" />
            <WaOrder :lines="waOrderLines" footer="PaymentPort · adapter WhatsApp" style="margin-top:12px" />
          </ArsenalBlock>
        </div>

        <h3 class="subsection-title">Fases 15–18 · Legal y Tu voz</h3>
        <div class="arsenal-grid arsenal-grid--2">
          <ArsenalBlock>
            <PhaseLabel>Fase 15</PhaseLabel>
            <h4>Privacidad (extracto)</h4>
            <PrivacyDoc :sections="privacySections" check-label="Leí el aviso de privacidad" />
          </ArsenalBlock>
          <ArsenalBlock>
            <PhaseLabel>Fase 16</PhaseLabel>
            <h4>Tips educación vial</h4>
            <TipLink voice="loigca" label="Luces encendidas de día · norma placeholder" href="#roadmap" />
            <TipLink voice="loigca" label="Distancia de seguimiento en lluvia" href="#roadmap" />
          </ArsenalBlock>
        </div>

        <div class="arsenal-grid arsenal-grid--2">
          <ArsenalBlock>
            <PhaseLabel>Fase 17</PhaseLabel>
            <h4>Comparendo · guía</h4>
            <ComparendoGuide
              voice="loigca"
              title="Exceso de velocidad en moto"
              copy="Qué significa · qué revisar · placeholder educativo."
              official-href="#feedback"
              disclaimer="Disclaimer fijo: no asesoría jurídica · no tramitamos."
            />
          </ArsenalBlock>
          <ArsenalBlock>
            <PhaseLabel>Fase 18</PhaseLabel>
            <h4>Denuncia comunitaria</h4>
            <DenunciaForm />
          </ArsenalBlock>
        </div>

        <ArsenalBlock style="margin-bottom:28px">
          <PhaseLabel>Fase 18 · 24</PhaseLabel>
          <h4>Moderación (una operadora)</h4>
          <ModActions>
            <Button size="sm">Publicar</Button>
            <Button variant="ghost" size="sm">Ocultar</Button>
            <Button variant="danger" size="sm">Rechazar</Button>
          </ModActions>
          <p class="meta" style="margin:12px 0 0">Criterio: linchamiento, menores, venganza = no se publica.</p>
        </ArsenalBlock>

        <h3 class="subsection-title">Fases 19–22 · Cuenta, pasarela, membresía, eventos</h3>
        <div class="arsenal-grid arsenal-grid--2">
          <ArsenalBlock>
            <PhaseLabel>Fase 19</PhaseLabel>
            <h4>Login / registro</h4>
            <AuthPanel :tabs="authTabs" footnote="Sitio browsable sin login · cuenta para ticket/pedido/denuncia.">
              <AuthLoginDemo />
            </AuthPanel>
          </ArsenalBlock>
          <ArsenalBlock>
            <PhaseLabel>Fase 19</PhaseLabel>
            <h4>Panel usuario</h4>
            <UserPanel :tabs="userPanelTabs" :panels="userPanelPanels">
              <template #tickets><strong>Ticket #0000</strong> · Anapoima · confirmado placeholder</template>
              <template #orders><strong>Pedido #0000</strong> · Bandana · WhatsApp pendiente</template>
              <template #km>
                <Choice v-model="kmMine" label="Mostrar mis km en el parche (opcional)" />
              </template>
              <template #data>Nombre, WhatsApp · editar placeholder</template>
            </UserPanel>
          </ArsenalBlock>
        </div>

        <div class="arsenal-grid arsenal-grid--2">
          <ArsenalBlock>
            <PhaseLabel>Fase 20</PhaseLabel>
            <h4>Método de pago</h4>
            <PayPicker v-model="payMethod" :options="payOptions" secure-note="No guardamos tarjetas · confidencialidad" />
          </ArsenalBlock>
          <ArsenalBlock>
            <PhaseLabel>Fase 21 · 22</PhaseLabel>
            <h4>Membresía + evento de pago</h4>
            <p class="meta" style="margin:0 0 10px">Fase 21 bloqueada hasta precio/beneficios · integrante visible ≠ membresía paga.</p>
            <RideFicha :fields="[]" style="padding:14px">
              <Chip>De pago · $ —</Chip>
              <strong style="display:block;margin:8px 0">Rodada con ticket pago</strong>
              <p class="meta" style="margin:0">Cobro WhatsApp y/o pasarela · fase 22</p>
            </RideFicha>
            <NoPopupBanner copy="Publicidad = alianzas en franja · cero popups · cero venta de datos" style="margin-top:12px" />
          </ArsenalBlock>
        </div>

        <h3 class="subsection-title">Fases 23–24 · Mapa y admin</h3>
        <div class="arsenal-grid arsenal-grid--2">
          <ArsenalBlock>
            <PhaseLabel>Fase 23</PhaseLabel>
            <h4>Mapa ruta (estático)</h4>
            <MapStatic />
            <p class="meta" style="margin-top:8px">Punto de encuentro claro · placeholder</p>
          </ArsenalBlock>
          <ArsenalBlock>
            <PhaseLabel>Fase 24</PhaseLabel>
            <h4>Admin Paola (privado)</h4>
            <AdminShell bar="Panel operadora · una sola persona" :rows="adminShellRows">
              <template #outing>
                <Button variant="ghost" size="sm">Editar</Button>
                <Button size="sm">Marcar realizado</Button>
              </template>
              <template #denuncia>
                <Button size="sm">Publicar</Button>
                <Button variant="danger" size="sm">Rechazar</Button>
              </template>
              <template #crud>
                <Button variant="ghost" size="sm">+ Nuevo</Button>
              </template>
            </AdminShell>
          </ArsenalBlock>
        </div>

        <ArsenalBlock style="margin-bottom:20px">
          <PhaseLabel>Comunidad 25–35</PhaseLabel>
          <h4>Mapa social · ver <code>docs/roadmap.md</code></h4>
          <PhaseRoadmap :items="phaseSocialMap" />
        </ArsenalBlock>

        <ArsenalBlock>
          <PhaseLabel>Fase 27</PhaseLabel>
          <h4>Auditoría de voces · checklist</h4>
          <AuditList :items="auditItems" />
        </ArsenalBlock>
      </section>

      <section id="comunidad">
        <LabHero
          title="Comunidad · comentarios y reacciones"
          copy="Comunidad MVP (28–31) · social+ (32–35) · red social web (36–44). WhatsApp canal paralelo."
        />

        <CommunityScope>
          <strong>Decisión Paola:</strong> la web será <strong>red social del parche</strong> (fases 36–44). <strong>WhatsApp sigue</strong> — canal caliente y alternativa; comunidades enlazadas en ambos (fase 25, 37).
        </CommunityScope>

        <h3 class="subsection-title">Fase 25 · Dos canales</h3>
        <ArsenalBlock style="margin-bottom:24px">
          <DualChannel>
            <template #wa>
              <p class="meta" style="margin:8px 0">Únete, rodada urgente, soporte pedido, calor del parche.</p>
              <Button variant="ghost" size="sm" disabled>Grupo · próx.</Button>
            </template>
            <template #web>
              <p class="meta" style="margin:8px 0">Memoria, tickets, comunidades, feed, chat persistente.</p>
              <Button size="sm">Mis comunidades</Button>
            </template>
          </DualChannel>
        </ArsenalBlock>

        <h3 class="subsection-title">Engagement en memoria</h3>
        <ArsenalBlock style="margin-bottom:24px">
          <VoiceBadge voice="incauta" />
          <h4 style="margin:12px 0 8px;font-family:var(--display)">Primera rodada · memoria</h4>
          <p class="meta" style="margin:0 0 12px">84 km · 36 fotos · placeholder</p>
          <EngageBar :likes="12" :there="8" :fire="5" comments-label="6 comentarios · sin conteo invasivo" />
          <ShareRow url="https://…/memoria/…#comentarios" whatsapp anchor />
        </ArsenalBlock>

        <h3 class="subsection-title">Hilo de comentarios</h3>
        <CommentToolbar v-model:sort-model="commentSort" />

        <CommentCompose
          v-model="commentDraft"
          head="Inicia sesión para comentar · cuenta fase 19"
          hint="0 / 400 · se publica tras revisión"
          placeholder="Sumá al recuerdo o al tip… sin doxxing ni menores."
          disabled
        />

        <Comment
          author="Paola"
          body="Gracias por respetar el parche: comentarios con respeto, sin datos de terceros. Constancia comunitaria, no tribunal."
          time="Moderadora"
          avatar="P"
          pinned
        />

        <CommentList>
          <li>
            <Comment author="Alias placeholder" body="" time="hace 2 días" avatar="A">
              <template #body>
                <p>Brutal la ruta, gracias <MentionChip handle="Paola" /> por el parche.</p>
              </template>
              <template #actions>
                <CommentActions />
              </template>
              <CommentReplyBox />
              <CommentReplies>
                <li>
                  <Comment author="Paola" body="Gracias parcero, nos vemos en la próxima." time="hace 1 día" avatar="P" />
                </li>
              </CommentReplies>
            </Comment>
          </li>
          <li>
            <Comment
              author="Tu comentario"
              body="Tip: llevar capa de lluvia aunque salga sol."
              time="recién enviado"
              avatar="T"
              pending
            />
          </li>
        </CommentList>

        <CommentLoadMore />

        <h3 class="subsection-title" style="margin-top:32px">Denuncia · comentarios cerrados</h3>
        <ArsenalBlock style="margin-bottom:24px">
          <DenunciaCard title="Hueco en calzada" meta="constancia comunitaria" status="Publicada" compact />
          <CommentClosed style="margin-top:16px" />
        </ArsenalBlock>

        <h3 class="subsection-title">Actividad reciente (no feed social)</h3>
        <div class="arsenal-grid arsenal-grid--2">
          <ArsenalBlock>
            <h4>Últimas en Tu voz</h4>
            <ActivityMini :items="activityMiniItems" />
            <p class="meta" style="margin-top:10px">No aparece en Inicio como feed infinito.</p>
          </ArsenalBlock>
          <ArsenalBlock>
            <h4>Vacío · sin comentarios</h4>
            <Empty
              compact
              hide-cta
              glyph="💬"
              title="Aún no hay comentarios"
              copy="Sé el primero cuando Paola publique la memoria."
            />
          </ArsenalBlock>
        </div>

        <h3 class="subsection-title">Fase 28 · extras de comentarios</h3>
        <div class="arsenal-grid arsenal-grid--2" style="margin-bottom:24px">
          <ArsenalBlock>
            <h4>Estados y moderación</h4>
            <Comment
              author="Alias"
              body="Texto publicado tras revisión."
              time="editado"
              avatar="B"
              member-badge="Integrante"
              edited="Editado por moderación · placeholder"
            >
              <ModCommentBar>
                <Button variant="ghost" size="sm">Ocultar</Button>
                <Button variant="danger" size="sm">Eliminar</Button>
                <Button size="sm">Fijar</Button>
              </ModCommentBar>
            </Comment>
            <CommentRemoved copy="Comentario retirado · no cumple normas del parche." style="margin-top:12px" />
          </ArsenalBlock>
          <ArsenalBlock>
            <h4>Cita y enlace</h4>
            <QuoteReply />
            <p style="margin:8px 0;font-size:14px">Totalmente, nos salvó la capa.</p>
            <LinkPreview />
          </ArsenalBlock>
        </div>

        <h3 class="subsection-title">Fases 30–31 · panel y perfil</h3>
        <div class="arsenal-grid arsenal-grid--2" style="margin-bottom:24px">
          <ArsenalBlock>
            <PhaseLabel>Fase 30</PhaseLabel>
            <h4>Preferencias notificaciones</h4>
            <NotifyPrefs
              v-model:comment="notifyComment"
              v-model:reply="notifyReply"
              v-model:memory="notifyMemory"
              v-model:react="notifyReact"
            />
            <p class="meta" style="margin:10px 0 0">Sin popups · badge en panel usuario</p>
          </ArsenalBlock>
          <ArsenalBlock>
            <PhaseLabel>Fase 31</PhaseLabel>
            <h4>Perfil parcero público</h4>
            <ProfilePublic badge="Parche" />
          </ArsenalBlock>
        </div>

        <h3 class="subsection-title">Fases 32–35 · social ampliado</h3>
        <PhaseRoadmap :items="phaseSocialGated" />

        <div class="arsenal-grid arsenal-grid--2" style="margin-bottom:24px">
          <ArsenalBlock>
            <PhaseLabel>Fase 32</PhaseLabel>
            <h4>Solicitud de amistad</h4>
            <FriendRow avatar="P" title="Parcero placeholder" meta="Rodó contigo en —">
              <Button size="sm">Aceptar</Button>
              <Button variant="ghost" size="sm">Ignorar</Button>
            </FriendRow>
            <FriendRow avatar="?" title="Bloqueado" meta="Sin aviso al otro" blocked />
          </ArsenalBlock>
          <ArsenalBlock>
            <PhaseLabel>Fase 34</PhaseLabel>
            <h4>Hilo de rodada</h4>
            <RideThreadHead title="Anapoima" meta="ticket #0000">
              <Button variant="ghost" size="sm">Silenciar</Button>
            </RideThreadHead>
            <ChatBubble
              pinned
              pin-label="Paola · fijado"
              body="Punto de salida por confirmar — revisen WhatsApp también."
            />
          </ArsenalBlock>
        </div>

        <ArsenalBlock style="margin-bottom:24px">
          <PhaseLabel>Fase 33</PhaseLabel>
          <h4>Chat básico</h4>
          <ChatLayout :threads="chatThreads" active-title="Parcero A · placeholder">
            <ChatBubble body="Nos vemos en el punto" time="—:—" />
            <ChatBubble mine body="Listo parcero" time="—:—" />
          </ChatLayout>
          <p class="meta" style="margin-top:10px">Reportar mensaje · retención limitada · no emergencias</p>
        </ArsenalBlock>

        <ArsenalBlock style="margin-bottom:24px">
          <PhaseLabel>Fase 35</PhaseLabel>
          <h4>Actividad Parchese (no feed Inicio)</h4>
          <ParcheseActivity :items="parcheseItems" />
        </ArsenalBlock>

        <h3 class="subsection-title">Horizonte 36–44 · Red social en web</h3>
        <PhaseRoadmap :items="phaseSocialFuture" style="margin-bottom:24px" />

        <div class="arsenal-grid arsenal-grid--2" style="margin-bottom:24px">
          <ArsenalBlock>
            <PhaseLabel>Fase 36–37</PhaseLabel>
            <h4>Ficha comunidad</h4>
            <CommunityCard
              title="Parche Paola · placeholder"
              meta="Memorias, rodadas y tips del parche general."
              cover="Logo"
            >
              <template #channels>
                <DualChannelPills />
              </template>
              <template #actions>
                <Follow :following="followComm" @click="followComm = !followComm" />
                <Button variant="ghost" size="sm">Ver feed</Button>
                <Button variant="ghost" size="sm">Abrir chat</Button>
              </template>
            </CommunityCard>
          </ArsenalBlock>
          <ArsenalBlock>
            <PhaseLabel>Fase 36</PhaseLabel>
            <h4>Directorio</h4>
            <CommunityDir>
              <li><span>Parche general</span><Follow label="Unirse" /></li>
              <li><span>Servicio cascos</span><Follow label="Unirse" /></li>
              <li><span>Ruta Anapoima · alumni</span><span class="meta">Próximamente</span></li>
            </CommunityDir>
          </ArsenalBlock>
        </div>

        <div class="arsenal-grid arsenal-grid--2" style="margin-bottom:24px">
          <ArsenalBlock>
            <PhaseLabel>Fase 39</PhaseLabel>
            <h4>Feed personal</h4>
            <FeedPost
              author="Comunidad Parche"
              body="Nueva memoria Anapoima publicada · 84 km."
              meta="hace 3 h · cronológico"
            />
            <FeedPost
              author="Paola · Loigca"
              body="Tip: revisar presión de llantas antes de salida larga."
              meta="ayer"
            />
          </ArsenalBlock>
          <ArsenalBlock>
            <PhaseLabel>Fase 42</PhaseLabel>
            <h4>Inicio · widget social</h4>
            <HomeFeedWidget />
            <p class="meta" style="margin-top:10px">Tablero del día (rodada, km) sigue arriba del widget.</p>
          </ArsenalBlock>
        </div>

        <SocialOutScope style="margin-top:28px">
          <PhaseLabel>Orden</PhaseLabel>
          <h4 style="margin:8px 0;font-family:var(--display)">Camino social · <code>docs/roadmap.md</code></h4>
          <SocialRoadmapList :items="socialRoadmap" />
        </SocialOutScope>
      </section>

      <CmdPalette v-model="cmdOpen" :items="cmdItems" placeholder="Buscar rodada, producto, sección…" />

      <SiteFooter
        :links="footerLinks"
        note="WhatsApp: próximamente"
      />
    </main>

    <Fab label="Rodar" @click="sheetOpen = true" />

    <Sheet v-model="sheetOpen" title="Apúntese pa rodar">
      <p class="sm" style="color:var(--muted)">Sheet inferior — filtros, acciones rápidas, confirmaciones móvil.</p>
      <div class="stack" style="margin-top:16px;gap:10px">
        <Button @click="sheetOpen = false">Apúntese</Button>
        <Button variant="ghost" @click="sheetOpen = false">Cancelar</Button>
      </div>
    </Sheet>

    <Modal v-model="modalOpen" title="Confirmar cupo">
      <p class="sm">Nombre y WhatsApp ya van a Paola. Esto no cobra pasarela.</p>
      <div class="row">
        <Button @click="modalOpen = false">Listo</Button>
        <Button variant="ghost" @click="modalOpen = false">Cancelar</Button>
      </div>
    </Modal>

  </div>
</template>
