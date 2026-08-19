<script setup lang="ts">
defineProps<{
  items: readonly { title: string; meta: string; unread?: boolean }[]
}>()
</script>

<template>
  <ul class="notify-list">
    <li v-for="item in items" :key="item.title" :class="{ 'is-unread': item.unread }">
      <span v-if="item.unread" class="notify-list__dot" />
      <div class="notify-list__body" :style="item.unread ? undefined : { marginLeft: '20px' }">
        <p class="notify-list__title">{{ item.title }}</p>
        <p class="notify-list__meta">{{ item.meta }}</p>
      </div>
    </li>
  </ul>
</template>
