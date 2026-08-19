<script setup lang="ts">
import { LEGAL_COPY, LEGAL_SECTIONS } from '@app/constants/legal.ts'
import Alert from '@ui/Alert.vue'

const copy = LEGAL_COPY
</script>

<template>
  <article class="paola-page">
    <header>
      <p class="paola-empty__kicker">{{ copy.kicker }}</p>
      <h1 class="paola-afiche__title type-display">{{ copy.title }}</h1>
      <p class="paola-page__copy paola-page__copy--muted">{{ copy.lead }}</p>
    </header>

    <Alert tone="info">{{ copy.notLegalAdvice }}</Alert>

    <section
      v-for="section in LEGAL_SECTIONS"
      :id="section.id"
      :key="section.id"
      class="paola-page__block"
    >
      <h2 class="paola-page__heading type-display">{{ section.title }}</h2>
      <p v-for="paragraph in section.paragraphs" :key="paragraph" class="paola-page__copy">
        {{ paragraph }}
      </p>
    </section>

    <Alert tone="warn">{{ copy.moderationShort }}</Alert>
    <p class="paola-page__copy paola-page__copy--muted">{{ copy.contactLine }}</p>
  </article>
</template>

<style scoped>
.paola-page__block[id] {
  scroll-margin-top: 80px;
}
</style>
