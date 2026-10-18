import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { OG_COPY, ROUTE_TITLES } from '@app/constants/copy.ts'
import CuentaRoute from '@app/shell/CuentaRoute.vue'
import CuentaAmigos from '@app/shell/cuenta/CuentaAmigos.vue'
import CuentaAvisos from '@app/shell/cuenta/CuentaAvisos.vue'
import CuentaChat from '@app/shell/cuenta/CuentaChat.vue'
import CuentaPedidos from '@app/shell/cuenta/CuentaPedidos.vue'
import CuentaPerfil from '@app/shell/cuenta/CuentaPerfil.vue'
import CuentaRodadas from '@app/shell/cuenta/CuentaRodadas.vue'
import FeedRoute from '@app/shell/FeedRoute.vue'
import HomeRoute from '@app/shell/HomeRoute.vue'
import KitRoute from '@app/shell/KitRoute.vue'
import NotFoundView from '@app/shell/NotFoundView.vue'
import OperarView from '@app/shell/OperarView.vue'
import PaolaRoute from '@app/shell/PaolaRoute.vue'
import ParceroRoute from '@app/shell/ParceroRoute.vue'
import ParcheseRoute from '@app/shell/ParcheseRoute.vue'
import ParcheseElParche from '@app/shell/parchese/ParcheseElParche.vue'
import ParcheseHub from '@app/shell/parchese/ParcheseHub.vue'
import ParcheseMemorias from '@app/shell/parchese/ParcheseMemorias.vue'
import ParcheseRodada from '@app/shell/parchese/ParcheseRodada.vue'
import ParcheseRodadas from '@app/shell/parchese/ParcheseRodadas.vue'
import TuVozComparendos from '@app/shell/tu-voz/TuVozComparendos.vue'
import TuVozEncuestas from '@app/shell/tu-voz/TuVozEncuestas.vue'
import TuVozHub from '@app/shell/tu-voz/TuVozHub.vue'
import TuVozReportes from '@app/shell/tu-voz/TuVozReportes.vue'
import TuVozTips from '@app/shell/tu-voz/TuVozTips.vue'
import ProductRoute from '@app/shell/ProductRoute.vue'
import ServiceRoute from '@app/shell/ServiceRoute.vue'
import ShopRoute from '@app/shell/ShopRoute.vue'
import TuVozRoute from '@app/shell/TuVozRoute.vue'
import LoginRoute from '@app/shell/LoginRoute.vue'
import PollRoute from '@app/shell/PollRoute.vue'
import PrivacyView from '@app/shell/PrivacyView.vue'
import { APP_PATHS } from '@shared/http/constants.ts'

/** Alto del header sticky + aire, para que el ancla no quede debajo. */
const HEADER_OFFSET = 88

