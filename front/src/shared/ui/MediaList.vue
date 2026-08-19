<script setup lang="ts">
import Chip from '@ui/Chip.vue'

defineProps<{
  items: readonly {
    avatar: string
    title: string
    meta: string
    chip?: string
    chipTone?: 'realizado' | 'lleno' | 'zona-ok'
  }[]
}>()
</script>

<template>
  <ul class="media-list">
    <li v-for="item in items" :key="item.title">
      <div class="media-list__row">
        <div class="avatar">{{ item.avatar }}</div>
        <span class="media-list__body">
          <span class="media-list__title">{{ item.title }}</span>
          <span class="media-list__meta">{{ item.meta }}</span>
        </span>
        <span v-if="item.chip" class="media-list__aside">
          <Chip :tone="item.chipTone">{{ item.chip }}</Chip>
        </span>
      </div>
    </li>
  </ul>
</template>
