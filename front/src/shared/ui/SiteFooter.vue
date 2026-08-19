<script setup lang="ts">
defineProps<{
  motto?: string
  links?: readonly { label: string; href: string }[]
  note?: string
  copy?: string
}>()
</script>

<template>
  <footer class="site-footer">
    <div class="site-footer__brand">
      <img src="/kit-assets/logo.png" width="40" height="40" alt="Paola" />
      <p class="meta" style="margin: 0">{{ motto ?? 'Ride · Respect · Enjoy' }}</p>
    </div>
    <div class="site-footer__links">
      <a v-for="link in links" :key="link.href" :href="link.href">{{ link.label }}</a>
      <span v-if="note" style="color: var(--muted)">{{ note }}</span>
    </div>
    <p class="site-footer__copy">{{ copy ?? 'Paola Biker · Rodando con propósito' }}</p>
  </footer>
</template>