const routes: RouteRecordRaw[] = [
  { path: APP_PATHS.INICIO, name: 'inicio', component: HomeRoute, meta: { title: ROUTE_TITLES.INICIO } },
  {
    path: APP_PATHS.PARCHESE,
    component: ParcheseRoute,
    children: [
      { path: '', name: 'parchese', component: ParcheseHub, meta: { title: ROUTE_TITLES.PARCHESE } },
      {
        path: 'rodadas',
        name: 'parchese-rodadas',
        component: ParcheseRodadas,
        meta: { title: ROUTE_TITLES.PARCHESE_RODADAS },
      },
      {
        path: 'rodadas/:id',
        name: 'parchese-rodada',
        component: ParcheseRodada,
        meta: { title: ROUTE_TITLES.PARCHESE_RODADAS },
      },
      {
        path: 'memorias',
        name: 'parchese-memorias',
        component: ParcheseMemorias,
        meta: { title: ROUTE_TITLES.PARCHESE_MEMORIAS },
      },
      {
        path: 'el-parche',
        name: 'parchese-el-parche',
        component: ParcheseElParche,
        meta: { title: ROUTE_TITLES.PARCHESE_EL_PARCHE },
      },
    ],
  },
  {
    path: `${APP_PATHS.TU_VOZ_ENCUESTAS}/:id`,
    name: 'encuesta',
    component: PollRoute,
    meta: { title: ROUTE_TITLES.TU_VOZ_ENCUESTAS, compactFooter: true },
  },
  {
    path: APP_PATHS.TU_VOZ,
    component: TuVozRoute,
    children: [
      { path: '', name: 'tu-voz', component: TuVozHub, meta: { title: ROUTE_TITLES.TU_VOZ } },
      { path: 'tips', name: 'tu-voz-tips', component: TuVozTips, meta: { title: ROUTE_TITLES.TU_VOZ_TIPS } },
      {
        path: 'comparendos',
        name: 'tu-voz-comparendos',
        component: TuVozComparendos,
        meta: { title: ROUTE_TITLES.TU_VOZ_COMPARENDOS },
      },
      {
        path: 'reportes',
        name: 'tu-voz-reportes',
        component: TuVozReportes,
        meta: { title: ROUTE_TITLES.TU_VOZ_REPORTES },
      },
      {
        path: 'encuestas',
        name: 'tu-voz-encuestas',
        component: TuVozEncuestas,
        meta: { title: ROUTE_TITLES.TU_VOZ_ENCUESTAS },
      },
    ],
  },
  { path: APP_PATHS.TIENDA, name: 'tienda', component: ShopRoute, meta: { title: ROUTE_TITLES.TIENDA } },
  {
    path: `${APP_PATHS.TIENDA}/servicio/:id`,
    name: 'tienda-servicio',
    component: ServiceRoute,
    meta: { title: ROUTE_TITLES.LAVADO },
  },
  {
    path: `${APP_PATHS.TIENDA}/:id`,
    name: 'tienda-ficha',
    component: ProductRoute,
    meta: { title: ROUTE_TITLES.FICHA },
  },
  { path: APP_PATHS.PAOLA, name: 'paola', component: PaolaRoute, meta: { title: ROUTE_TITLES.PAOLA } },
  {
    path: APP_PATHS.ADMIN,
    alias: APP_PATHS.OPERAR,
    name: 'admin',
    component: OperarView,
    meta: { title: ROUTE_TITLES.NOT_FOUND },
  },
  { path: APP_PATHS.ADMIN_UI, name: 'admin-ui', component: KitRoute, meta: { title: ROUTE_TITLES.NOT_FOUND } },
  { path: APP_PATHS.PRIVACIDAD, name: 'privacidad', component: PrivacyView, meta: { title: ROUTE_TITLES.PRIVACIDAD } },
  { path: APP_PATHS.ENTRAR, name: 'entrar', component: LoginRoute, meta: { title: ROUTE_TITLES.ENTRAR } },
  {
    path: APP_PATHS.CUENTA,
    component: CuentaRoute,
    meta: { title: ROUTE_TITLES.CUENTA, compactFooter: true },
    children: [
      { path: '', name: 'cuenta', component: CuentaPerfil, meta: { title: ROUTE_TITLES.CUENTA } },
      { path: 'rodadas', name: 'cuenta-rodadas', component: CuentaRodadas, meta: { title: ROUTE_TITLES.CUENTA_RODADAS } },
      { path: 'pedidos', name: 'cuenta-pedidos', component: CuentaPedidos, meta: { title: ROUTE_TITLES.CUENTA_PEDIDOS } },
      { path: 'amigos', name: 'cuenta-amigos', component: CuentaAmigos, meta: { title: ROUTE_TITLES.CUENTA_AMIGOS } },
      { path: 'chat', name: 'cuenta-chat', component: CuentaChat, meta: { title: ROUTE_TITLES.CUENTA_CHAT } },
      { path: 'avisos', name: 'cuenta-avisos', component: CuentaAvisos, meta: { title: ROUTE_TITLES.CUENTA_AVISOS } },
    ],
  },
  { path: APP_PATHS.FEED, name: 'feed', component: FeedRoute, meta: { title: ROUTE_TITLES.FEED } },
  {
    path: `${APP_PATHS.PARCERO}/:alias`,
    name: 'parcero',
    component: ParceroRoute,
    meta: { title: ROUTE_TITLES.PARCERO },
  },
  { path: '/:pathMatch(.*)*', name: 'no-encontrado', component: NotFoundView, meta: { title: ROUTE_TITLES.NOT_FOUND } },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return { el: to.hash, top: HEADER_OFFSET }
    }
    return { top: 0 }
  },
})

router.afterEach((to) => {
  const title = typeof to.meta.title === 'string' ? to.meta.title : ''
  document.title = title && to.name !== 'inicio' ? `${title} · ${OG_COPY.title}` : `${OG_COPY.title} · ${OG_COPY.tagline}`
})
