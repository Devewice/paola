import { createApp } from 'vue'
import App from '@app/App.vue'
import { createAppDependencies } from '@app/bootstrap.ts'
import { router } from '@app/router.ts'
import { createMotionPlugin } from '@app/plugins/motion.ts'
import { createVuetifyPlugin } from '@app/plugins/vuetify.ts'

createAppDependencies()

createApp(App).use(router).use(createVuetifyPlugin()).use(createMotionPlugin()).mount('#app')
