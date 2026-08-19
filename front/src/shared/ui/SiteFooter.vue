<script setup lang="ts">
import AppLink from '@ui/AppLink.vue'

withDefaults(
  defineProps<{
    motto?: string
    links?: readonly { label: string; href?: string; to?: string }[]
    note?: string
    copy?: string
    logoSrc?: string
  }>(),
  {
    motto: 'Ride · Respect · Enjoy',
    copy: 'Paola Biker · Rodando con propósito',
    logoSrc: '/kit-assets/logo.png',
  },
)
</script>

<template>
  <footer class="site-footer">
    <div class="site-footer__brand">
      <img :src="logoSrc" width="40" height="40" alt="Paola" />
      <p class="meta" style="margin: 0">{{ motto }}</p>
    </div>
    <div class="site-footer__links">
      <AppLink v-for="link in links" :key="(link.to ?? link.href) + link.label" :to="link.to" :href="link.href">
        {{ link.label }}
      </AppLink>
      <span v-if="note" style="color: var(--muted)">{{ note }}</span>
    </div>
    <p class="site-footer__copy">{{ copy }}</p>
  </footer>
</template>
