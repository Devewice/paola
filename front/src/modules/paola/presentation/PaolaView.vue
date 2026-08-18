<script setup lang="ts">
import type { PaolaModule } from '@modules/paola/index.ts'
import { usePageReveal } from '@shared/motion/usePageReveal.ts'
import PaolaAficheHero from '@ui/PaolaAficheHero.vue'
import PaolaButton from '@ui/PaolaButton.vue'
import PaolaCard from '@ui/PaolaCard.vue'
import PaolaIcon from '@ui/PaolaIcon.vue'
import PaolaShareRow from '@ui/PaolaShareRow.vue'
import PaolaVoiceBadge from '@ui/PaolaVoiceBadge.vue'
import PaolaWaStrip from '@ui/PaolaWaStrip.vue'

const props = defineProps<{
  module: PaolaModule
}>()

const page = props.module.getPage()
const bindReveal = usePageReveal()
const shareUrl = `https://${page.contact.domain}/paola`
</script>

<template>
  <article :ref="bindReveal" class="paola-page">
    <PaolaAficheHero kicker="Paola Armargura" title="Paola" plate="Usme" logo data-reveal>
      <template #lead>{{ page.contact.domain }}</template>
      <template #actions>
        <PaolaButton variant="hero" :href="`mailto:${page.contact.email}`">Escribirle a Paola</PaolaButton>
        <PaolaButton variant="ghost" :href="page.contact.whatsapp.href" target="_blank">
          {{ page.contact.whatsapp.label }}
        </PaolaButton>
      </template>
    </PaolaAficheHero>

    <section class="paola-page__narrative" aria-label="Relato" data-reveal>
      <PaolaVoiceBadge voice="armargura" />
      <PaolaCard v-for="section in page.narrative" :key="section.id">
        <h2 class="paola-page__heading type-display">{{ section.title }}</h2>
        <p class="paola-page__copy">{{ section.body }}</p>
      </PaolaCard>
    </section>

    <section class="paola-page__block" aria-label="Contacto" data-reveal>
      <PaolaVoiceBadge voice="loigca" />
      <h2 class="paola-page__heading type-display">Escríbeme</h2>
      <p class="paola-page__copy">Correo o WhatsApp. Te responde Paola.</p>
      <PaolaWaStrip title="WhatsApp de Paola" copy="El parche caliente vive aquí.">
        <PaolaButton :href="page.contact.whatsapp.href" target="_blank">
          {{ page.contact.whatsapp.label }}
        </PaolaButton>
      </PaolaWaStrip>
      <p class="paola-page__meta">
        <PaolaIcon name="chat" size="sm" />
        <a :href="`mailto:${page.contact.email}`">{{ page.contact.email }}</a>
      </p>
      <PaolaShareRow :url="shareUrl" />
      <p class="paola-page__copy paola-page__copy--muted">
        <router-link to="/operar">Si eres Paola: lista de cupos</router-link>
      </p>
    </section>

    <section class="paola-page__media" aria-label="Video y redes" data-reveal>
      <PaolaCard>
        <PaolaIcon name="camera" />
        <p class="paola-empty__kicker">Cámara Incauta</p>
        <h2 class="paola-page__heading type-display">Video</h2>
        <p class="paola-page__copy paola-page__copy--muted">
          Canal de YouTube. Un video suelto para embeber, cuando Paola lo elija.
        </p>
        <PaolaButton size="sm" :href="page.contact.youtube.href" target="_blank">
          Ver en YouTube
        </PaolaButton>
      </PaolaCard>

      <PaolaCard>
        <PaolaIcon name="share" />
        <p class="paola-empty__kicker">Moto Loigca</p>
        <h2 class="paola-page__heading type-display">Redes</h2>
        <ul class="paola-page__social">
          <li v-for="link in page.contact.social" :key="link.id">
            <a :href="link.href" target="_blank" rel="noopener noreferrer">{{ link.label }}</a>
          </li>
        </ul>
      </PaolaCard>
    </section>
  </article>
</template>

<style scoped>
.paola-page__narrative {
  display: grid;
  gap: calc(var(--paola-space) * 2);
}

.paola-page__meta {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.paola-page__meta a {
  color: var(--paola-cyan);
}

.paola-page__social {
  list-style: none;
  margin: 12px 0 0;
  padding: 0;
  display: grid;
  gap: 10px;
}

.paola-page__social a {
  color: var(--paola-cyan);
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  font-size: 13px;
  text-decoration: none;
}

.paola-page__social a:hover {
  color: var(--paola-white);
  text-decoration: underline;
}

.paola-page__media {
  display: grid;
  grid-template-columns: 1fr;
  gap: calc(var(--paola-space) * 3);
}

.paola-page__media .paola-page__heading {
  margin-top: 12px;
}

@media (min-width: 640px) {
  .paola-page__media {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
