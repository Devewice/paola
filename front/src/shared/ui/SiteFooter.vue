<script setup lang="ts">
import { ref } from 'vue'
import AppLink from '@ui/AppLink.vue'
import Button from '@ui/Button.vue'
import Input from '@ui/Input.vue'

const year = new Date().getFullYear()
const subscribeEmail = ref('')

const props = withDefaults(
  defineProps<{
    motto?: string
    columns?: readonly {
      title: string
      links: readonly { label: string; href?: string; to?: string }[]
    }[]
    links?: readonly { label: string; href?: string; to?: string }[]
    contact?: readonly { label: string; href?: string; to?: string }[]
    alliances?: readonly { name: string; href?: string }[]
    alliancesLabel?: string
    alliancesEmpty?: string
    note?: string
    copy?: string
    logoSrc?: string
    subscribeTitle?: string
    subscribePlaceholder?: string
    subscribeCta?: string
    subscribeMail?: string
    contactTitle?: string
    creditLabel?: string
    creditName?: string
    creditHref?: string
    legalName?: string
    domain?: string
  }>(),
  {
    motto: 'Paola Biker',
    copy: 'Rodando con propósito',
    alliancesLabel: 'Alianzas',
    logoSrc: '/kit-assets/logo.png',
    subscribeTitle: 'Avisos del parche',
    subscribePlaceholder: 'Tu correo',
    subscribeCta: 'Avísame',
    contactTitle: 'Contacto',
    creditLabel: 'Desarrollado por',
    creditName: 'jeisson.pro',
    creditHref: 'https://jeisson.pro',
    legalName: 'Paola Biker',
    domain: 'paolabiker.com',
  },
)

function onSubscribe() {
  const mail = props.subscribeMail?.trim()
  const address = subscribeEmail.value.trim()
  if (!mail || !address) return

  const subject = encodeURIComponent('Quiero enterarme al parche')
  const body = encodeURIComponent(
    `Correo: ${address}\n\nAvísame de rodadas, tips y novedades del parche.`,
  )
  window.location.href = `mailto:${mail}?subject=${subject}&body=${body}`
}
</script>

<template>
  <div class="site-footer" :class="{ 'site-footer--portal': columns?.length }">
    <header v-if="columns?.length" class="site-footer__crest">
      <div class="site-footer__crest-mark" aria-hidden="true">
        <img class="site-footer__crest-logo" :src="logoSrc" width="72" height="72" alt="" />
      </div>
      <h2 class="sr-only">{{ motto }}</h2>
      <div class="site-footer__brush-line" aria-hidden="true">
        <p class="type-brush-dry type-brush-dry--footer">Paola</p>
        <p class="type-brush-dry type-brush-dry--blue type-brush-dry--footer">Biker</p>
      </div>
      <p class="site-footer__purpose">{{ copy }}</p>
    </header>

    <div v-else class="site-footer__brand site-footer__brand--compact">
      <img :src="logoSrc" width="40" height="40" alt="Paola" />
      <div>
        <p class="site-footer__name">{{ motto }}</p>
        <p class="site-footer__tagline">{{ copy }}</p>
      </div>
    </div>

    <template v-if="columns?.length">
      <div class="site-footer__grid">
        <div v-for="col in columns" :key="col.title" class="site-footer__col">
          <h5 class="site-footer__col-title">{{ col.title }}</h5>
          <ul class="site-footer__col-list">
            <li v-for="link in col.links" :key="link.label">
              <AppLink :to="link.to" :href="link.href">{{ link.label }}</AppLink>
            </li>
          </ul>
        </div>

        <div v-if="contact?.length" class="site-footer__col">
          <h5 class="site-footer__col-title">{{ contactTitle }}</h5>
          <ul class="site-footer__col-list">
            <li v-for="link in contact" :key="(link.to ?? link.href) + link.label">
              <AppLink :to="link.to" :href="link.href">{{ link.label }}</AppLink>
            </li>
            <li v-if="domain">
              <a :href="`https://${domain}`" target="_blank" rel="noopener noreferrer">{{ domain }}</a>
            </li>
          </ul>
        </div>

        <div v-if="subscribeMail" class="site-footer__col site-footer__col--subscribe">
          <h5 class="site-footer__col-title">{{ subscribeTitle }}</h5>
          <form class="site-footer__subscribe-form" @submit.prevent="onSubscribe">
            <Input
              v-model="subscribeEmail"
              type="email"
              :placeholder="subscribePlaceholder"
            />
            <Button type="submit" size="sm">{{ subscribeCta }}</Button>
          </form>
        </div>
      </div>

      <div class="site-footer__alliances" aria-label="Alianzas del parche">
        <span class="site-footer__alliances-label">{{ alliancesLabel }}</span>
        <div class="site-footer__alliances-track">
          <template v-if="alliances?.length">
            <a
              v-for="ally in alliances"
              :key="ally.name"
              class="site-footer__ally"
              :href="ally.href || undefined"
              :target="ally.href ? '_blank' : undefined"
              :rel="ally.href ? 'noopener noreferrer' : undefined"
              :tabindex="ally.href ? undefined : -1"
            >
              {{ ally.name }}
            </a>
          </template>
          <span v-else class="site-footer__alliances-empty">{{ alliancesEmpty }}</span>
        </div>
      </div>
    </template>

    <div class="site-footer__bar">
      <div class="site-footer__legal-block">
        <p class="site-footer__legal">© {{ year }} {{ legalName }}</p>
      </div>
      <div v-if="links?.length" class="site-footer__links">
        <AppLink v-for="link in links" :key="(link.to ?? link.href) + link.label" :to="link.to" :href="link.href">
          {{ link.label }}
        </AppLink>
      </div>
      <p class="site-footer__credit">
        {{ creditLabel }}
        <a :href="creditHref" target="_blank" rel="noopener noreferrer">© {{ creditName }}</a>
      </p>
      <span v-if="note" class="site-footer__note">{{ note }}</span>
    </div>
  </div>
</template>

<style scoped>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
