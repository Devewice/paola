import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { ROUTE_TITLES } from '@app/constants/copy.ts'
import ComingSoonView from '@app/shell/ComingSoonView.vue'
import HomeRoute from '@app/shell/HomeRoute.vue'
import KitView from '@app/shell/KitView.vue'
import OperarView from '@app/shell/OperarView.vue'
import PaolaRoute from '@app/shell/PaolaRoute.vue'
import ParcheseRoute from '@app/shell/ParcheseRoute.vue'
import ProductRoute from '@app/shell/ProductRoute.vue'
import ShopRoute from '@app/shell/ShopRoute.vue'
import { APP_PATHS } from '@shared/http/constants.ts'

const routes: RouteRecordRaw[] = [
  { path: APP_PATHS.INICIO, name: 'inicio', component: HomeRoute, meta: { title: ROUTE_TITLES.INICIO } },
  { path: APP_PATHS.PARCHESE, name: 'parchese', component: ParcheseRoute, meta: { title: ROUTE_TITLES.PARCHESE } },
  { path: APP_PATHS.TU_VOZ, name: 'tu-voz', component: ComingSoonView, meta: { title: ROUTE_TITLES.TU_VOZ } },
  { path: APP_PATHS.TIENDA, name: 'tienda', component: ShopRoute, meta: { title: ROUTE_TITLES.TIENDA } },
  {
    path: `${APP_PATHS.TIENDA}/:id`,
    name: 'tienda-ficha',
    component: ProductRoute,
    meta: { title: ROUTE_TITLES.FICHA },
  },
  { path: APP_PATHS.PAOLA, name: 'paola', component: PaolaRoute, meta: { title: ROUTE_TITLES.PAOLA } },
  { path: APP_PATHS.KIT, name: 'kit', component: KitView, meta: { title: ROUTE_TITLES.KIT } },
  { path: APP_PATHS.OPERAR, name: 'operar', component: OperarView, meta: { title: ROUTE_TITLES.OPERAR } },
  { path: '/:pathMatch(.*)*', redirect: APP_PATHS.INICIO },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})
