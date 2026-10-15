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

    <main class="wrap board-shell board">
      <Alert tone="info" data-reveal>{{ copy.notLegalAdvice }}</Alert>

      <div class="board-split">
        <div class="board-main legal-list board-grid--numbered">
          <section
            v-for="section in LEGAL_SECTIONS"
            :id="section.id"
            :key="section.id"
            class="board-card legal-list__item"
            data-reveal
          >
            <h2>{{ section.title }}</h2>
            <p v-for="paragraph in section.paragraphs" :key="paragraph">{{ paragraph }}</p>
          </section>
        </div>

        <aside class="board-rail">
          <nav class="poster poster--navy legal-toc" :aria-label="copy.tocAria">
            <h2 class="type-brush-dry type-brush-dry--xs">{{ copy.tocTitle }}</h2>
            <ol>
              <li v-for="section in LEGAL_SECTIONS" :key="section.id">
                <a :href="`#${section.id}`">{{ section.title }}</a>
              </li>
            </ol>
          </nav>
          <Alert tone="warn">{{ copy.moderationShort }}</Alert>
          <p class="meta-text legal-contact">{{ copy.contactLine }}</p>
        </aside>
      </div>
    </main>
  </div>
</template>

<style scoped>
.legal-list__item {
  padding: clamp(18px, 2.6vw, 24px);
  scroll-margin-top: 96px;
}

.legal-list__item h2 {
  margin: 0;
  font-family: var(--display, 'Oswald', sans-serif);
  font-size: clamp(20px, 2.4vw, 24px);
  font-weight: 500;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

.legal-list__item p {
  max-width: 68ch;
  font-size: 15px;
  line-height: 1.6;
}

.legal-toc ol {
  display: grid;
  gap: 4px;
  margin: 0;
  padding: 0;
  list-style: none;
  counter-reset: toc;
}

.legal-toc li {
  counter-increment: toc;
}

.legal-toc a {
  display: flex;
  gap: 10px;
  align-items: baseline;
  padding: 6px 8px;
  border-radius: 8px;
  color: rgba(234, 242, 255, 0.85);
  font-size: 14px;
  text-decoration: none;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.legal-toc a::before {
  content: counter(toc, decimal-leading-zero);
  flex: none;
  font-family: var(--display, 'Oswald', sans-serif);
  color: var(--cyan, #48b4fc);
}

.legal-toc a:hover,
.legal-toc a:focus-visible {
  background: rgba(72, 180, 252, 0.12);
  color: var(--white, #fff);
}

.legal-contact {
  margin: 0;
}

@media (max-width: 959px) {
  .legal-toc {
    display: none;
  }
}
</style>
