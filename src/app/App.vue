<script setup lang="ts">
import { useRoute } from 'vue-router'
import { TABS } from '@app/navigation.ts'

const route = useRoute()
</script>

<template>
  <v-app>
    <v-app-bar color="surface" flat>
      <v-app-bar-title class="font-weight-bold">Paola</v-app-bar-title>
      <template #append>
        <nav class="d-flex ga-1 flex-wrap justify-end">
          <v-btn
            v-for="tab in TABS"
            :key="tab.to"
            :to="tab.to"
            :variant="route.path === tab.to ? 'tonal' : 'text'"
            size="small"
          >
            {{ tab.label }}
          </v-btn>
        </nav>
      </template>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>

    <v-footer class="px-4 py-3" color="surface">
      <span class="text-caption text-medium-emphasis">Paola · próximamente</span>
    </v-footer>
  </v-app>
</template>
