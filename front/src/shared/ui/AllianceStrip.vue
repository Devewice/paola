<script setup lang="ts">
import type { AllianceList } from '@modules/club/index.ts'

defineProps<{
  alliances: AllianceList
  kicker?: string
  title?: string
}>()
</script>

<template>
  <aside class="paola-alliances" aria-label="Alianzas">
    <p class="paola-alliances__kicker">{{ kicker ?? 'Alianzas' }}</p>
    <h2 class="paola-alliances__title type-display">{{ title ?? 'Quienes apoyan' }}</h2>
    <ul v-if="alliances.items.length" class="paola-alliances__list">
      <li v-for="ally in alliances.items" :key="ally.id" class="paola-alliances__item">
        <a v-if="ally.href" :href="ally.href" target="_blank" rel="noopener noreferrer">
          <strong>{{ ally.name }}</strong>
        </a>
        <strong v-else>{{ ally.name }}</strong>
        <span>{{ ally.support }}</span>
      </li>
    </ul>
    <p v-else class="paola-alliances__copy">{{ alliances.emptyCopy }}</p>
  </aside>
</template>
