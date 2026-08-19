<script setup lang="ts">
defineProps<{
  rows: readonly { count: number; lead?: boolean }[]
  note?: string
}>()
</script>

<template>
  <div class="formation">
    <div v-for="(row, index) in rows" :key="index" class="formation__row">
      <span
        v-for="n in row.count"
        :key="n"
        class="formation__bike"
        :class="{ 'is-lead': row.lead && n === 1 }"
      />
    </div>
    <span v-if="note">{{ note }}</span>
  </div>
</template>
