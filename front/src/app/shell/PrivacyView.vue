<script setup lang="ts">
import { LEGAL_COPY, LEGAL_SECTIONS } from '@app/constants/legal.ts'
import PaolaAlert from '@ui/PaolaAlert.vue'

const copy = LEGAL_COPY
</script>

<template>
  <article class="paola-page">
    <header>
      <p class="paola-empty__kicker">{{ copy.kicker }}</p>
      <h1 class="paola-afiche__title type-display">{{ copy.title }}</h1>
      <p class="paola-page__copy paola-page__copy--muted">{{ copy.lead }}</p>
    </header>

    <PaolaAlert tone="info">{{ copy.notLegalAdvice }}</PaolaAlert>

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

    <PaolaAlert tone="warn">{{ copy.moderationShort }}</PaolaAlert>
    <p class="paola-page__copy paola-page__copy--muted">{{ copy.contactLine }}</p>
  </article>
</template>

<style scoped>
.paola-page__block[id] {
  scroll-margin-top: 80px;
}
</style>
