<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { TABS } from '@app/navigation.ts'
import { getAppDependencies } from '@app/bootstrap.ts'
import BrushDefs from '@ui/BrushDefs.vue'
import KitAllianceStrip from '@ui/KitAllianceStrip.vue'
import { APP_PATHS } from '@shared/http/constants.ts'

const route = useRoute()
const { paola, club } = getAppDependencies()
const page = paola.getPage()
const whatsapp = page.contact.whatsapp
const alliances = computed(() => club.getAlliances())
const allianceNames = computed(() => alliances.value.items.map((item) => item.name))
const isKitCatalog = computed(
  () =>
    route.path === APP_PATHS.ADMIN_UI ||
    route.path === `${APP_PATHS.ADMIN}/ui-test` ||
    route.path === APP_PATHS.KIT,
)
const showFranja = computed(
  () => !isKitCatalog.value && !route.path.startsWith(APP_PATHS.ADMIN),
)
</script>

<template>
  <BrushDefs />
  <div v-if="isKitCatalog" class="html-kit-root">
    <router-view />
  </div>
  <v-app v-else>
    <header class="top">
      <router-link to="/" aria-label="Paola, inicio">
        <img src="/logo.png" alt="Paola — Rodando con propósito" />
      </router-link>
      <nav aria-label="Pestañas">
        <router-link v-for="tab in TABS" :key="tab.to" :to="tab.to">{{ tab.label }}</router-link>
      </nav>
    </header>

    <v-main class="paola-main">
      <router-view />
      <div v-if="showFranja" class="wrap paola-franja">
        <p class="meta" style="margin: 0 0 8px">Alianzas</p>
        <KitAllianceStrip v-if="allianceNames.length" :items="allianceNames" />
        <p v-else class="meta">{{ alliances.emptyCopy }}</p>
      </div>
    </v-main>

    <v-footer class="paola-footer px-4 py-3" color="background">
      <div class="paola-footer__inner">
        <img class="paola-footer__logo" src="/logo.png" alt="" width="32" height="32" />
        <p class="paola-footer__slogan">Rodando con propósito</p>
        <div class="paola-footer__row">
          <router-link class="paola-footer__link" :to="APP_PATHS.PAOLA">Paola</router-link>
          <span class="paola-footer__dot" aria-hidden="true">·</span>
          <router-link class="paola-footer__link" :to="APP_PATHS.PRIVACIDAD">Privacidad</router-link>
          <span class="paola-footer__dot" aria-hidden="true">·</span>
          <router-link class="paola-footer__link" :to="APP_PATHS.CUENTA">Cuenta</router-link>
          <span class="paola-footer__dot" aria-hidden="true">·</span>
          <router-link class="paola-footer__link" :to="APP_PATHS.FEED">Feed</router-link>
          <span class="paola-footer__dot" aria-hidden="true">·</span>
          <a
            class="paola-footer__link"
            :href="whatsapp.href"
            target="_blank"
            rel="noopener noreferrer"
          >{{ whatsapp.label }}</a>
          <template v-for="link in page.contact.social" :key="link.id">
            <span class="paola-footer__dot" aria-hidden="true">·</span>
            <a
              class="paola-footer__link"
              :href="link.href"
              target="_blank"
              rel="noopener noreferrer"
            >{{ link.label }}</a>
          </template>
        </div>
        <p class="paola-footer__domain">{{ page.contact.domain }}</p>
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
