import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import ComingSoonView from '@app/shell/ComingSoonView.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'inicio', component: ComingSoonView, meta: { title: 'Inicio' } },
  { path: '/parchese', name: 'parchese', component: ComingSoonView, meta: { title: 'Parchese' } },
  { path: '/tu-voz', name: 'tu-voz', component: ComingSoonView, meta: { title: 'Tu voz' } },
  { path: '/tienda', name: 'tienda', component: ComingSoonView, meta: { title: 'Tienda' } },
  { path: '/paola', name: 'paola', component: ComingSoonView, meta: { title: 'Paola' } },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})
