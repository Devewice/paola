<script setup lang="ts">
defineProps<{
  avatar: string
  alias: string
  meta: string
  consent?: string
}>()
</script>

<template>
  <div class="member-card">
    <div class="member-card__avatar">{{ avatar }}</div>
    <div>
      <strong>{{ alias }}</strong>
      <p class="member-card__meta">{{ meta }}</p>
      <span v-if="consent" class="chip chip-ok" style="margin-top:6px;display:inline-block">{{ consent }}</span>
    </div>
  </div>
</template>
