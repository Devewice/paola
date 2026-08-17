import { createApp } from 'vue'
import App from '@app/App.vue'
import { createAppDependencies } from '@app/bootstrap.ts'
import { createVuetifyPlugin } from '@app/plugins/vuetify.ts'

const { counter } = createAppDependencies()

createApp(App, { counter }).use(createVuetifyPlugin()).mount('#app')
