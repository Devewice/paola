<script setup lang="ts">
import Chip from '@ui/Chip.vue'

defineProps<{
  chip?: string
  title: string
  meta: string
}>()
</script>

<template>
  <div class="mod-item">
    <Chip v-if="chip">{{ chip }}</Chip>
    <div>
      <strong>{{ title }}</strong>
      <p class="meta" style="margin: 4px 0 0">{{ meta }}</p>
    </div>
    <div class="mod-item__actions">
      <slot />
    </div>
  </div>
</template>
