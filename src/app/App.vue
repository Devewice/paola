<script setup lang="ts">
import { useRoute } from 'vue-router'
import { TABS } from '@app/navigation.ts'
import AlliancesStrip from '@app/shell/AlliancesStrip.vue'

const route = useRoute()
</script>

<template>
  <v-app>
    <v-app-bar color="background" flat>
      <router-link to="/" class="d-flex align-center px-2" aria-label="Paola, inicio">
        <img class="paola-shell-logo" src="/logo.png" alt="Paola — Rodando con propósito" />
      </router-link>
      <v-spacer />
      <nav class="paola-nav paola-nav--desktop" aria-label="Pestañas">
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
      <div class="paola-shell">
        <div class="paola-shell__page">
          <router-view />
        </div>
        <AlliancesStrip />
      </div>
    </v-main>

    <v-footer class="paola-footer px-4 py-3" color="background">
      <div class="paola-footer__row">
        <router-link class="paola-footer__link" to="/paola">Paola</router-link>
        <span class="paola-footer__dot" aria-hidden="true">·</span>
        <span class="paola-footer__wa">WhatsApp · próximamente</span>
        <span class="paola-footer__dot" aria-hidden="true">·</span>
        <span>paolabiker.com</span>
      </div>
    </v-footer>

    <nav class="paola-bottom-nav" aria-label="Pestañas">
      <router-link
        v-for="tab in TABS"
        :key="tab.to"
        :to="tab.to"
        class="paola-bottom-nav__item"
        :class="{ 'is-on': route.path === tab.to }"
      >
        {{ tab.label }}
      </router-link>
    </nav>
  </v-app>
</template>
