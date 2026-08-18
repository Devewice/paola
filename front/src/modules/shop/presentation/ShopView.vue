<script setup lang="ts">
import { computed } from 'vue'
import type { ShopModule } from '@modules/shop/index.ts'
import { formatProductPrice } from '@modules/shop/presentation/formatPrice.ts'
import { usePageReveal } from '@shared/motion/usePageReveal.ts'
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
const contact = computed(() => props.module.getContact())
const bindReveal = usePageReveal()
</script>

<template>
  <article :ref="bindReveal" class="paola-page">
    <PaolaAficheHero kicker="Oficio" title="Tienda" plate="Tienda" data-reveal>
      <template #lead>
        Piezas propias y colaboraciones en estanterías distintas. Sin checkout: se le escribe a Paola.
      </template>
      <template #actions>
        <PaolaButton variant="hero" :href="contact.whatsappHref" target="_blank">
          Escribirle a Paola
        </PaolaButton>
        <PaolaButton variant="ghost" :href="`mailto:${contact.email}`">Correo</PaolaButton>
      </template>
    </PaolaAficheHero>

    <section class="paola-page__block" aria-label="Reglas" data-reveal>
      <PaolaVoiceBadge voice="loigca" />
      <h2 class="paola-page__heading type-display">Reglas</h2>
      <div class="shop-page__zones">
        <PaolaZoneBadge zone="bogota" />
        <PaolaZoneBadge zone="soacha" />
        <PaolaZoneBadge zone="fuera" />
      </div>
      <PaolaAlert tone="info">{{ shelves.deliveryCopy }}</PaolaAlert>
      <PaolaAlert tone="warn">{{ shelves.warrantyCopy }}</PaolaAlert>
    </section>

    <section class="paola-page__block" aria-label="Marca propia" data-reveal>
      <PaolaVoiceBadge voice="loigca" />
      <h2 class="paola-page__heading type-display">Marca propia</h2>
      <div v-if="shelves.own.length" class="shop-page__shelf">
        <PaolaProductCard
          v-for="item in shelves.own"
          :key="item.id"
          :title="item.title"
          :price="formatProductPrice(item.priceCop)"
          :photo-src="item.photoSrc"
          :to="`/tienda/${item.id}`"
        />
      </div>
      <PaolaEmpty
        v-else
        compact
        hide-cta
        title="Sin piezas propias"
        :copy="shelves.emptyOwnCopy"
        mascot-src="/mascota/tumbada.png"
      />
    </section>

    <section class="paola-page__block" aria-label="Colaboraciones" data-reveal>
      <PaolaVoiceBadge voice="incauta" />
      <h2 class="paola-page__heading type-display">Colaboraciones</h2>
      <p class="paola-page__copy paola-page__copy--muted">
        Estantería aparte. Nunca en la misma ficha que lo propio.
      </p>
      <div v-if="shelves.collab.length" class="shop-page__shelf">
        <PaolaProductCard
          v-for="item in shelves.collab"
          :key="item.id"
          :title="item.title"
          :price="formatProductPrice(item.priceCop)"
          :photo-src="item.photoSrc"
          :to="`/tienda/${item.id}`"
          collab
        />
      </div>
      <PaolaEmpty
        v-else
        compact
        hide-cta
        title="Sin collab"
        :copy="shelves.emptyCollabCopy"
        mascot-src="/mascota/en-pie.png"
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

@media (min-width: 640px) {
  .shop-page__shelf {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
