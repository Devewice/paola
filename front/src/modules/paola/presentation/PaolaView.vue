<script setup lang="ts">
import type { PaolaModule } from '@modules/paola/index.ts'
import { APP_PATHS } from '@shared/http/constants.ts'
import { usePageReveal } from '@shared/motion/usePageReveal.ts'
import AficheHero from '@ui/AficheHero.vue'
import Button from '@ui/Button.vue'
import Card from '@ui/Card.vue'
import Icon from '@ui/Icon.vue'
import ShareRow from '@ui/ShareRow.vue'
import VoiceBadge from '@ui/VoiceBadge.vue'
import WaStrip from '@ui/WaStrip.vue'

const props = defineProps<{
  module: PaolaModule
}>()

const page = props.module.getPage()
const bindReveal = usePageReveal()
const shareUrl = `https://${page.contact.domain}/paola`
</script>

<template>
  <article :ref="bindReveal" class="paola-page">
    <AficheHero kicker="Paola Armargura" title="Paola" plate="Usme" logo data-reveal>
      <template #lead>{{ page.contact.domain }}</template>
      <template #actions>
        <Button variant="hero" :href="`mailto:${page.contact.email}`">Escribirle a Paola</Button>
        <Button variant="ghost" :href="page.contact.whatsapp.href" target="_blank">
          {{ page.contact.whatsapp.label }}
        </Button>
      </template>
    </AficheHero>

    <section class="paola-page__narrative" aria-label="Relato" data-reveal>
      <VoiceBadge voice="armargura" />
      <Card v-for="section in page.narrative" :key="section.id">
        <h2 class="paola-page__heading type-display">{{ section.title }}</h2>
        <p class="paola-page__copy">{{ section.body }}</p>
      </Card>
    </section>

    <section class="paola-page__block" aria-label="Contacto" data-reveal>
      <VoiceBadge voice="loigca" />
      <h2 class="paola-page__heading type-display">Escríbeme</h2>
      <p class="paola-page__copy">Correo o WhatsApp. Te responde Paola.</p>
      <WaStrip title="WhatsApp de Paola" copy="El grupo del día a día.">
        <Button :href="page.contact.whatsapp.href" target="_blank">
          {{ page.contact.whatsapp.label }}
        </Button>
      </WaStrip>
      <p class="paola-page__meta">
        <Icon name="chat" size="sm" />
        <a :href="`mailto:${page.contact.email}`">{{ page.contact.email }}</a>
      </p>
      <ShareRow :url="shareUrl" />
      <p class="paola-page__copy paola-page__copy--muted">
        <router-link :to="APP_PATHS.ADMIN">Si eres Paola: entrar a Admin</router-link>
      </p>
    </section>

    <section class="paola-page__media" aria-label="Video y redes" data-reveal>
      <Card>
        <Icon name="camera" />
        <p class="paola-empty__kicker">Cámara Incauta</p>
        <h2 class="paola-page__heading type-display">Video</h2>
        <p class="paola-page__copy paola-page__copy--muted">
          El canal de YouTube de Paola. Pronto va a haber un video aquí.
        </p>
        <Button size="sm" :href="page.contact.youtube.href" target="_blank">
          Ver en YouTube
        </Button>
      </Card>

      <Card>
        <Icon name="share" />
        <p class="paola-empty__kicker">Moto Loigca</p>
        <h2 class="paola-page__heading type-display">Redes</h2>
        <ul class="paola-page__social">
          <li v-for="link in page.contact.social" :key="link.id">
            <a :href="link.href" target="_blank" rel="noopener noreferrer">{{ link.label }}</a>
          </li>
        </ul>
      </Card>
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
