import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { es } from 'vuetify/locale'
import { PAOLA_COLORS } from '@shared/theme/colors.ts'

export const createVuetifyPlugin = () =>
  createVuetify({
    locale: {
      locale: 'es',
      messages: { es },
    },
    defaults: {
      VBtn: {
        elevation: 0,
      },
    },
    theme: {
      defaultTheme: 'paolaDark',
      themes: {
        paolaDark: {
          dark: true,
          colors: {
            background: PAOLA_COLORS.black,
            surface: PAOLA_COLORS.surface,
            'surface-bright': PAOLA_COLORS.surface,
            'surface-light': PAOLA_COLORS.navy,
            'surface-variant': PAOLA_COLORS.navy,
            primary: PAOLA_COLORS.blue,
            secondary: PAOLA_COLORS.navy,
            error: PAOLA_COLORS.danger,
            success: PAOLA_COLORS.ok,
            warning: PAOLA_COLORS.warn,
            info: PAOLA_COLORS.cyan,
            'on-background': PAOLA_COLORS.white,
            'on-surface': PAOLA_COLORS.white,
            'on-primary': PAOLA_COLORS.white,
            'on-secondary': PAOLA_COLORS.white,
            'on-error': PAOLA_COLORS.white,
          },
        },
      },
    },
  })
