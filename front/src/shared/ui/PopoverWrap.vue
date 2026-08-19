<script setup lang="ts">
defineProps<{
  style?: string | Record<string, string>
}>()
</script>

<template>
  <div class="popover-wrap" :style="style">
    <slot name="trigger" />
    <div class="popover">
      <slot />
    </div>
  </div>
</template>
