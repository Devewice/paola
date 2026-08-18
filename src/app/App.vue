<script setup lang="ts">
import { useRoute } from 'vue-router'
import { TABS } from '@app/navigation.ts'

const route = useRoute()
</script>

<template>
  <v-app>
    <v-app-bar color="background" flat>
      <router-link to="/" class="d-flex align-center px-2" aria-label="Paola, inicio">
        <img class="paola-shell-logo" src="/logo.png" alt="Paola — Rodando con propósito" />
      </router-link>
      <v-spacer />
      <nav class="paola-nav d-flex ga-1 flex-wrap justify-end">
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
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>

    <v-footer class="px-4 py-3" color="background">
      <span class="text-caption" style="color: var(--paola-muted)">
        Paola · paolabiker.com
      </span>
    </v-footer>
  </v-app>
</template>
