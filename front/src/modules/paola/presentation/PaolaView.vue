<script setup lang="ts">
import { computed, ref, type ComponentPublicInstance } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { PaolaModule } from '@modules/paola/index.ts'
import { PAOLA_HERO_PHOTO, PAOLA_VIEW_COPY } from '@modules/paola/constants/copy.ts'
import { staggerReveal } from '@shared/motion/staggerReveal.ts'
import { usePaolaGsap } from '@shared/motion/usePaolaGsap.ts'
import Button from '@ui/Button.vue'
import Icon from '@ui/Icon.vue'
import RoadLightsBackdrop from '@ui/RoadLightsBackdrop.vue'

const props = defineProps<{
  module: PaolaModule
}>()

const page = props.module.getPage()
const copy = PAOLA_VIEW_COPY
const root = ref<HTMLElement | null>(null)
const shot = ref<HTMLImageElement | null>(null)

const titleParts = computed(() => {
  const parts = copy.title.trim().split(/\s+/)
  if (parts.length >= 2) {
    return { main: parts[0]!, accent: parts.slice(1).join(' ') }
  }
  return { main: copy.title, accent: '' }
})

usePaolaGsap(() => {
  const nodes = root.value?.querySelectorAll('[data-reveal]')
  if (nodes?.length) staggerReveal(nodes)

  const img = shot.value
  const shell = root.value
  if (!img || !shell) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  if (window.matchMedia('(max-width: 959px)').matches) return

  gsap.fromTo(
    img,
    { yPercent: 0 },
    {
      yPercent: 5,
      ease: 'none',
      scrollTrigger: {
        trigger: shell,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.65,
      },
    },
  )
  ScrollTrigger.refresh()
}, root)

function bindRoot(el: Element | ComponentPublicInstance | null): void {
  root.value = el instanceof HTMLElement ? el : null
}
</script>

<template>
  <div :ref="bindRoot" class="paola-who">
    <RoadLightsBackdrop />
    <div class="paola-who__rail">
      <div class="paola-who__main">
        <header class="paola-who__intro" data-reveal>
          <p class="type-brush-script">{{ copy.kicker }}</p>
          <div class="paola-who__brush">
            <p class="type-brush-dry type-brush-dry--sm">{{ titleParts.main }}</p>
            <p
              v-if="titleParts.accent"
              class="type-brush-dry type-brush-dry--blue type-brush-dry--sm"
            >
              {{ titleParts.accent }}
            </p>
          </div>
          <p class="type-condensed type-condensed--blue paola-who__plate">{{ copy.plate }}</p>
          <div class="brush-divider brush-divider--thin paola-who__divider" aria-hidden="true">
            <svg viewBox="0 0 800 12" preserveAspectRatio="none">
              <g fill="none" stroke-linecap="round">
                <path
                  stroke="#0088F8"
                  stroke-width="2.8"
                  d="M0,6 L32,5 M42,7 L78,4 M88,6 L124,5 M134,7 L170,4 M180,6 L216,5 M226,7 L262,4 M272,6 L308,5 M318,7 L354,4 M364,6 L400,5 M410,7 L446,4 M456,6 L492,5 M502,7 L538,4 M548,6 L584,5 M594,7 L630,4 M640,6 L676,5 M686,7 L722,4 M732,6 L768,5 M778,7 L800,4"
                />
              </g>
            </svg>
          </div>
          <p class="paola-who__lead">{{ copy.lead }}</p>
          <div class="paola-who__cta">
            <Button variant="hero" :href="`mailto:${page.contact.email}`">{{ copy.writeCta }}</Button>
            <Button variant="ghost" :href="page.contact.whatsapp.href" target="_blank">
              {{ page.contact.whatsapp.label }}
            </Button>
          </div>
        </header>

        <img
          class="paola-who__shot paola-who__shot--mobile"
          :src="PAOLA_HERO_PHOTO"
          :alt="copy.photoAlt"
          width="720"
          height="900"
          data-reveal
        />

        <section
          id="quien"
          class="paola-who__story"
          :aria-label="copy.narrativeLabel"
          data-reveal
        >
          <article
            v-for="section in page.narrative"
            :id="section.id"
            :key="section.id"
            class="paola-who__q"
          >
            <h2 class="paola-page__heading type-display">{{ section.title }}</h2>
            <p class="paola-page__copy">{{ section.body }}</p>
          </article>
        </section>

        <section
          id="contacto"
          class="paola-who__contact"
          :aria-label="copy.contactLabel"
          data-reveal
        >
          <h2 class="paola-page__heading type-display">{{ copy.contactHeading }}</h2>
          <p class="paola-page__copy paola-page__copy--muted">{{ copy.contactLead }}</p>

          <div class="paola-who__actions">
            <Button :href="page.contact.whatsapp.href" target="_blank">
              {{ page.contact.whatsapp.label }}
            </Button>
            <a class="paola-who__mail" :href="`mailto:${page.contact.email}`">
              <Icon name="chat" size="sm" :circle="false" />
              {{ page.contact.email }}
            </a>
          </div>

          <h3 class="paola-who__social-label">{{ copy.socialHeading }}</h3>
          <ul class="paola-who__social">
            <li v-for="link in page.contact.social" :key="link.id">
              <a :href="link.href" target="_blank" rel="noopener noreferrer">{{ link.label }}</a>
            </li>
          </ul>

          <p class="paola-page__copy paola-page__copy--muted paola-who__closing">
            {{ copy.closing }}
          </p>
        </section>
      </div>

      <aside class="paola-who__stage" aria-hidden="true">
        <div class="paola-who__stage-sticky">
          <img
            ref="shot"
            class="paola-who__shot paola-who__shot--desktop"
            :src="PAOLA_HERO_PHOTO"
            alt=""
            width="900"
            height="1125"
          />
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.paola-who {
  position: relative;
  width: 100%;
  overflow: clip;
  background: #05070c;
}

