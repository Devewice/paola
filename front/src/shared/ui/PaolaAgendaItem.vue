<script setup lang="ts">
import PaolaChip from '@ui/PaolaChip.vue'

const props = defineProps<{
  date: string
  title: string
  kind: 'rodada' | 'actividad'
  point: string
  when: 'proxima' | 'pasada'
}>()

const months = [
  'Ene',
  'Feb',
  'Mar',
  'Abr',
  'May',
  'Jun',
  'Jul',
  'Ago',
  'Sep',
  'Oct',
  'Nov',
  'Dic',
] as const

const parts = () => {
  const [, month, day] = props.date.split('-')
  const monthIndex = Number(month) - 1
  return {
    day: day ?? '—',
    month: months[monthIndex] ?? '',
  }
}
</script>

<template>
  <article class="paola-agenda" :class="{ 'is-past': when === 'pasada' }">
    <p class="paola-agenda__date">
      <strong>{{ parts().day }}</strong>
      <span>{{ parts().month }}</span>
    </p>
    <div class="paola-agenda__body">
      <h3 class="paola-agenda__title">{{ title }}</h3>
      <p class="paola-agenda__meta">
        {{ kind === 'rodada' ? 'Rodada' : 'Actividad' }}
        · {{ point }}
      </p>
    </div>
    <PaolaChip :tone="when === 'pasada' ? 'realizado' : 'abierto'">
      {{ when === 'pasada' ? 'Pasada' : 'Próxima' }}
    </PaolaChip>
  </article>
</template>
