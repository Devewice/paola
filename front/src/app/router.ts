import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { ROUTE_TITLES } from '@app/constants/copy.ts'
import CuentaRoute from '@app/shell/CuentaRoute.vue'
import FeedRoute from '@app/shell/FeedRoute.vue'
import HomeRoute from '@app/shell/HomeRoute.vue'
import KitView from '@app/shell/KitView.vue'
import OperarView from '@app/shell/OperarView.vue'
import PaolaRoute from '@app/shell/PaolaRoute.vue'
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
  { path: APP_PATHS.KIT, name: 'kit', component: KitView, meta: { title: ROUTE_TITLES.KIT } },
  { path: APP_PATHS.OPERAR, name: 'operar', component: OperarView, meta: { title: ROUTE_TITLES.OPERAR } },
  { path: APP_PATHS.PRIVACIDAD, name: 'privacidad', component: PrivacyView, meta: { title: ROUTE_TITLES.PRIVACIDAD } },
  { path: APP_PATHS.CUENTA, name: 'cuenta', component: CuentaRoute, meta: { title: ROUTE_TITLES.CUENTA } },
  { path: APP_PATHS.FEED, name: 'feed', component: FeedRoute, meta: { title: ROUTE_TITLES.FEED } },
  { path: '/:pathMatch(.*)*', redirect: APP_PATHS.INICIO },
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