.paola-who__rail {
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  gap: calc(var(--paola-space) * 3);
  width: min(var(--paola-content-max), calc(100% - 2 * var(--paola-gutter)));
  margin-inline: auto;
  padding: calc(64px + var(--paola-space) * 2) 0 calc(var(--paola-space) * 3);
}

.paola-who__main {
  min-width: 0;
  display: grid;
  gap: calc(var(--paola-space) * 5);
  max-width: 38rem;
  position: relative;
  z-index: 5;
}

.paola-who__main::before {
  content: "";
  position: absolute;
  inset: -12px -16px;
  z-index: -1;
  border-radius: 16px;
  background: linear-gradient(
    90deg,
    rgba(5, 7, 12, 0.72) 0%,
    rgba(5, 7, 12, 0.45) 70%,
    rgba(5, 7, 12, 0.12) 100%
  );
  pointer-events: none;
}

.paola-who__intro {
  display: grid;
  gap: 0;
}

.paola-who__brush {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0 12px;
  margin-top: 18px;
}

.paola-who__plate {
  margin: 8px 0 0;
  font-size: clamp(18px, 3.6vw, 28px);
  max-width: 22ch;
  line-height: 1.15;
}

.paola-who__divider {
  margin: 20px 0 16px;
  max-width: 480px;
}

.paola-who__lead {
  margin: 0 0 24px;
  max-width: 42ch;
  font-size: 16px;
  line-height: 1.5;
  color: var(--paola-muted);
}

.paola-who__cta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.paola-who__stage {
  display: none;
}

.paola-who__shot {
  display: block;
  width: 100%;
  height: auto;
  object-fit: contain;
  filter: drop-shadow(0 0 28px rgba(72, 180, 252, 0.28));
}

.paola-who__shot--mobile {
  max-height: min(58vh, 480px);
  object-position: center bottom;
  margin-inline: auto;
}

.paola-who__shot--desktop {
  display: none;
}

.paola-who__story {
  display: grid;
  gap: calc(var(--paola-space) * 4);
}

.paola-who__q {
  scroll-margin-top: 88px;
  display: grid;
  gap: 12px;
}

.paola-who__q + .paola-who__q {
  padding-top: calc(var(--paola-space) * 3);
  border-top: 1px solid var(--paola-line);
}

.paola-who__contact {
  scroll-margin-top: 88px;
  display: grid;
  gap: 12px;
  padding-top: calc(var(--paola-space) * 2);
  border-top: 1px solid var(--paola-line);
}

.paola-who__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 20px;
  margin-top: 4px;
}

.paola-who__mail {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--paola-cyan);
  font-size: 14px;
  text-decoration: none;
}

.paola-who__mail:hover {
  color: var(--paola-white);
  text-decoration: underline;
}

.paola-who__social-label {
  margin: 12px 0 0;
  font-family: var(--paola-font-display);
  font-size: 13px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--paola-muted);
}

.paola-who__social {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 10px 18px;
}

.paola-who__social a {
  color: var(--paola-cyan);
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  font-size: 13px;
  text-decoration: none;
}

.paola-who__social a:hover {
  color: var(--paola-white);
  text-decoration: underline;
}

.paola-who__closing {
  margin-top: 8px;
}

@media (min-width: 960px) {
  .paola-who__rail {
    grid-template-columns: minmax(0, 1fr) minmax(42vw, 52%);
    gap: 0;
    width: 100%;
    max-width: none;
    margin: 0;
    padding: 0;
    align-items: stretch;
    min-height: 100%;
  }

  .paola-who__main {
    padding: calc(64px + var(--paola-space) * 2) var(--paola-gutter) calc(var(--paola-space) * 3);
    max-width: none;
    width: min(38rem, 100%);
    justify-self: end;
  }

  .paola-who__shot--mobile {
    display: none;
  }

  .paola-who__stage {
    display: block;
    position: relative;
    z-index: 1;
    align-self: stretch;
    min-height: 100%;
    background: transparent;
  }

  .paola-who__stage::after {
    content: none;
  }

  .paola-who__stage-sticky {
    position: sticky;
    top: 0;
    height: 100vh;
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    overflow: hidden;
    pointer-events: none;
    background: transparent;
  }

  .paola-who__shot--desktop {
    display: block;
    width: auto;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    object-position: right bottom;
    mix-blend-mode: lighten;
    will-change: transform;
  }
}
</style>
