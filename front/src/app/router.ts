import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { ROUTE_TITLES } from '@app/constants/copy.ts'
import CuentaRoute from '@app/shell/CuentaRoute.vue'
import FeedRoute from '@app/shell/FeedRoute.vue'
import HomeRoute from '@app/shell/HomeRoute.vue'
import KitView from '@app/shell/KitView.vue'
import NotFoundView from '@app/shell/NotFoundView.vue'
import OperarView from '@app/shell/OperarView.vue'
import PaolaRoute from '@app/shell/PaolaRoute.vue'
import ParceroRoute from '@app/shell/ParceroRoute.vue'
import ParcheseRoute from '@app/shell/ParcheseRoute.vue'
import ProductRoute from '@app/shell/ProductRoute.vue'
import ServiceRoute from '@app/shell/ServiceRoute.vue'
import ShopRoute from '@app/shell/ShopRoute.vue'
import TuVozRoute from '@app/shell/TuVozRoute.vue'
import PrivacyView from '@app/shell/PrivacyView.vue'
import { APP_PATHS } from '@shared/http/constants.ts'

const routes: RouteRecordRaw[] = [
  { path: APP_PATHS.INICIO, name: 'inicio', component: HomeRoute, meta: { title: ROUTE_TITLES.INICIO } },
  { path: APP_PATHS.PARCHESE, name: 'parchese', component: ParcheseRoute, meta: { title: ROUTE_TITLES.PARCHESE } },
  { path: APP_PATHS.TU_VOZ, name: 'tu-voz', component: TuVozRoute, meta: { title: ROUTE_TITLES.TU_VOZ } },
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
  { path: APP_PATHS.ADMIN, name: 'admin', component: OperarView, meta: { title: ROUTE_TITLES.ADMIN } },
  { path: APP_PATHS.ADMIN_UI, name: 'admin-ui', component: KitView, meta: { title: ROUTE_TITLES.KIT } },
  { path: `${APP_PATHS.ADMIN}/ui-test`, redirect: APP_PATHS.ADMIN_UI },
  { path: APP_PATHS.KIT, redirect: APP_PATHS.ADMIN_UI },
  { path: APP_PATHS.OPERAR, redirect: APP_PATHS.ADMIN },
  { path: `${APP_PATHS.OPERAR}/ui-test`, redirect: APP_PATHS.ADMIN_UI },
  { path: APP_PATHS.PRIVACIDAD, name: 'privacidad', component: PrivacyView, meta: { title: ROUTE_TITLES.PRIVACIDAD } },
  { path: APP_PATHS.CUENTA, name: 'cuenta', component: CuentaRoute, meta: { title: ROUTE_TITLES.CUENTA } },
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
  scrollBehavior(to) {
    if (to.hash) {
      return { el: to.hash }
    }
    return { top: 0 }
  },
})
