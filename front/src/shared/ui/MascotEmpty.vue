<script setup lang="ts">
defineProps<{
  sprite?: string
  title: string
  copy?: string
}>()
</script>

<template>
  <div class="mascot-empty">
    <div class="mascot-empty__sprite">{{ sprite ?? '360' }}</div>
    <strong>{{ title }}</strong>
    <p v-if="copy" class="meta" style="margin:8px 0 12px">{{ copy }}</p>
    <slot />
  </div>
</template>
