<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { FOOTER_COPY, MEGA_COPY } from '@app/constants/copy.ts'
import { MEGA_FOOTER_COLUMNS, MEGA_NAV } from '@app/constants/nav.ts'
import { TABS } from '@app/navigation.ts'
import { getAppDependencies } from '@app/bootstrap.ts'
import { SHOP_DELIVERY_COPY } from '@modules/shop/constants/copy.ts'
import BrushDefs from '@ui/BrushDefs.vue'
import DualChannelPills from '@ui/DualChannelPills.vue'
import MegaHeader from '@ui/MegaHeader.vue'
import MegaPeek from '@ui/MegaPeek.vue'
import SiteFooter from '@ui/SiteFooter.vue'
import ZoneBadge from '@ui/ZoneBadge.vue'
import { APP_PATHS } from '@shared/http/constants.ts'

const route = useRoute()
const { paola, club, home } = getAppDependencies()
const page = paola.getPage()
const whatsapp = page.contact.whatsapp
const board = computed(() => home.getBoard())
const alliances = computed(() => club.getAlliances())
const footerAlliances = computed(() =>
  alliances.value.items.map((item) => ({
    name: item.name,
    href: item.href,
  })),
)
const isKitCatalog = computed(
  () =>
    route.path === APP_PATHS.ADMIN_UI ||
    route.path === `${APP_PATHS.ADMIN}/ui-test` ||
    route.path === APP_PATHS.KIT,
)

const footerLinks = [
  { label: 'Privacidad', to: APP_PATHS.PRIVACIDAD },
  { label: 'Cuenta', to: APP_PATHS.CUENTA },
  { label: 'Feed', to: APP_PATHS.FEED },
] as const

const footerContact = computed(() => [
  { label: page.contact.email, href: `mailto:${page.contact.email}` },
  { label: FOOTER_COPY.writeLabel, href: whatsapp.href },
])
</script>

<template>
  <BrushDefs />
  <div v-if="isKitCatalog" class="html-kit-root">
    <router-view />
  </div>
  <v-app v-else>
    <MegaHeader
      :items="MEGA_NAV"
      :whatsapp="whatsapp"
      :whatsapp-title="MEGA_COPY.whatsappTitle"
      :whatsapp-lead="MEGA_COPY.whatsappLead"
      :account-to="APP_PATHS.CUENTA"
    >
      <template #widget="{ item }">
        <MegaPeek
          v-if="item.label === 'Parchese'"
          kicker="Próxima"
          :title="board.next?.title ?? 'Sin fecha'"
          :meta="board.next ? `${board.next.date} · ${board.next.point}` : board.nextEmptyCopy"
          :image-src="board.memory?.photoSrc"
          :to="APP_PATHS.PARCHESE"
          :cta="item.cta"
          :empty="!board.next"
        />
        <MegaPeek
          v-else-if="item.label === 'Tu voz'"
          kicker="Loigca"
          :title="board.voice.tip?.title ?? 'Sin tip'"
          :copy="board.voice.tip?.body ?? board.voice.emptyCopy"
          :to="APP_PATHS.TU_VOZ"
          :cta="item.cta"
          :empty="!board.voice.tip"
        />
        <MegaPeek
          v-else-if="item.label === 'Tienda'"
          kicker="Entrega"
          title="Bogotá y Soacha"
          :copy="SHOP_DELIVERY_COPY"
          :to="APP_PATHS.TIENDA"
          :cta="item.cta"
        >
          <div class="row" style="margin-bottom: 12px">
            <ZoneBadge zone="bogota" />
            <ZoneBadge zone="soacha" />
            <ZoneBadge zone="fuera" />
          </div>
        </MegaPeek>
        <MegaPeek
          v-else-if="item.label === 'Paola'"
          kicker="Armargura"
          title="Paola"
          :copy="board.paola.phrase"
          :to="APP_PATHS.PAOLA"
          :cta="item.cta"
        >
          <DualChannelPills web="Web" :wa="whatsapp.label" />
        </MegaPeek>
      </template>
    </MegaHeader>

    <v-main class="paola-main">
      <router-view />
    </v-main>

    <footer class="paola-site-foot">
      <div class="wrap paola-site-foot__inner">
        <SiteFooter
          logo-src="/logo.png"
          :motto="FOOTER_COPY.motto"
          :copy="FOOTER_COPY.tagline"
          :columns="MEGA_FOOTER_COLUMNS"
          :contact="footerContact"
          :contact-title="FOOTER_COPY.contactTitle"
          :alliances="footerAlliances"
          :alliances-label="FOOTER_COPY.alliancesLabel"
          :alliances-empty="alliances.emptyCopy"
          :subscribe-title="FOOTER_COPY.subscribeTitle"
          :subscribe-placeholder="FOOTER_COPY.subscribePlaceholder"
          :subscribe-cta="FOOTER_COPY.subscribeCta"
          :subscribe-mail="page.contact.email"
          :links="footerLinks"
          :credit-label="FOOTER_COPY.creditLabel"
          :credit-name="FOOTER_COPY.creditName"
          :credit-href="FOOTER_COPY.creditHref"
          :legal-name="FOOTER_COPY.legalName"
          :domain="FOOTER_COPY.domain"
        />
      </div>
    </footer>

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
