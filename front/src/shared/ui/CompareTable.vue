<script setup lang="ts">
defineProps<{
  headers: readonly string[]
  rows: readonly { label: string; cells: readonly string[] }[]
}>()
</script>

<template>
  <table class="compare-table">
    <thead>
      <tr>
        <th />
        <th v-for="header in headers" :key="header">{{ header }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in rows" :key="row.label">
        <td>{{ row.label }}</td>
        <td v-for="(cell, index) in row.cells" :key="index" :class="{ 'is-yes': cell === '✓' }">{{ cell }}</td>
      </tr>
    </tbody>
  </table>
</template>
