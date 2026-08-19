<script setup lang="ts">
withDefaults(
  defineProps<{
    pct?: number
    style?: string | Record<string, string>
  }>(),
  { pct: 60 },
)
</script>

<template>
  <div class="bar" :style="style">
    <span :style="{ width: `${pct}%` }" />
  </div>
</template>
