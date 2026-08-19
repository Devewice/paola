<script setup lang="ts">
defineProps<{
  rows: readonly { label: string; value: string }[]
}>()
</script>

<template>
  <table class="spec-table">
    <tr v-for="row in rows" :key="row.label">
      <th>{{ row.label }}</th>
      <td>{{ row.value }}</td>
    </tr>
  </table>
</template>
