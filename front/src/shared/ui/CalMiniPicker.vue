<script setup lang="ts">
import { ref } from 'vue'
import Button from '@ui/Button.vue'

withDefaults(
  defineProps<{
    weekdays?: readonly string[]
    days?: readonly { day: number | null; hasEvent?: boolean; selected?: boolean }[]
    label?: string
  }>(),
  {
    weekdays: () => ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
    days: () => [
      { day: null }, { day: null },
      { day: 1 }, { day: 2 }, { day: 3, hasEvent: true }, { day: 4 }, { day: 5 },
      { day: 6, hasEvent: true, selected: true }, { day: 7 }, { day: 8 }, { day: 9 }, { day: 10 }, { day: 11 }, { day: 12 },
    ],
    label: '— 2026',
  },
)

const selected = ref(6)
</script>

<template>
  <div class="cal-mini">
    <div class="cal-mini__head">
      <Button variant="ghost" style="height:32px;padding:0 10px">‹</Button>
      <span>{{ label }}</span>
      <Button variant="ghost" style="height:32px;padding:0 10px">›</Button>
    </div>
    <div class="cal-mini__grid">
      <span v-for="weekday in weekdays" :key="weekday">{{ weekday }}</span>
      <template v-for="(cell, index) in days" :key="index">
        <span v-if="cell.day == null" />
        <button
          v-else
          type="button"
          :class="{ 'has-event': cell.hasEvent, 'is-on': selected === cell.day || cell.selected }"
          @click="selected = cell.day"
        >{{ cell.day }}</button>
      </template>
    </div>
  </div>
</template>
