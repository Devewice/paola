import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import ComingSoonView from '@app/shell/ComingSoonView.vue'
import HomeRoute from '@app/shell/HomeRoute.vue'
import KitView from '@app/shell/KitView.vue'
import OperarView from '@app/shell/OperarView.vue'
import PaolaRoute from '@app/shell/PaolaRoute.vue'
import ParcheseRoute from '@app/shell/ParcheseRoute.vue'
import ProductRoute from '@app/shell/ProductRoute.vue'
import ShopRoute from '@app/shell/ShopRoute.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'inicio', component: HomeRoute, meta: { title: 'Inicio' } },
  { path: '/parchese', name: 'parchese', component: ParcheseRoute, meta: { title: 'Parchese' } },
  { path: '/tu-voz', name: 'tu-voz', component: ComingSoonView, meta: { title: 'Tu voz' } },
  { path: '/tienda', name: 'tienda', component: ShopRoute, meta: { title: 'Tienda' } },
  { path: '/tienda/:id', name: 'tienda-ficha', component: ProductRoute, meta: { title: 'Ficha' } },
  { path: '/paola', name: 'paola', component: PaolaRoute, meta: { title: 'Paola' } },
  { path: '/kit', name: 'kit', component: KitView, meta: { title: 'Kit visual' } },
  { path: '/operar', name: 'operar', component: OperarView, meta: { title: 'Cupos' } },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})
