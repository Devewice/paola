import { createApp } from 'vue'
import App from '@app/App.vue'
import { createAppDependencies } from '@app/bootstrap.ts'
import { router } from '@app/router.ts'
import { createMotionPlugin } from '@app/plugins/motion.ts'
import { createVuetifyPlugin } from '@app/plugins/vuetify.ts'
import '@fontsource/oswald/500.css'
import '@fontsource/oswald/600.css'
import '@fontsource/oswald/700.css'
import '@fontsource/montserrat/400.css'
import '@fontsource/montserrat/500.css'
import '@fontsource/montserrat/600.css'
import '@fontsource/montserrat/700.css'
import '@fontsource/montserrat/800.css'
import '@shared/theme/portal.css'
import '@ui/kit.css'

await createAppDependencies()

createApp(App).use(router).use(createVuetifyPlugin()).use(createMotionPlugin()).mount('#app')
