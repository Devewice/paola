<script setup lang="ts">
import { computed } from 'vue'
import { CUENTA_COPY, CUENTA_NAV_COPY, CUENTA_SECTIONS_COPY } from '@app/constants/cuenta.ts'
import { useCuenta } from '@app/shell/cuenta/context.ts'
import { APP_PATHS } from '@shared/http/constants.ts'
import { MASCOT } from '@shared/ui/mascot.ts'
import Button from '@ui/Button.vue'
import Empty from '@ui/Empty.vue'
import './cuenta-card.css'

const copy = CUENTA_COPY
const sections = CUENTA_SECTIONS_COPY
const { panel } = useCuenta()
const orders = computed(() => panel.value?.orders ?? [])
</script>

<template>
  <section class="cuenta-card" aria-labelledby="cuenta-pedidos-title" data-reveal>
    <header class="cuenta-card__head">
      <span class="board-kicker">{{ CUENTA_NAV_COPY.ordersNote }}</span>
      <h2 id="cuenta-pedidos-title" class="cuenta-card__title">{{ sections.ordersTitle }}</h2>
      <p class="meta-text">{{ sections.ordersLead }}</p>
    </header>

    <ul v-if="orders.length" class="cuenta-rows">
      <li v-for="order in orders" :key="order.id" class="cuenta-row">
        <div class="cuenta-row__info">
          <strong class="cuenta-row__title">{{ order.itemTitle ?? order.item_title }}</strong>
        </div>
        <span class="cuenta-row__badge">{{ order.status }}</span>
      </li>
    </ul>
    <Empty
      v-else
      compact
      hide-cta
      :title="copy.ordersEmptyTitle"
      :copy="copy.ordersEmpty"
      :mascot-src="MASCOT.EN_PIE"
    />

    <div class="cuenta-card__actions">
      <Button size="sm" variant="ghost" :to="APP_PATHS.TIENDA">{{ sections.ordersBrowse }}</Button>
    </div>
  </section>
</template>
