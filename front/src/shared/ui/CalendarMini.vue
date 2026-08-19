<script setup lang="ts">
defineProps<{
  month: string
  cells: readonly { label: string; muted?: boolean; on?: boolean; day?: boolean }[]
}>()
</script>

<template>
  <div class="calendar-mini">
    <div class="calendar-mini__head">{{ month }}</div>
    <div class="calendar-mini__grid">
      <span
        v-for="(cell, index) in cells"
        :key="`${cell.label}-${index}`"
        :class="{
          'is-muted': cell.muted,
          'is-day': cell.day,
          'is-on': cell.on,
        }"
      >{{ cell.label }}</span>
    </div>
  </div>
</template>
