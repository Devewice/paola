<script setup lang="ts">
defineProps<{
  avatar: string
  title: string
  meta?: string
  blocked?: boolean
}>()
</script>

<template>
  <div class="friend-row">
    <div class="comment-item__avatar" style="width:40px;height:40px">{{ avatar }}</div>
    <div>
      <strong>{{ title }}</strong>
      <p v-if="meta" class="meta" style="margin:2px 0 0">{{ meta }}</p>
    </div>
    <div v-if="!blocked && $slots.default" class="friend-row__actions">
      <slot />
    </div>
  </div>
</template>
