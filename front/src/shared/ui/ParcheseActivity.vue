<script setup lang="ts">
defineProps<{
  items: readonly { time: string; title: string; copy?: string }[]
}>()
</script>

<template>
  <ul class="parchese-activity">
    <li v-for="item in items" :key="item.title + item.time">
      <time>{{ item.time }}</time>
      <div>
        <strong>{{ item.title }}</strong>
        <p v-if="item.copy" class="meta" style="margin:2px 0 0">{{ item.copy }}</p>
      </div>
    </li>
  </ul>
</template>
