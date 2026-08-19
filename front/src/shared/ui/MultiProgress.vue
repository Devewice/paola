<script setup lang="ts">
defineProps<{
  rows: readonly { label: string; value: string; width: string }[]
}>()
</script>

<template>
  <div class="multi-progress">
    <div v-for="row in rows" :key="row.label" class="multi-progress__row">
      <label><span>{{ row.label }}</span><span>{{ row.value }}</span></label>
      <div class="multi-progress__track"><div class="multi-progress__fill" :style="{ width: row.width }" /></div>
    </div>
  </div>
</template>
