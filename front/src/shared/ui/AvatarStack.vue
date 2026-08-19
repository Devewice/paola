<script setup lang="ts">
defineProps<{
  initials: readonly string[]
  more?: string
}>()
</script>

<template>
  <span class="avatar-stack">
    <span v-for="item in initials" :key="item" class="avatar">{{ item }}</span>
  </span>
  <span v-if="more" class="avatar-stack__more">{{ more }}</span>
</template>
