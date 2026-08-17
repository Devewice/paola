import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { es } from 'vuetify/locale'

export const createVuetifyPlugin = () =>
  createVuetify({
    locale: {
      locale: 'es',
      messages: { es },
    },
    theme: {
      defaultTheme: 'light',
      themes: {
        light: {
          colors: {
            primary: '#0F766E',
            secondary: '#1C1917',
            surface: '#FFFDF8',
          },
        },
      },
    },
  })
