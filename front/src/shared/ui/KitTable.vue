<script setup lang="ts">
import Chip from '@ui/Chip.vue'

defineProps<{
  columns: readonly string[]
  rows: readonly {
    cells: readonly string[]
    chip?: string
    chipTone?: 'lleno' | 'realizado' | 'zona-ok'
  }[]
}>()
</script>

<template>
  <div class="card" style="padding:0; overflow:auto">
    <table>
      <thead>
        <tr>
          <th v-for="col in columns" :key="col">{{ col }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in rows" :key="index">
          <td v-for="(cell, cellIndex) in row.cells" :key="cellIndex">{{ cell }}</td>
          <td v-if="row.chip">
            <Chip :tone="row.chipTone">{{ row.chip }}</Chip>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
