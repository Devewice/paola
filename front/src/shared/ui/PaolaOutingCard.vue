<script setup lang="ts">
import PaolaChip from '@ui/PaolaChip.vue'
import PaolaIcon from '@ui/PaolaIcon.vue'

withDefaults(
  defineProps<{
    title: string
    date: string
    kind: 'rodada' | 'actividad'
    status: 'abierto' | 'lleno' | 'cerrado' | 'realizado'
    meetingPoint: string
    routeText: string
    capacity: number
    taken?: number
    whatToBring: string
    paid: boolean
  }>(),
  { taken: 0 },
)
</script>

<template>
  <article class="paola-outing">
    <div class="paola-outing__head">
      <PaolaChip :tone="status">{{ status }}</PaolaChip>
      <span class="paola-outing__kind">{{ kind === 'rodada' ? 'Rodada' : 'Actividad' }}</span>
    </div>
    <h3 class="paola-outing__title">{{ title }}</h3>
    <p class="paola-outing__meta">
      <PaolaIcon name="pin" size="sm" :circle="false" />
      {{ date }} · {{ meetingPoint }}
    </p>
    <p v-if="routeText" class="paola-outing__copy">{{ routeText }}</p>
    <p class="paola-outing__meta">
      Cupo {{ taken }} / {{ capacity }} · {{ paid ? 'De pago · se avisa por WhatsApp' : 'Gratis' }}
    </p>
    <p v-if="whatToBring" class="paola-outing__copy">Llevar: {{ whatToBring }}</p>
    <slot />
  </article>
</template>
