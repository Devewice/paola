/// <reference types="vite/client" />
/// <reference types="vuetify" />

import 'vue-router'

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, unknown>
  export default component
}

declare module '*.svg?raw' {
  const src: string
  export default src
}

declare module 'vue-router' {
  interface RouteMeta {
    title: string
  }
}
