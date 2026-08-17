<script setup lang="ts">
import { CounterView, type CounterModule } from '@modules/counter/index.ts'

defineProps<{
  counter: CounterModule
}>()

const layers = [
  {
    title: 'Dominio',
    text: 'Reglas y entidades. Sin UI, sin HTTP, sin storage.',
    icon: 'mdi-cube-outline',
  },
  {
    title: 'Aplicación',
    text: 'Casos de uso. Dependen de puertos, no de adapters.',
    icon: 'mdi-cog-outline',
  },
  {
    title: 'Infraestructura',
    text: 'Adapters intercambiables: memoria, localStorage, API…',
    icon: 'mdi-server-outline',
  },
  {
    title: 'Presentación',
    text: 'Vuetify solo habla con casos de uso ya cableados.',
    icon: 'mdi-palette-outline',
  },
] as const
</script>

<template>
  <v-app>
    <v-app-bar color="primary" flat>
      <v-app-bar-title>Paola</v-app-bar-title>
    </v-app-bar>

    <v-main>
      <v-container class="py-10" style="max-width: 960px">
        <p class="text-overline text-primary mb-2">Base modular</p>
        <h1 class="text-h3 font-weight-bold mb-4">Vue + Vuetify desacoplado</h1>
        <p class="text-body-1 text-medium-emphasis mb-8" style="max-width: 42rem">
          Cada módulo habla con el resto por contratos (puertos).
          El arranque es el único lugar que elige implementaciones concretas.
        </p>

        <v-row class="mb-8">
          <v-col
            v-for="layer in layers"
            :key="layer.title"
            cols="12"
            sm="6"
            md="3"
          >
            <v-card height="100%" variant="outlined" rounded="lg">
              <v-card-text>
                <v-icon :icon="layer.icon" class="mb-3" color="primary" />
                <div class="text-subtitle-1 font-weight-medium">{{ layer.title }}</div>
                <p class="text-body-2 text-medium-emphasis mb-0 mt-2">
                  {{ layer.text }}
                </p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <CounterView :counter="counter" />
      </v-container>
    </v-main>
  </v-app>
</template>
