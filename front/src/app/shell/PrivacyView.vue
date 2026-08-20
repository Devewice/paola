<script setup lang="ts">
import { LEGAL_COPY, LEGAL_SECTIONS } from '@app/constants/legal.ts'
import { usePageReveal } from '@shared/motion/usePageReveal.ts'
import AficheHero from '@ui/AficheHero.vue'
import Alert from '@ui/Alert.vue'

const copy = LEGAL_COPY
const bindReveal = usePageReveal()
</script>

<template>
  <div :ref="bindReveal">
    <AficheHero :kicker="copy.kicker" :title="copy.title" data-reveal>
      <template #lead>{{ copy.lead }}</template>
    </AficheHero>

    <article class="paola-page paola-page--after-hero">
      <Alert tone="info" data-reveal>{{ copy.notLegalAdvice }}</Alert>

      <section
        v-for="section in LEGAL_SECTIONS"
        :id="section.id"
        :key="section.id"
        class="paola-page__block paola-page__block--anchor"
        data-reveal
      >
        <h2 class="paola-page__heading type-display">{{ section.title }}</h2>
        <p
          v-for="paragraph in section.paragraphs"
          :key="paragraph"
          class="paola-page__copy"
        >
          {{ paragraph }}
        </p>
      </section>

      <Alert tone="warn" data-reveal>{{ copy.moderationShort }}</Alert>
      <p class="paola-page__copy paola-page__copy--muted" data-reveal>{{ copy.contactLine }}</p>
    </article>
  </div>
</template>
