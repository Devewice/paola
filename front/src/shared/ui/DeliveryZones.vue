<script setup lang="ts">
defineProps<{
  rows: readonly { zone: string; value: string; ok?: boolean }[]
}>()
</script>

<template>
  <div class="delivery-zones">
    <div
      v-for="row in rows"
      :key="row.zone"
      class="delivery-zones__row"
      :class="row.ok ? 'delivery-zones__row--ok' : 'delivery-zones__row--no'"
    >
      <span>{{ row.zone }}</span>
      <strong v-if="row.ok">{{ row.value }}</strong>
      <span v-else>{{ row.value }}</span>
    </div>
  </div>
</template>
