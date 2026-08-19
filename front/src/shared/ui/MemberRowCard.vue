<script setup lang="ts">
import Avatar from '@ui/Avatar.vue'

defineProps<{
  name: string
  meta: string
  initial: string
}>()
</script>

<template>
  <div class="card" style="display: flex; gap: 12px; align-items: center">
    <Avatar :initial="initial" />
    <div>
      <strong>{{ name }}</strong>
      <p class="sm" style="margin: 0">{{ meta }}</p>
    </div>
  </div>
</template>
