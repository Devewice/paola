<script setup lang="ts">
defineProps<{
  stops: readonly { title: string; time: string; active?: boolean }[]
}>()
</script>

<template>
  <div class="itinerary-h">
    <div v-for="stop in stops" :key="stop.title" class="itinerary-h__stop" :class="{ 'is-active': stop.active }">
      <div class="itinerary-h__dot" />
      <strong>{{ stop.title }}</strong><br />
      {{ stop.time }}
    </div>
  </div>
</template>
