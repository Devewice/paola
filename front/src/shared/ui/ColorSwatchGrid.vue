<script setup lang="ts">
import ColorSwatch from '@ui/ColorSwatch.vue'

defineProps<{
  items: readonly { css: string; label: string; border?: boolean }[]
}>()
</script>

<template>
  <div class="grid grid-3" style="margin-bottom:24px">
    <ColorSwatch
      v-for="item in items"
      :key="item.label"
      :css="item.css"
      :label="item.label"
      :border="item.border"
    />
  </div>
</template>
