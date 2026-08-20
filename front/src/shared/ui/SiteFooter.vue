<script setup lang="ts">
import AppLink from '@ui/AppLink.vue'

const year = new Date().getFullYear()

withDefaults(
  defineProps<{
    motto?: string
    nav?: readonly { label: string; href?: string; to?: string }[]
    links?: readonly { label: string; href?: string; to?: string; target?: '_blank' | '_self' }[]
    note?: string
    copy?: string
    logoSrc?: string
    creditLabel?: string
    creditName?: string
    creditHref?: string
    legalName?: string
    domain?: string
  }>(),
  {
    motto: 'Paola Biker',
    copy: 'Rodando con propósito',
    logoSrc: '/kit-assets/logo.png',
    creditLabel: 'Desarrollado por',
    creditName: 'jeisson.pro',
    creditHref: 'https://jeisson.pro',
    legalName: 'Paola Biker',
    domain: 'paolabiker.com',
  },
)
</script>

<template>
  <div class="site-footer">
    <div class="site-footer__brand">
      <img :src="logoSrc" width="40" height="40" alt="Paola" />
      <div>
        <p class="site-footer__name">{{ motto }}</p>
        <p class="meta" style="margin: 0">{{ copy }}</p>
      </div>
    </div>
    <div class="site-footer__end">
      <nav v-if="nav?.length" class="site-footer__nav" aria-label="Secciones">
        <AppLink v-for="item in nav" :key="(item.to ?? item.href) + item.label" :to="item.to" :href="item.href">
          {{ item.label }}
        </AppLink>
      </nav>
      <div v-if="links?.length" class="site-footer__links">
        <AppLink
          v-for="link in links"
          :key="(link.to ?? link.href) + link.label"
          :to="link.to"
          :href="link.href"
          :target="link.target"
        >
          {{ link.label }}
        </AppLink>
      </div>
      <div class="site-footer__meta">
        <p class="site-footer__legal">© {{ year }} {{ legalName }}</p>
        <p v-if="domain" class="site-footer__legal">{{ domain }}</p>
        <p class="site-footer__credit">
          {{ creditLabel }}
          <a :href="creditHref" target="_blank" rel="noopener noreferrer">{{ creditName }}</a>
        </p>
        <span v-if="note">{{ note }}</span>
      </div>
    </div>
  </div>
</template>
