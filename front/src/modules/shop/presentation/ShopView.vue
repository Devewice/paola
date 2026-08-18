<script setup lang="ts">
import { computed } from 'vue'
import { LEGAL_COPY } from '@app/constants/legal.ts'
import { SHOP_COPY } from '@modules/shop/constants/copy.ts'
import type { ShopModule } from '@modules/shop/index.ts'
import { formatProductPrice } from '@modules/shop/presentation/formatPrice.ts'
import { APP_PATHS, appTiendaFicha, appTiendaServicio } from '@shared/http/constants.ts'
import { usePageReveal } from '@shared/motion/usePageReveal.ts'
import { MASCOT } from '@shared/ui/mascot.ts'
import PaolaAficheHero from '@ui/PaolaAficheHero.vue'
import PaolaAlert from '@ui/PaolaAlert.vue'
import PaolaButton from '@ui/PaolaButton.vue'
import PaolaEmpty from '@ui/PaolaEmpty.vue'
import PaolaProductCard from '@ui/PaolaProductCard.vue'
import PaolaVoiceBadge from '@ui/PaolaVoiceBadge.vue'
import PaolaZoneBadge from '@ui/PaolaZoneBadge.vue'

const props = defineProps<{
  module: ShopModule
}>()

const shelves = computed(() => props.module.getShelves())
const services = computed(() => props.module.getServices())
const contact = computed(() => props.module.getContact())
const bindReveal = usePageReveal()
const copy = SHOP_COPY
const legal = LEGAL_COPY
const mascot = MASCOT
const privacyPath = `${APP_PATHS.PRIVACIDAD}`
</script>

<template>
  <article :ref="bindReveal" class="paola-page">
    <PaolaAficheHero :kicker="copy.kicker" :title="copy.title" :plate="copy.plate" data-reveal>
      <template #lead>
        {{ copy.lead }}
      </template>
      <template #actions>
        <PaolaButton variant="hero" :href="contact.whatsappHref" target="_blank">
          {{ copy.writeCta }}
        </PaolaButton>
        <PaolaButton variant="ghost" :href="`mailto:${contact.email}`">{{ copy.mailCta }}</PaolaButton>
      </template>
    </PaolaAficheHero>

    <section class="paola-page__block" :aria-label="copy.rulesAria" data-reveal>
      <PaolaVoiceBadge voice="loigca" />
      <h2 class="paola-page__heading type-display">{{ copy.rulesHeading }}</h2>
      <div class="shop-page__zones">
        <PaolaZoneBadge zone="bogota" />
        <PaolaZoneBadge zone="soacha" />
        <PaolaZoneBadge zone="fuera" />
      </div>
      <PaolaAlert tone="info">{{ shelves.deliveryCopy }}</PaolaAlert>
      <PaolaAlert tone="warn">{{ shelves.warrantyCopy }}</PaolaAlert>
      <p class="paola-page__copy">
        <router-link class="shop-page__legal" :to="privacyPath">{{ legal.shopLink }}</router-link>
      </p>
    </section>

    <section class="paola-page__block" :aria-label="copy.serviceAria" data-reveal>
      <PaolaVoiceBadge voice="loigca" />
      <h2 class="paola-page__heading type-display">{{ copy.serviceHeading }}</h2>
      <div v-if="services.items.length" class="shop-page__shelf">
        <PaolaProductCard
          v-for="item in services.items"
          :key="item.id"
          :title="item.title"
          :price="formatProductPrice(item.priceCop)"
          :media-label="copy.serviceMediaLabel"
          :to="appTiendaServicio(item.id)"
        />
      </div>
      <PaolaEmpty
        v-else
        compact
        hide-cta
        :title="copy.serviceEmptyTitle"
        :copy="services.emptyCopy"
        :mascot-src="mascot.TUMBADA"
      />
    </section>

    <section class="paola-page__block" :aria-label="copy.ownAria" data-reveal>
      <PaolaVoiceBadge voice="loigca" />
      <h2 class="paola-page__heading type-display">{{ copy.ownHeading }}</h2>
      <div v-if="shelves.own.length" class="shop-page__shelf">
        <PaolaProductCard
          v-for="item in shelves.own"
          :key="item.id"
          :title="item.title"
          :price="formatProductPrice(item.priceCop)"
          :photo-src="item.photoSrc"
          :to="appTiendaFicha(item.id)"
        />
      </div>
      <PaolaEmpty
        v-else
        compact
        hide-cta
        :title="copy.ownEmptyTitle"
        :copy="shelves.emptyOwnCopy"
        :mascot-src="mascot.TUMBADA"
      />
    </section>

    <section class="paola-page__block" :aria-label="copy.collabAria" data-reveal>
      <PaolaVoiceBadge voice="incauta" />
      <h2 class="paola-page__heading type-display">{{ copy.collabHeading }}</h2>
      <p class="paola-page__copy paola-page__copy--muted">
        {{ copy.collabNote }}
      </p>
      <div v-if="shelves.collab.length" class="shop-page__shelf">
        <PaolaProductCard
          v-for="item in shelves.collab"
          :key="item.id"
          :title="item.title"
          :price="formatProductPrice(item.priceCop)"
          :photo-src="item.photoSrc"
          :to="appTiendaFicha(item.id)"
          collab
        />
      </div>
      <PaolaEmpty
        v-else
        compact
        hide-cta
        :title="copy.collabEmptyTitle"
        :copy="shelves.emptyCollabCopy"
        :mascot-src="mascot.EN_PIE"
      />
    </section>
  </article>
</template>

<style scoped>
.shop-page__zones {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.shop-page__shelf {
  display: grid;
  gap: 12px;
}

.shop-page__legal {
  color: var(--paola-cyan, #48b4fc);
  text-decoration: underline;
  text-underline-offset: 2px;
}

@media (min-width: 640px) {
  .shop-page__shelf {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
