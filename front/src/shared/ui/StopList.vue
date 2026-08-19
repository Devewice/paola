<script setup lang="ts">
defineProps<{
  stops: readonly { time: string; title: string; meta: string }[]
}>()
</script>

<template>
  <ul class="stop-list">
    <li v-for="stop in stops" :key="stop.title">
      <time>{{ stop.time }}</time>
      <div>
        <strong>{{ stop.title }}</strong>
        <p class="meta" style="margin: 4px 0 0">{{ stop.meta }}</p>
      </div>
    </li>
  </ul>
</template>
