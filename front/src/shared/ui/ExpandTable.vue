<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  rows: readonly { id: string; order: string; status: string; detail: string }[]
}>()

const open = ref<Record<string, boolean>>({})

function toggle(id: string): void {
  open.value = { ...open.value, [id]: !open.value[id] }
}
</script>

<template>
  <table class="expand-table">
    <thead><tr><th /><th>Pedido</th><th>Estado</th></tr></thead>
    <tbody>
      <template v-for="row in rows" :key="row.id">
        <tr class="expand-table__row">
          <td>
            <button type="button" class="expand-toggle" :aria-expanded="open[row.id]" @click="toggle(row.id)">
              {{ open[row.id] ? '▾' : '▸' }}
            </button>
          </td>
          <td>{{ row.order }}</td>
          <td>{{ row.status }}</td>
        </tr>
        <tr v-if="open[row.id]" class="expand-table__detail"><td colspan="3">{{ row.detail }}</td></tr>
      </template>
    </tbody>
  </table>
</template>
