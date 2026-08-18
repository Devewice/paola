<script setup lang="ts">
import type { PaolaModule } from '@modules/paola/index.ts'
import PaolaAlert from '@ui/PaolaAlert.vue'
import PaolaButton from '@ui/PaolaButton.vue'
import PaolaCard from '@ui/PaolaCard.vue'
import PaolaVoiceBadge from '@ui/PaolaVoiceBadge.vue'

const props = defineProps<{
  module: PaolaModule
}>()

const page = props.module.getPage()
</script>

<template>
  <article class="paola-page">
    <header class="paola-page__hero">
      <img
        class="paola-page__logo"
        src="/logo.png"
        alt="Paola — Rodando con propósito"
        width="140"
        height="140"
      />
      <p class="paola-empty__kicker">Paola Armargura</p>
      <h1 class="paola-page__title type-display">Paola</h1>
      <p class="paola-page__tagline">{{ page.contact.domain }}</p>
    </header>

    <section class="paola-page__narrative" aria-label="Relato">
      <PaolaVoiceBadge voice="armargura" />
      <div v-for="section in page.narrative" :key="section.id" class="paola-page__block">
        <h2 class="paola-page__heading type-display">{{ section.title }}</h2>
        <p class="paola-page__copy">{{ section.body }}</p>
      </div>
    </section>

    <section class="paola-page__contact" aria-label="Contacto">
      <PaolaVoiceBadge voice="loigca" />
      <h2 class="paola-page__heading type-display">Escríbeme</h2>
      <p class="paola-page__copy">
        Correo activo. WhatsApp y redes van cuando Paola los publique — sin inventar links.
      </p>
      <div class="paola-page__actions">
        <PaolaButton :href="`mailto:${page.contact.email}`">Escribirle a Paola</PaolaButton>
        <PaolaButton variant="ghost" disabled>{{ page.contact.whatsapp.label }}</PaolaButton>
      </div>
      <p class="paola-page__meta">
        <a :href="`mailto:${page.contact.email}`">{{ page.contact.email }}</a>
      </p>
    </section>

    <section class="paola-page__media" aria-label="Video y redes">
      <PaolaCard>
        <p class="paola-empty__kicker">Cámara Incauta</p>
        <h2 class="paola-page__heading type-display">Video</h2>
        <PaolaAlert tone="info">{{ page.contact.video.label }}</PaolaAlert>
        <p class="paola-page__copy paola-page__copy--muted">
          Cuando haya URL, va aquí. No un hueco mudo.
        </p>
      </PaolaCard>

      <PaolaCard>
        <p class="paola-empty__kicker">Moto Loigca</p>
        <h2 class="paola-page__heading type-display">Redes</h2>
        <PaolaAlert tone="info">{{ page.contact.social.label }}</PaolaAlert>
        <p class="paola-page__copy paola-page__copy--muted">
          Links reales cuando Paola los defina en docs.
        </p>
      </PaolaCard>
    </section>
  </article>
</template>

<style scoped>
.paola-page {
  max-width: 40rem;
  margin: 0 auto;
  padding: calc(var(--paola-space) * 4) calc(var(--paola-space) * 2)
    calc(var(--paola-space) * 8);
  display: grid;
  gap: calc(var(--paola-space) * 5);
}

.paola-page__hero {
  text-align: center;
}

.paola-page__logo {
  display: block;
  width: 140px;
  height: 140px;
  margin: 0 auto calc(var(--paola-space) * 3);
  object-fit: contain;
}

.paola-page__title {
  margin: 0 0 8px;
  font-size: 40px;
}

.paola-page__tagline {
  margin: 0;
  font-size: 13px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--paola-muted);
}

.paola-page__narrative,
.paola-page__contact,
.paola-page__media {
  display: grid;
  gap: calc(var(--paola-space) * 2);
}

.paola-page__block + .paola-page__block {
  padding-top: calc(var(--paola-space) * 2);
  border-top: 1px solid var(--paola-line);
}

.paola-page__heading {
  margin: 0 0 12px;
  font-size: 22px;
}

.paola-page__copy {
  margin: 0;
  font-size: 16px;
  line-height: 1.6;
  color: var(--paola-white);
}

.paola-page__copy--muted {
  color: var(--paola-muted);
  font-size: 14px;
}

.paola-page__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.paola-page__meta {
  margin: 0;
  font-size: 14px;
}

.paola-page__meta a {
  color: var(--paola-cyan);
}

.paola-page__media {
  grid-template-columns: 1fr;
  gap: calc(var(--paola-space) * 3);
}

@media (min-width: 640px) {
  .paola-page__media {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
