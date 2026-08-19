<script setup lang="ts">
defineProps<{
  rows: readonly { day: string; hours: string }[]
}>()
</script>

<template>
  <table class="hours-table">
    <tr v-for="row in rows" :key="row.day">
      <td>{{ row.day }}</td>
      <td>{{ row.hours }}</td>
    </tr>
  </table>
</template>
