<script setup lang="ts">
import Chip from '@ui/Chip.vue'

defineProps<{
  day: string
  month: string
  title: string
  kindLabel: string
  point?: string
  whenLabel: string
  past?: boolean
  kindTone?: 'realizado' | undefined
  whenTone?: 'realizado' | undefined
}>()
</script>

<template>
  <div class="agenda-item" :class="{ 'is-past': past }">
    <div class="agenda-item__date"><strong>{{ day }}</strong><span>{{ month }}</span></div>
    <div>
      <strong>{{ title }}</strong>
      <p class="meta" style="margin:2px 0 0">
        <Chip :tone="kindTone">{{ kindLabel }}</Chip>
        <template v-if="point"> · {{ point }}</template>
      </p>
    </div>
    <Chip :tone="whenTone">{{ whenLabel }}</Chip>
  </div>
</template>
