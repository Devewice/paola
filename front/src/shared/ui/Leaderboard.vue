<script setup lang="ts">
defineProps<{
  rows: readonly { rank: string; name: string; km: string; me?: boolean }[]
}>()
</script>

<template>
  <table class="leaderboard">
    <thead>
      <tr><th>#</th><th>Parcero</th><th>Km</th></tr>
    </thead>
    <tbody>
      <tr v-for="row in rows" :key="row.rank + row.name" :class="{ 'is-me': row.me }">
        <td class="rank">{{ row.rank }}</td>
        <td>{{ row.name }}</td>
        <td>{{ row.km }}</td>
      </tr>
    </tbody>
  </table>
</template>
