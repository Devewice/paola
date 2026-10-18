<script setup lang="ts">
import { computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { FOOTER_COPY, MEGA_COPY } from '@app/constants/copy.ts'
import { CUENTA_NAV } from '@app/constants/cuenta.ts'
import { appSession, clearSession, syncSession } from '@app/shell/session.ts'
import { useOperarAccess } from '@app/shell/useOperarAccess.ts'
import { useAdminEdit } from '@app/shell/adminMode.ts'
import { ADMIN_BAR_COPY, OPERAR_COPY, OPERAR_QUERY, OPERAR_QUICK_CREATE } from '@app/constants/operar.ts'
import AdminBar from '@ui/AdminBar.vue'
import { MEGA_FOOTER_COLUMNS, MEGA_NAV } from '@app/constants/nav.ts'
import { TABS } from '@app/navigation.ts'
import { getAppDependencies, inventoryVersion } from '@app/bootstrap.ts'
import { kitUnlocked } from '@app/shell/kitGate.ts'
import BrushDefs from '@ui/BrushDefs.vue'
import MegaHeader from '@ui/MegaHeader.vue'
import SiteFooter from '@ui/SiteFooter.vue'
import ToastHost from '@ui/ToastHost.vue'
import { APP_PATHS } from '@shared/http/constants.ts'

const route = useRoute()
const router = useRouter()
const { paola } = getAppDependencies()
const page = paola.getPage()
const whatsapp = page.contact.whatsapp
const alliances = computed(() => {
  void inventoryVersion.value
  return getAppDependencies().club.getAlliances()
})
const footerAlliances = computed(() =>
  alliances.value.items.map((item) => ({
    name: item.name,
    href: item.href,
  })),
)
const operar = useOperarAccess()
const adminEdit = useAdminEdit()
const adminTo = computed(() => (operar.gate.value === 'ready' ? APP_PATHS.ADMIN : undefined))
const showAdminBar = computed(() => operar.gate.value === 'ready' && Boolean(operar.access.value))
const adminWho = computed(() =>
  operar.access.value ? OPERAR_COPY.roleTag(operar.access.value.alias, operar.access.value.role.name) : undefined,
)
const adminCreateItems = computed(() =>
  OPERAR_QUICK_CREATE.filter((item) => operar.can(item.permission)).map((item) => ({
    label: item.label,
    to: `${APP_PATHS.ADMIN}?${new URLSearchParams({
      [OPERAR_QUERY.SECTION]: item.section,
      ...(item.create ? { [OPERAR_QUERY.CREATE]: item.create } : {}),
    }).toString()}`,
  })),
)
const adminLinks = computed(() =>
  route.path === APP_PATHS.ADMIN
    ? [{ label: ADMIN_BAR_COPY.site, to: APP_PATHS.INICIO }]
    : [{ label: ADMIN_BAR_COPY.panel, to: APP_PATHS.ADMIN }],
)

const accountMenu = computed(() => (appSession.sessionId.value ? CUENTA_NAV : undefined))

/** Al entrar o salir de la cuenta cambia la sesión guardada: se vuelve a preguntar si tiene panel. */
watch(() => route.fullPath, syncSession)
watch(appSession.sessionId, (current) => {
  if (current !== operar.session.value) void operar.reload()
})

function onStorage(): void {
  syncSession()
}

onMounted(() => window.addEventListener('storage', onStorage))
onUnmounted(() => window.removeEventListener('storage', onStorage))

function signOut(): void {
  clearSession()
  void router.push(APP_PATHS.ENTRAR)
}

const isKitCatalog = computed(() => kitUnlocked.value && route.path === APP_PATHS.ADMIN_UI)

const footerCompact = computed(
  () => route.path === APP_PATHS.CUENTA || route.path === APP_PATHS.ENTRAR || route.meta.compactFooter === true,
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
  <ToastHost />
  <div v-if="isKitCatalog" class="html-kit-root">
    <router-view />
  </div>
  <v-app v-else :class="{ 'has-admin-bar': showAdminBar, 'is-admin-editing': adminEdit.active.value }">
    <AdminBar
      v-if="showAdminBar"
      :label="ADMIN_BAR_COPY.brand"
      :who="adminWho"
      :editing="adminEdit.editing.value"
      :edit-label="ADMIN_BAR_COPY.edit"
      :edit-hint="ADMIN_BAR_COPY.editHint"
      :create-label="ADMIN_BAR_COPY.create"
      :create-items="adminCreateItems"
      :links="adminLinks"
      @update:editing="adminEdit.setEditing"
    />
    <MegaHeader
      :items="MEGA_NAV"
      :whatsapp="whatsapp"
      :whatsapp-title="MEGA_COPY.whatsappTitle"
      :whatsapp-lead="MEGA_COPY.whatsappLead"
      :account-to="APP_PATHS.CUENTA"
      :account-menu="accountMenu"
      :account-name="appSession.alias.value"
      :account-title="MEGA_COPY.accountTitle"
      :sign-out-label="MEGA_COPY.signOut"
      :admin-to="adminTo"
      :admin-label="MEGA_COPY.adminLabel"
      :admin-title="MEGA_COPY.adminTitle"
      :admin-lead="MEGA_COPY.adminLead"
      @sign-out="signOut"
    />

    <v-main class="paola-main">
      <router-view />
    </v-main>

    <footer class="paola-site-foot" :class="{ 'paola-site-foot--compact': footerCompact }">
      <div class="wrap paola-site-foot__inner">
        <SiteFooter
          :compact="footerCompact"
          logo-src="/logo.png"
          :motto="FOOTER_COPY.motto"
          :copy="FOOTER_COPY.tagline"
          :columns="footerCompact ? undefined : MEGA_FOOTER_COLUMNS"
          :contact="footerCompact ? undefined : footerContact"
          :contact-title="FOOTER_COPY.contactTitle"
          :alliances="footerCompact ? undefined : footerAlliances"
          :alliances-label="FOOTER_COPY.alliancesLabel"
          :alliances-empty="alliances.emptyCopy"
          :subscribe-title="FOOTER_COPY.subscribeTitle"
          :subscribe-placeholder="FOOTER_COPY.subscribePlaceholder"
          :subscribe-cta="FOOTER_COPY.subscribeCta"
          :subscribe-mail="footerCompact ? undefined : page.contact.email"
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
